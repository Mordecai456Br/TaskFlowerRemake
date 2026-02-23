DO $$ BEGIN
CREATE TYPE "public"."default_project_category" AS ENUM(...);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "default_project_category" NOT NULL,
	"tags" text,
	"mediaUrl" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
