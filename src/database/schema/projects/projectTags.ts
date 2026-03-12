import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { tags } from "../tags/tags";

export const projectTags = pgTable(
    "project_tags",
    {
        projectId: integer("project_id").notNull().references(() => projects.id),
        tagId: integer("tag_id").notNull().references(() => tags.id),
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.projectId, table.tagId],
        }),
    })
);

export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;
