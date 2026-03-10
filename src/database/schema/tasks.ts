import {date, integer, pgEnum, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {projects} from "./project";
import {localDate} from "drizzle-orm/gel-core";
import {timestamps} from "../helpers";
import {type} from "node:os";


export const prioritiesEnum = pgEnum('priorities',
    ['LOW', 'MEDIUM', 'HIGH']
);

export const issuesTypesEnum = pgEnum('issuesTypes',
    ['TASK', 'BUG', 'FEATURE', 'NOTE'])

export const stages = pgTable('stages', {
    id: serial().primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 50}).notNull(),
    order: integer('order').notNull().default(1),
    projectId: integer('project_id')
        .references(() => projects.id).notNull(),
})

export const issues = pgTable('issues', {
    id: serial().primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 250}).notNull(),
    type: issuesTypesEnum('type').notNull(),
    projectId: integer('project_id').notNull()
        .references(() => projects.id),
    stageId: integer('stage_id')
        .references(() => stages.id),
    priority: prioritiesEnum('priority').notNull(),
    deadline: date('deadline').notNull(),
    estimatedTime: date('estimated_time'),
    resolvedAt: date('resolved_at'),
    ...timestamps

});

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;