import { InferSelectModel } from 'drizzle-orm';
import { categories } from '../../drizzle/schema';

export class CreateCategoryDto implements InferSelectModel<typeof categories> {
  categoryID: number;
  categoryName: string;
  description: string;
}
