ALTER TABLE "projects" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "github_url" varchar;
ALTER TABLE "tags" DROP COLUMN "type";
DROP TYPE "public"."default_project_category";--> statement-breakpoint
DROP TYPE "public"."tags_types_enum";