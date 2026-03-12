import {boolean, integer, pgEnum, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";
import {projects} from "../projects";
import {timestamps} from "../../helpers";
import {tasks} from "./tasks";

export const tasksPropertiesTypesEnum = pgEnum('tasks_properties_types',
    ['STRING', 'NUMBER', 'SELECT', 'BOOLEAN', 'DATE'])

export const tasks_properties = pgTable('tasks_properties', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 24}).notNull(),
    projectId: integer('project_id').references(() => projects.id).notNull(),
    type: tasksPropertiesTypesEnum('type').notNull(),
    ...timestamps
})

export const property_select_options = pgTable('property_options', {
    id: serial('id').primaryKey(),
    propertyId: integer('property_id').references(() => tasks_properties.id).notNull(),
    value: varchar('value'),
    color: varchar('color'),
    ...timestamps
})
export const tasks_properties_values = pgTable('tasks_properties_values', {
    id: serial('id').primaryKey(),
    taskId: integer('issue_id').references(() => tasks.id).notNull(),
    propertyId: integer('property_id').references(() => tasks_properties.id).notNull(),
    valueText: varchar('value_text'),
    valueNumber: integer('value_number'),
    valueTimestamp: timestamp(),
    valueBoolean: boolean('value_boolean'),
    valueSelect: integer('value_select')
        .references(() => property_select_options.id),
    ...timestamps
})

export type TaskProperty = typeof tasks_properties.$inferSelect;
export type NewTaskProperty = typeof tasks_properties.$inferInsert;

export type PropertySelectOptions = typeof property_select_options.$inferSelect;
export type NewPropertySelectOptions = typeof property_select_options.$inferInsert;

export type TaskPropertyValue = typeof tasks_properties_values.$inferSelect;
export type NewTaskPropertyValue = typeof tasks_properties_values.$inferInsert;
