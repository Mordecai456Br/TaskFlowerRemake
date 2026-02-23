import {pgTable, serial, text} from "drizzle-orm/pg-core";
import {timestamps} from "../helpers/timestamps";
import {default_project_category} from "../enums/defaultProjectCategoryEnum";

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    projectCategory: default_project_category('category').notNull(),
    projectTags: text('tags'),
    mediaUrl: text('mediaUrl'),
    ...timestamps
});
