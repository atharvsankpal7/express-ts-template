CREATE TYPE "public"."user_role_enum" AS ENUM('customer', 'manager', 'admin');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "fullName" TO "full_name";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "user_role_enum" DEFAULT 'customer' NOT NULL;