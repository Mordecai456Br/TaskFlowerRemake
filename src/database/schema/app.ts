import {pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "../helpers/timestamps";
import {default_project_category} from "../enums/defaultProjectCategoryEnum";
import {tagsTypesEnum} from "../enums";

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 50 }).notNull(),
    description: varchar('description', { length: 200 }).notNull(),
    category: default_project_category('category').notNull(),
    mediaUrl: varchar('mediaUrl'),
    ...timestamps
});

export const tags = pgTable('tags', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 50 }).notNull(),
    type: tagsTypesEnum('type').notNull()
});

export const projectTags = pgTable('projectTags', {
    id: serial('id').primaryKey(),
    projectId: serial('project_id').notNull().references(() => projects.id, { onDelete: 'restrict'}),
    tagId: serial('tagId').notNull().references(() => tags.id, { onDelete: 'restrict'}),
});
