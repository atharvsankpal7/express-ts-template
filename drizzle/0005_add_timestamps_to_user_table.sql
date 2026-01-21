ALTER TABLE "users" ADD COLUMN "timestamp1" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timestamp2" timestamp DEFAULT now() NOT NULL;