import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";

export const categoriesOfProject = pgTable("categories_of_project", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    ...timestamps
});

export type ProjectCategory = typeof categoriesOfProject.$inferSelect;
export type NewProjectCategory = typeof categoriesOfProject.$inferInsert;
