import {boolean, date, integer, pgEnum, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {projects, projectTags} from "./project";
import {localDate} from "drizzle-orm/gel-core";
import {timestamps} from "../helpers";
import {type} from "node:os";
import {user} from "./auth";


export const prioritiesEnum = pgEnum('priorities',
    ['LOW', 'MEDIUM', 'HIGH']
);

export const issuesTypesEnum = pgEnum('issues_types',
    ['TASK', 'BUG', 'FEATURE', 'NOTE'])

export const issuesPropertiesTypesEnum = pgEnum('issues_properties_types',
    ['STRING', 'NUMBER', 'SELECT', 'BOOLEAN', 'DATE'])

export const stages = pgTable('stages', {
    id: serial().primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 50}).notNull(),
    order: integer('order').notNull().default(1),
    projectId: integer('project_id')
        .references(() => projects.id).notNull(),
...timestamps
})

export const issues_properties = pgTable('issues_properties', {
    id: serial().primaryKey(),
    title: varchar('title', {length: 24}).notNull(),
    projectId: integer('project_id').references(() => projects.id).notNull(),
    type: issuesPropertiesTypesEnum('type').notNull(),
        ...timestamps
})

export const property_select_options = pgTable('property_options', {
    id: serial().primaryKey(),
    propertyId: integer('property_id').references(() => issues_properties.id).notNull(),
    value: varchar('value'),
    color: varchar('color'),
    ...timestamps
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
    created_by: integer('created_by').references(() => user.id).notNull(),
    assigned_to: integer('assigned_to').references(() => user.id).notNull(),
    deadline: date('deadline').notNull(),
    estimatedTime: date('estimated_time'),
    resolvedAt: date('resolved_at'),
    ...timestamps

});

export const issues_properties_values = pgTable('issues_properties_values', {
    id: serial().primaryKey(),
    issue_id: integer('issue_id').references(() => issues.id).notNull(),
    property_id: integer('property_id').references(() => issues_properties.id).notNull(),
    value_text: varchar('value_text'),
    value_number: integer('value_number'),
    value_date: date(),
    value_boolean: boolean('value_boolean'),
    value_select: integer('value_select')
        .references(() => property_select_options.id).notNull(),
...timestamps
})
stages
issues_properties
property_select_options
issues
issues_properties_values

export type Stage = typeof stages.$inferSelect;
export type NewStage = typeof stages.$inferInsert;

export type IssueProperties = typeof issues_properties.$inferSelect;
export type NewIssueProperties = typeof issues_properties.$inferInsert;

export type PropertySelectOptions = typeof property_select_options.$inferSelect;
export type NewPropertySelectOptions = typeof property_select_options.$inferInsert;

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;

export type IssuesPropertiesValues = typeof issues_properties_values.$inferSelect;
export type NewIssuesPropertiesValues = typeof issues_properties_values.$inferInsert;
