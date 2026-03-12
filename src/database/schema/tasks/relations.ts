import {relations} from "drizzle-orm";
import {projects} from "../projects";
import {stages} from "../stages";
import {tasks} from "./tasks";
import {property_select_options, tasks_properties, tasks_properties_values} from "./tasksProperties";


export const tasksRelations = relations(tasks, ({one, many}) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id]
    }),
    stage: one(stages, {
        fields: [tasks.stageId],
        references: [stages.id]
    }),
    task_property_value: many(tasks_properties_values)
}))

export const tasksPropertiesRelations = relations(tasks_properties, ({one, many}) => ({
    propertySelectOption: many(property_select_options),
    tasksPropertiesValue: many(tasks_properties_values),
    project: one(projects, {
        fields: [tasks_properties.projectId],
        references: [projects.id]
    })
}))

export const propertySelectOptionsRelations = relations (property_select_options, ({one, many}) => ({
    tasksPropertiesValue: many(tasks_properties_values),
    property: one(tasks_properties, {
        fields: [property_select_options.propertyId],
        references: [tasks_properties.id]
    })
}))

export const tasksPropertiesValuesRelations = relations(tasks_properties_values, ({one, many}) => ({
    task: one(tasks, {
        fields: [tasks_properties_values.taskId],
        references: [tasks.id]
    }),
    property: one(tasks_properties, {
        fields: [tasks_properties_values.propertyId],
        references: [tasks_properties.id]
    }),
    valueSelect: one(property_select_options, {
        fields: [tasks_properties_values.valueSelect],
        references: [property_select_options.id]
    }),
}))