import { InferSelectModel } from 'drizzle-orm';
import { products } from '../../drizzle/schema';

export class CreateProductDto implements InferSelectModel<typeof products> {
  productID: number;
  productName: string;
  supplierID: number;
  categoryID: number;
  quantityPerUnit: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
  reorderLevel: number;
}
