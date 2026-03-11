CREATE TYPE "public"."issuesTypes" AS ENUM('TASK', 'BUG', 'FEATURE', 'NOTE');--> statement-breakpoint
CREATE TYPE "public"."priorities" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(250) NOT NULL,
	"type" "issuesTypes" NOT NULL,
	"project_id" integer NOT NULL,
	"stage_id" integer,
	"priority" "priorities" NOT NULL,
	"deadline" date NOT NULL,
	"estimated_time" date,
	"resolved_at" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(50) NOT NULL,
	"description" varchar(50) NOT NULL,
	"order" integer DEFAULT 1 NOT NULL,
	"project_id" integer NOT NULL
);
--> statement-breakpoint

ALTER TABLE "issues" ADD CONSTRAINT "issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
