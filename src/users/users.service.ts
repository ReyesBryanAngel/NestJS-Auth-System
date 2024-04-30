import { Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';
import { eq, or } from 'drizzle-orm';
import { hash } from 'bcrypt';

export class UsersService {
  private readonly db: PostgresJsDatabase<typeof schema>;

  constructor(@Inject(DRIZZLE_ORM) db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async register(createUserDto: CreateUserDto) {
    const { password, confirm_password, ...otherValues } = createUserDto;
    const hashedPassword = await hash(password, 10);
    const hashedConfirmPassword = await hash(confirm_password, 10);

    return this.db
      .insert(schema.users)
      .values({
        ...otherValues,
        password: hashedPassword,
        confirm_password: hashedConfirmPassword,
      })
      .returning();
  }

  async registerFromUpdate(createUserDto: CreateUserDto) {
    const { password, confirm_password, ...otherValues } = createUserDto;
    const hashedPassword = await hash(password, 10);
    const hashedConfirmPassword = await hash(confirm_password, 10);

    await this.db
      .update(schema.users)
      .set({
        password: hashedPassword,
        confirm_password: hashedConfirmPassword,
        firstname: otherValues.firstname,
        lastname: otherValues.lastname,
        mobile: otherValues.mobile,
        deleted: false,
      })
      .where(eq(schema.users.email, otherValues.email));
  }

  findAll() {
    return `This action returns all users`;
  }

  async findUser(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    return user;
  }

  async findUserMobile(mobile: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.mobile, mobile),
    });

    return user;
  }

  async updateIsVerify(userId: number) {
    await this.db
      .update(schema.users)
      .set({ is_verified: true, deleted: false })
      .where(eq(schema.users.userId, userId));
  }

  async updateIsMobileVerify(userId: number) {
    await this.db
      .update(schema.users)
      .set({ mobileVerified: true, deleted: false })
      .where(eq(schema.users.userId, userId));
  }

  async updateProfile(userId: number, updateUserDto) {
    const { firstname, lastname, email, mobile } = updateUserDto;
    const userDetails = await this.findById(userId);
    const isEmailVerified = email && userDetails.email !== email ? false : true;
    const isMobileVerified =
      mobile && userDetails.mobile !== mobile ? false : true;

    await this.db
      .update(schema.users)
      .set({
        firstname: firstname,
        lastname: lastname,
        email: email,
        is_verified: isEmailVerified,
        mobile: mobile,
        mobileVerified: isMobileVerified,
      })
      .where(eq(schema.users.userId, userId));
  }

  async findById(userId: number) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.userId, userId),
    });

    return user;
  }

  async findByEmail(emailOrMobile: string) {
    const user = await this.db.query.users.findFirst({
      where: or(
        eq(schema.users.email, emailOrMobile),
        eq(schema.users.mobile, emailOrMobile),
      ),
    });

    return user;
  }

  async removeUser(id: number) {
    await this.db
      .update(schema.users)
      .set({ deleted: true, is_verified: false, mobileVerified: false })
      .where(eq(schema.users.userId, id));
  }
}
