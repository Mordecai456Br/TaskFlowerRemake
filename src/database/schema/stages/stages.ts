import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";
import { projects } from "../projects";

export const stages = pgTable('stages', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 50}).notNull(),
    order: integer('order').notNull().default(1),
    projectId: integer('project_id')
        .references(() => projects.id).notNull(),
    ...timestamps
})

export type Stage = typeof stages.$inferSelect;
export type NewStage = typeof stages.$inferInsert;
