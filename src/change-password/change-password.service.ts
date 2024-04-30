import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { CreateChangePasswordDto } from './dto/create-change-password.dto';
import { hash } from 'bcrypt';

@Injectable()
export class ChangePasswordService {
  private readonly db: PostgresJsDatabase<typeof schema>;
  constructor(@Inject(DRIZZLE_ORM) db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async changePassword(createChangePasswordDto: CreateChangePasswordDto) {
    const { password, confirmPassword, otp } = createChangePasswordDto;

    const hashedPassword = await hash(password, 10);
    const hashedConfirmPassword = await hash(confirmPassword, 10);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

    const resetTokens = await this.db.query.resetPasswordTokens.findFirst({
      where: eq(schema.resetPasswordTokens.otp, otp),
    });

    switch (true) {
      case !resetTokens:
        throw new HttpException('OTP is incorrect.', HttpStatus.UNAUTHORIZED);
      case resetTokens.isUsed:
        throw new HttpException(
          'Reset token has already been used.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      case resetTokens.updatedAt < fiveMinutesAgo:
        throw new HttpException(
          'OTP has expired. Please send a request for forgot password again.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    await this.db
      .update(schema.users)
      .set({
        password: hashedPassword,
        confirm_password: hashedConfirmPassword,
      })
      .where(eq(schema.users.email, resetTokens.email));

    await this.db
      .update(schema.resetPasswordTokens)
      .set({
        isUsed: true,
      })
      .where(eq(schema.resetPasswordTokens.otp, otp));

    return {
      code: 200,
      status: 'success',
      message: 'Password has been changed successfully',
    };
  }
}
