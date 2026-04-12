import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";

export const categoriesOfProject = pgTable("categories_of_project", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    color: varchar("color").notNull().default('#ffffff'),
    bgColor: varchar("bg_color").notNull().default('#333333'),
    ...timestamps
});

export type ProjectCategory = typeof categoriesOfProject.$inferSelect;
export type NewProjectCategory = typeof categoriesOfProject.$inferInsert;
