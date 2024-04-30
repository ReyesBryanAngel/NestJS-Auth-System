ALTER TABLE "users" ALTER COLUMN "deleted" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "deleted" DROP NOT NULL;