import {boolean, integer, pgTable, serial} from "drizzle-orm/pg-core";
import {projects} from "./projects";

export const projectSettings = pgTable('project_settings', {
id: serial('id').primaryKey(),
    isPublic: boolean('is_public').default(false),
    projectId: integer('project_id')
        .references(()=> projects.id)
        .notNull()
        .unique(),
})

export type ProjectSettings = typeof projectSettings.$inferSelect;
export type NewProjectSettings = typeof projectSettings.$inferInsert;