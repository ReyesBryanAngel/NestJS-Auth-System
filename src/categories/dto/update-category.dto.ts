import { InferSelectModel } from 'drizzle-orm';
import { categories } from '../../drizzle/schema';

export class UpdateCategoryDto
  implements Partial<InferSelectModel<typeof categories>>
{
  categoryName?: string;
  description?: string;
}
