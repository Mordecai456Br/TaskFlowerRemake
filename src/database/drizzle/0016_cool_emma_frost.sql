--> statement-breakpoint
CREATE TABLE "project_teams" (
	"project_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	CONSTRAINT "project_teams_project_id_team_id_pk" PRIMARY KEY("project_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams_tags" (
	"team_id" integer,
	"tag_id" integer,
	CONSTRAINT "teams_tags_team_id_tag_id_pk" PRIMARY KEY("team_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "teams_users" (
	"team_id" integer,
	"user_id" text,
	CONSTRAINT "teams_users_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "project_teams" ADD CONSTRAINT "project_teams_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_teams" ADD CONSTRAINT "project_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_tags" ADD CONSTRAINT "teams_tags_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_tags" ADD CONSTRAINT "teams_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_users" ADD CONSTRAINT "teams_users_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams_users" ADD CONSTRAINT "teams_users_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
