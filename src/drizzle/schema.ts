import { relations } from 'drizzle-orm';
import {
  serial,
  real,
  pgTable,
  varchar,
  integer,
  text,
  date,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  firstname: varchar('firstname', { length: 64 }).notNull(),
  lastname: varchar('lastname', { length: 64 }).notNull(),
  email: varchar('email', { length: 64 }),
  is_verified: boolean('is_verified'),
  mobile: varchar('mobile', { length: 64 }),
  mobileVerified: boolean('mobile_verified'),
  password: varchar('password', { length: 64 }).notNull(),
  confirm_password: varchar('confirm_password', { length: 64 }).notNull(),
  deleted: boolean('deleted'),
});

export const resetPasswordTokens = pgTable('reset_password_tokens', {
  email: varchar('email', { length: 64 }),
  otp: varchar('otp', { length: 6 }),
  isUsed: boolean('is_used'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const categories = pgTable('categories', {
  categoryID: serial('category_id').primaryKey(),
  categoryName: varchar('category_name', { length: 64 }).notNull(),
  description: text('description'),
});

export const customers = pgTable('customers', {
  customerID: serial('customer_id').primaryKey(),
  companyName: varchar('company_name', { length: 256 }).notNull(),
  contactName: varchar('contact_name', { length: 256 }),
  contactTitle: varchar('contact_title', { length: 128 }),
  address: text('address'),
  city: varchar('city', { length: 128 }),
  postalCode: varchar('postal_code', { length: 12 }),
  country: varchar('country', { length: 128 }),
  phone: varchar('phone', { length: 64 }),
});

export const shippers = pgTable('shippers', {
  shipperID: serial('shipper_id').primaryKey(),
  companyName: varchar('company_name', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 64 }),
});

export const orders = pgTable('orders', {
  orderID: serial('order_id').primaryKey(),
  customerID: integer('customer_id').references(() => customers.customerID),
  employeeID: integer('employee_id').references(() => employees.employeeID),
  orderDate: date('order_date', { mode: 'date' }),
  shippingDate: date('shipping_date', { mode: 'date' }),
  shipperId: integer('shipper_id').references(() => shippers.shipperID),
  freight: real('freight'),
  shipName: varchar('ship_name', { length: 256 }),
  shipAddress: text('ship_address'),
  shipCity: varchar('ship_city', { length: 128 }),
  shipPostalCode: varchar('ship_postal_code', { length: 12 }),
  shipCountry: varchar('ship_country', { length: 128 }),
});

export const products = pgTable('products', {
  productID: serial('product_id').primaryKey(),
  productName: varchar('product_name', { length: 256 }).notNull(),
  supplierID: integer('supplier_id').references(() => suppliers.supplierID),
  categoryID: integer('category_id').references(() => categories.categoryID),
  quantityPerUnit: varchar('quantity_per_unit', { length: 24 }),
  unitPrice: real('unit_price'),
  unitsInStock: integer('units_in_stock'),
  unitsOnOrder: integer('units_on_order'),
  reorderLevel: integer('reorder_level'),
});

export const suppliers = pgTable('suppliers', {
  supplierID: serial('supplier_id').primaryKey(),
  companyName: varchar('company_name', { length: 256 }).notNull(),
  contactName: varchar('contact_name', { length: 128 }),
  contactTitle: varchar('contact_title', { length: 128 }),
  address: text('address'),
  city: varchar('city', { length: 128 }),
  region: varchar('region', { length: 128 }),
  postalCode: varchar('postal_code', { length: 12 }),
  country: varchar('country', { length: 128 }),
  phone: varchar('phone', { length: 24 }),
});

export const orderDetails = pgTable('order_details', {
  orderID: integer('order_id')
    .references(() => orders.orderID)
    .notNull(),
  productID: integer('product_id')
    .references(() => products.productID)
    .notNull(),
  unitPrice: real('unit_price'),
  quantity: integer('quantity').notNull(),
  discount: real('discount'),
});

export const employees = pgTable('employees', {
  employeeID: serial('employee_id').primaryKey(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  title: varchar('title', { length: 128 }),
  birthDate: date('birth_date', { mode: 'date' }),
  hireDate: date('hire_date', { mode: 'date' }),
  address: text('address'),
  city: varchar('city', { length: 128 }),
  region: varchar('region', { length: 128 }),
  postalCode: varchar('postal_code', { length: 12 }),
  country: varchar('country', { length: 128 }),
  phone: varchar('phone', { length: 24 }),
  extension: varchar('extension', { length: 4 }),
  notes: text('notes'),
});

export const customerOrderRelation = relations(customers, ({ many }) => ({
  orders: many(customers),
}));

export const orderEmployeeRelation = relations(orders, ({ one }) => ({
  employee: one(employees, {
    fields: [orders.employeeID],
    references: [employees.employeeID],
  }),
}));

export const orderShipperRelation = relations(orders, ({ one }) => ({
  shipper: one(shippers, {
    fields: [orders.shipperId],
    references: [shippers.shipperID],
  }),
}));

export const orderDetailProductRelation = relations(
  orderDetails,
  ({ one }) => ({
    product: one(products, {
      fields: [orderDetails.productID],
      references: [products.productID],
    }),
  }),
);

export const productSupplierRelation = relations(products, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierID],
    references: [suppliers.supplierID],
  }),
}));

export const productCategoryRelation = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryID],
    references: [categories.categoryID],
  }),
}));
