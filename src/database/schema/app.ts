import {integer, pgTable, serial, text, varchar} from "drizzle-orm/pg-core";
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
    type: tagsTypesEnum('type').notNull(),
    ...timestamps
});

export const projectTags = pgTable('project_tags', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'restrict'}),
    tagId: integer('tagId').notNull().references(() => tags.id, { onDelete: 'restrict'}),
});
