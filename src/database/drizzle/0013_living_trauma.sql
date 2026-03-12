ALTER TYPE "public"."issues_properties_types" RENAME TO "tasks_properties_types";--> statement-breakpoint
ALTER TYPE "public"."issues_types" RENAME TO "tasks_types";--> statement-breakpoint
ALTER TABLE "issues" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "issues_properties" RENAME TO "tasks_properties";--> statement-breakpoint
ALTER TABLE "issues_properties_values" RENAME TO "tasks_properties_values";--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "issues_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "issues_stage_id_stages_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "issues_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "issues_assigned_to_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_properties" DROP CONSTRAINT "issues_properties_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_properties_values" DROP CONSTRAINT "issues_properties_values_issue_id_issues_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_properties_values" DROP CONSTRAINT "issues_properties_values_property_id_issues_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks_properties_values" DROP CONSTRAINT "issues_properties_values_value_select_property_options_id_fk";
--> statement-breakpoint
ALTER TABLE "property_options" DROP CONSTRAINT "property_options_property_id_issues_properties_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_properties" ADD CONSTRAINT "tasks_properties_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_properties_values" ADD CONSTRAINT "tasks_properties_values_issue_id_tasks_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_properties_values" ADD CONSTRAINT "tasks_properties_values_property_id_tasks_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."tasks_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_properties_values" ADD CONSTRAINT "tasks_properties_values_value_select_property_options_id_fk" FOREIGN KEY ("value_select") REFERENCES "public"."property_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_options" ADD CONSTRAINT "property_options_property_id_tasks_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."tasks_properties"("id") ON DELETE no action ON UPDATE no action;