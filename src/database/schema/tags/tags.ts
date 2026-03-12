import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";
import { tagTypes } from "./tagTypes";

export const tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 50 }).notNull(),
    typeId: integer("type_id")
        .notNull()
        .references(() => tagTypes.id),
    ...timestamps
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
