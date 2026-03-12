import {stages} from "./stages";
import {relations} from "drizzle-orm";
import {projects} from "../projects";
import {tasks} from "../tasks/tasks";

export const stagesRelations = relations(stages, ({one, many}) => ({
    project: one(projects, {
        fields: [stages.projectId],
        references: [projects.id]
    }),
    task: many(tasks)
}))