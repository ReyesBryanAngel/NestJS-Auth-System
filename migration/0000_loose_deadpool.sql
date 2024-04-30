CREATE TABLE IF NOT EXISTS "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(64) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(256) NOT NULL,
	"contact_name" varchar(256),
	"contact_title" varchar(128),
	"address" text,
	"city" varchar(128),
	"postal_code" varchar(12),
	"country" varchar(128),
	"phone" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"employee_id" serial PRIMARY KEY NOT NULL,
	"last_name" varchar(128) NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"title" varchar(128),
	"birth_date" date,
	"hire_date" date,
	"address" text,
	"city" varchar(128),
	"region" varchar(128),
	"postal_code" varchar(12),
	"country" varchar(128),
	"phone" varchar(24),
	"extension" varchar(4),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_details" (
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"unit_price" real,
	"quantity" integer NOT NULL,
	"discount" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"employee_id" integer,
	"order_date" date,
	"shipping_date" date,
	"shipper_id" integer,
	"freight" real,
	"ship_name" varchar(256),
	"ship_address" text,
	"ship_city" varchar(128),
	"ship_postal_code" varchar(12),
	"ship_country" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" varchar(256) NOT NULL,
	"supplier_id" integer,
	"category_id" integer,
	"quantity_per_unit" varchar(24),
	"unit_price" real,
	"units_in_stock" integer,
	"units_on_order" integer,
	"reorder_level" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reset_password_tokens" (
	"email" varchar(64),
	"otp" varchar(6),
	"is_used" boolean,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shippers" (
	"shipper_id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(256) NOT NULL,
	"phone" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suppliers" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(256) NOT NULL,
	"contact_name" varchar(128),
	"contact_title" varchar(128),
	"address" text,
	"city" varchar(128),
	"region" varchar(128),
	"postal_code" varchar(12),
	"country" varchar(128),
	"phone" varchar(24)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar(64) NOT NULL,
	"lastname" varchar(64) NOT NULL,
	"email" varchar(64),
	"is_verified" boolean,
	"mobile" varchar(64),
	"mobile_verified" boolean,
	"password" varchar(64) NOT NULL,
	"confirm_password" varchar(64) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_employee_id_employees_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_shipper_id_shippers_shipper_id_fk" FOREIGN KEY ("shipper_id") REFERENCES "shippers"("shipper_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
