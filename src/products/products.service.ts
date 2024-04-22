import { Inject, Injectable } from '@nestjs/common';
import { InferSelectModel, eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE_ORM) private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async create(createProductDto: InferSelectModel<typeof schema.products>) {
    return this.db.insert(schema.products).values(createProductDto).returning();
  }

  async findAll() {
    return await this.db.select().from(schema.products);
  }

  async findOne(id: number) {
    return this.db
      .select()
      .from(schema.products)
      .where(eq(schema.products.productID, +id));
  }

  async update(
    id: number,
    updateProductDto: Partial<InferSelectModel<typeof schema.products>>,
  ) {
    return this.db
      .update(schema.products)
      .set(updateProductDto)
      .where(eq(schema.products.productID, id))
      .returning();
  }

  async remove(id: number) {
    return this.db
      .delete(schema.products)
      .where(eq(schema.products.productID, id))
      .returning();
  }
}
