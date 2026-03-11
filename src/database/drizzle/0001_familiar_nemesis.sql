UPDATE "projects" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "teste" text;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "deleted_at";