import { Inject, Injectable } from '@nestjs/common';
import { InferSelectModel, eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DRIZZLE_ORM) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createCategoryDto: InferSelectModel<typeof schema.categories>) {
    return await this.db
      .insert(schema.categories)
      .values(createCategoryDto)
      .returning();
  }

  async findAll() {
    return await this.db.select().from(schema.categories);
  }

  async findOne(id: number) {
    return await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.categoryID, +id));
  }

  async update(
    id: number,
    updateCategoryDto: Partial<InferSelectModel<typeof schema.categories>>,
  ) {
    return await this.db
      .update(schema.categories)
      .set(updateCategoryDto)
      .where(eq(schema.categories.categoryID, id))
      .returning();
  }

  async remove(id: number) {
    return await this.db
      .delete(schema.categories)
      .where(eq(schema.categories.categoryID, id))
      .returning();
  }
}
