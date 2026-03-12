import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";

export const tagTypes = pgTable("tag_types", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    ...timestamps
});

export type TagType = typeof tagTypes.$inferSelect;
export type NewTagType = typeof tagTypes.$inferInsert;
