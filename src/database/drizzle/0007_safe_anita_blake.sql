ALTER TABLE "project_categories" RENAME TO "categories_of_project";--> statement-breakpoint
ALTER TABLE "categories_of_project" DROP CONSTRAINT "project_categories_name_unique";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_category_id_project_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_of_project_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories_of_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories_of_project" ADD CONSTRAINT "categories_of_project_name_unique" UNIQUE("name");