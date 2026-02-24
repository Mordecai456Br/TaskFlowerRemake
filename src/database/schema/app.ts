import {integer, pgTable, primaryKey, serial, text, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "../helpers/timestamps";
import {default_project_category} from "../enums/defaultProjectCategoryEnum";
import {tagsTypesEnum} from "../enums";
import {relations} from "drizzle-orm";

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 200}).notNull(),
    category: default_project_category('category').notNull(),
    mediaUrl: varchar('media_url'),
    ...timestamps
});

export const tags = pgTable('tags', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    type: tagsTypesEnum('type').notNull(),
    ...timestamps
});

export const projectTags = pgTable('project_tags', {
        projectId: integer('project_id').notNull().references(() => projects.id),
        tagId: integer('tag_id').notNull().references(() => tags.id),
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.projectId, table.tagId],
        }),
    })
);

export const projectRelations = relations(projects, ({many}) => ({
    tags: many(tags),
}));

export const tagRelations = relations(tags, ({many}) => ({
    projects: many(projects),
}));


