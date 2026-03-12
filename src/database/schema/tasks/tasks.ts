import {boolean, timestamp, integer, pgEnum, pgTable, serial, varchar, text, date} from "drizzle-orm/pg-core";
import {projects} from "../projects/projects";
import {timestamps} from "../../helpers";
import {relations} from "drizzle-orm";
import {user} from "../auth/auth";
import {stages} from "../stages/stages";


export const prioritiesEnum = pgEnum('priorities',
    ['LOW', 'MEDIUM', 'HIGH']
);

export const tasksTypesEnum = pgEnum('tasks_types',
    ['TASK', 'BUG', 'FEATURE', 'NOTE'])

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 250}).notNull(),
    type: tasksTypesEnum('type').notNull(),
    projectId: integer('project_id').notNull()
        .references(() => projects.id),
    stageId: integer('stage_id')
        .references(() => stages.id),
    priority: prioritiesEnum('priority').notNull(),
    created_by: text('created_by').references(() => user.id).notNull(),
    assigned_to: text('assigned_to').references(() => user.id).notNull(),
    deadline: timestamp('deadline').notNull(),
    estimatedTimeMinutes: integer('estimated_minutes'),
    resolvedAt: timestamp('resolved_at'),
    ...timestamps

});




export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
