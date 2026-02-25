import {integer, pgTable, primaryKey, serial, text, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "../helpers/timestamps";
import {relations} from "drizzle-orm";

export const categoriesOfProject = pgTable('categories_of_project', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 50}).notNull().unique(),
    ...timestamps
});

export const tagTypes = pgTable('tag_types', {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 50}).notNull().unique(),
    ...timestamps
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 200}).notNull(),
    categoryId: integer('category_id')
        .notNull()
        .references(() => categoriesOfProject.id),
    mediaUrl: varchar('media_url'),
    ...timestamps
});

export const tags = pgTable('tags', {
    id: serial('id').primaryKey(),
    title: varchar('title', {length: 50}).notNull(),
    typeId: integer('type_id')
        .notNull()
        .references(() => tagTypes.id),
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


export const projectRelations = relations(projects, ({many, one}) => ({
    projectTags: many(projectTags),
    category: one(categoriesOfProject, {
        fields: [projects.categoryId],
        references: [categoriesOfProject.id],
    }),
}));

export const tagRelations = relations(tags, ({many, one}) => ({
    projectTags: many(projectTags),
    tagTypes: one(tagTypes, {
        fields: [tags.typeId],
        references: [tagTypes.id],
    })
}));

export const projectCategoryRelations = relations(categoriesOfProject, ({ many }) => ({
    projects: many(projects),
}));

export const tagTypeRelations = relations(tagTypes, ({ many }) => ({
    tags: many(tags),
}));

export const projectTagsRelations = relations(projectTags, ({one}) => ({
    project: one(projects, {
        fields: [projectTags.projectId],
        references: [projects.id],
    }),
    tag: one(tags, {
        fields: [projectTags.tagId],
        references: [tags.id],
    })
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;

export type ProjectCategory = typeof categoriesOfProject.$inferSelect;
export type NewProjectCategory = typeof categoriesOfProject.$inferInsert;

export type TagType = typeof tagTypes.$inferSelect;
export type NewTagType = typeof tagTypes.$inferInsert;

