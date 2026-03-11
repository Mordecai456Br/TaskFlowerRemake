CREATE TYPE "public"."issues_properties_types" AS ENUM('STRING', 'NUMBER', 'SELECT', 'BOOLEAN', 'DATE');--> statement-breakpoint
CREATE TYPE "public"."issues_types" AS ENUM('TASK', 'BUG', 'FEATURE', 'NOTE');--> statement-breakpoint
CREATE TABLE "issues_properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(24) NOT NULL,
	"project_id" integer NOT NULL,
	"type" "issues_properties_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issues_properties_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"value_text" varchar,
	"value_number" integer,
	"value_timestamp" timestamp,
	"value_boolean" boolean,
	"value_select" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"value" varchar,
	"color" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "type" SET DATA TYPE "public"."issues_types" USING "type"::text::"public"."issues_types";--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "deadline" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "resolved_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "assigned_to" text NOT NULL;--> statement-breakpoint
ALTER TABLE "issues" ADD COLUMN "estimated_minutes" integer;--> statement-breakpoint
ALTER TABLE "stages" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stages" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "issues_properties" ADD CONSTRAINT "issues_properties_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_properties_values" ADD CONSTRAINT "issues_properties_values_issue_id_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_properties_values" ADD CONSTRAINT "issues_properties_values_property_id_issues_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."issues_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_properties_values" ADD CONSTRAINT "issues_properties_values_value_select_property_options_id_fk" FOREIGN KEY ("value_select") REFERENCES "public"."property_options"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_options" ADD CONSTRAINT "property_options_property_id_issues_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."issues_properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."issuesTypes";