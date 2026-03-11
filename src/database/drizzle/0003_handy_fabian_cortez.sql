CREATE TYPE "public"."tags_types_enum" AS ENUM('category', 'tech', 'team');--> statement-breakpoint
CREATE TABLE "projectTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" serial NOT NULL,
	"tagId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"type" "tags_types_enum" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "title" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "mediaUrl" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "projectTags" ADD CONSTRAINT "projectTags_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectTags" ADD CONSTRAINT "projectTags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "tags";