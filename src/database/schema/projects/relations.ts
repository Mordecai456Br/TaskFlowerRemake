import {relations} from "drizzle-orm";
import {projects} from "./projects";
import {categoriesOfProject} from "./categoriesOfProjects";
import {projectTags} from "./projectTags";
import {tags} from "../tags";
import {stages} from "../stages/stages";
import {tasks} from "../tasks/tasks";
import {user} from "../auth/auth";
import {tasks_properties} from "../tasks/tasksProperties";

export const projectsRelations = relations(projects, ({one, many}) => ({
    projectTags: many(projectTags),
    stages: many(stages),
    tasks: many(tasks),
    tasks_properties: many(tasks_properties),
    category: one(categoriesOfProject, {
        fields: [projects.categoryId],
        references: [categoriesOfProject.id]
    }),
    createdByUser: one(user, {
        fields: [projects.createdByUser],
        references: [user.id]
    })
}))

export const categoriesOfProjects = relations(categoriesOfProject, ({many}) => ({
    project: many(projects)
}))

export const projectTagsRelations = relations(projectTags, ({one}) => ({
    project: one(projects, {
        fields: [projectTags.projectId],
        references: [projects.id]
    }),
    tag: one(tags, {
        fields: [projectTags.tagId],
        references: [tags.id]
    })
}) )