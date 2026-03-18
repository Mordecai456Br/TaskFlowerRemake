import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";
import { categoriesOfProject } from "./categoriesOfProjects";
import {user} from "../auth/auth";
import {string} from "better-auth";

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 50 }).notNull(),
    description: varchar("description", { length: 200 }).notNull(),
    categoryId: integer("category_id")
        .notNull()
        .references(() => categoriesOfProject.id),
    mediaUrl: varchar("media_url"),
    githubUrl: varchar("github_url"),
    createdByUser: text('created_by_user').references(() => user.id).notNull(),

    ...timestamps
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
