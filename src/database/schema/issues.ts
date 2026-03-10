import {boolean, timestamp, integer, pgEnum, pgTable, serial, varchar, text} from "drizzle-orm/pg-core";
import {projects} from "./project";
import {timestamps} from "../helpers";
import {relations} from "drizzle-orm";
import {user} from "./auth";


export const prioritiesEnum = pgEnum('priorities',
    ['LOW', 'MEDIUM', 'HIGH']
);

export const issuesTypesEnum = pgEnum('issues_types',
    ['TASK', 'BUG', 'FEATURE', 'NOTE'])

export const issuesPropertiesTypesEnum = pgEnum('issues_properties_types',
    ['STRING', 'NUMBER', 'SELECT', 'BOOLEAN', 'DATE'])

export const stages = pgTable('stages', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 50}).notNull(),
    order: integer('order').notNull().default(1),
    projectId: integer('project_id')
        .references(() => projects.id).notNull(),
...timestamps
})

export const issues_properties = pgTable('issues_properties', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 24}).notNull(),
    projectId: integer('project_id').references(() => projects.id).notNull(),
    type: issuesPropertiesTypesEnum('type').notNull(),
        ...timestamps
})

export const property_select_options = pgTable('property_options', {
    id: serial('id').primaryKey(),
    propertyId: integer('property_id').references(() => issues_properties.id).notNull(),
    value: varchar('value'),
    color: varchar('color'),
    ...timestamps
})

export const issues = pgTable('issues', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 250}).notNull(),
    type: issuesTypesEnum('type').notNull(),
    projectId: integer('project_id').notNull()
        .references(() => projects.id),
    stageId: integer('stage_id')
        .references(() => stages.id),
    priority: prioritiesEnum('priority').notNull(),
    created_by: text('created_by').references(() => user.id).notNull(),
    assigned_to: text('assigned_to').references(() => user.id).notNull(),
    deadline: timestamp('deadline').notNull(),
    estimatedTime: integer('estimated_time'),
    resolvedAt: timestamp('resolved_at'),
    ...timestamps

});

export const issues_properties_values = pgTable('issues_properties_values', {
    id: serial('id').primaryKey(),
    issue_id: integer('issue_id').references(() => issues.id).notNull(),
    property_id: integer('property_id').references(() => issues_properties.id).notNull(),
    value_text: varchar('value_text'),
    value_number: integer('value_number'),
    value_timestamp: timestamp(),
    value_boolean: boolean('value_boolean'),
    value_select: integer('value_select')
        .references(() => property_select_options.id),
...timestamps
})

export const issuesProjectsRelations = relations (issues, ({ many, one }) => ({
    issues: many(issues),
    projects: one(projects, {
        fields: [issues.projectId],
        references: [projects.id]
    })
}));

export const issuesStagesRelations = relations (issues, ({ many, one }) => ({
    issues: many(issues),
    stages: one(stages, {
        fields: [issues.stageId],
        references: [stages.id]
    })
}));

export const stagesProjectsRelations = relations (stages, ({ one, many }) => ({
    projects: one(projects, {
        fields:[stages.projectId],
        references:[projects.id]
    }),
    issues: many(issues)
})) 

export const stageProjectRelations = relations (projects, ({ one }) => ({
    projects: one(projects)
}))


// projects 1 : n tasks
// tasks n : 1 stages
// tasks 1 : n pessoa
// teams n : n projects
// teams 1 : n pessoas
// pessoa 1 : login


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
