import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ForgotPasswordService {
  private readonly db: PostgresJsDatabase<typeof schema>;
  constructor(
    @Inject(DRIZZLE_ORM) db: PostgresJsDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {
    this.db = db;
  }

  async forgotPassword(createForgotPasswordDto: CreateForgotPasswordDto) {
    const { email } = createForgotPasswordDto;
    const currentTime = new Date();
    const currentTimeWithTime = new Date();
    currentTimeWithTime.setHours(currentTime.getHours());
    currentTimeWithTime.setMinutes(currentTime.getMinutes());
    currentTimeWithTime.setSeconds(currentTime.getSeconds());
    currentTimeWithTime.setMilliseconds(currentTime.getMilliseconds());

    const user = await this.usersService.findUser(email);
    if (!user) {
      return false;
    }

    const doesUserResetPasswordBefore =
      await this.findUserInResetPasswordTable(email);
    const createdAtTimestamp = new Date(doesUserResetPasswordBefore?.updatedAt);
    const timeDifferenceInMilliseconds =
      currentTime.getTime() - createdAtTimestamp.getTime();
    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);

    if (timeDifferenceInMinutes > 5) {
      if (
        doesUserResetPasswordBefore?.email != null &&
        doesUserResetPasswordBefore?.email != undefined
      ) {
        return this.db
          .update(schema.resetPasswordTokens)
          .set({ otp: null, updatedAt: currentTimeWithTime, isUsed: false })
          .where(eq(schema.resetPasswordTokens.email, email));
      }

      return this.db
        .insert(schema.resetPasswordTokens)
        .values({ email: email, createdAt: currentTimeWithTime })
        .returning();
    } else {
      throw new HttpException(
        'Password has been changed recently. Please wait 5 minutes to request for a reset password again.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async findUserInResetPasswordTable(email: string) {
    const user = await this.db.query.resetPasswordTokens.findFirst({
      where: eq(schema.users.email, email),
    });

    return user;
  }

  async resetPassword(createForgotPasswordDto: CreateForgotPasswordDto) {
    const { otp, email } = createForgotPasswordDto;
    await this.db
      .update(schema.resetPasswordTokens)
      .set({ otp: otp, isUsed: true })
      .where(eq(schema.resetPasswordTokens.email, email));
  }
}
