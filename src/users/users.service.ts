import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE_ORM } from '../core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';

@Injectable()
export class UsersService {
  private readonly db: PostgresJsDatabase<typeof schema>;

  constructor(@Inject(DRIZZLE_ORM) db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }

  async create(createUserDto: CreateUserDto) {
    return this.db.insert(schema.users).values(createUserDto).returning();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
