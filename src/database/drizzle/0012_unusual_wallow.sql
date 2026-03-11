UPDATE "issues" SET "estimated_minutes" = EXTRACT(EPOCH FROM "estimated_time")/60;
ALTER TABLE "issues" DROP COLUMN "estimated_time";