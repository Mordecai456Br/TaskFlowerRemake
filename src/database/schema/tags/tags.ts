import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../helpers";
import { tagTypes } from "./tagTypes";

export const tags = pgTable("tags", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 50 }).notNull(),
    typeId: integer("type_id")
        .notNull()
        .references(() => tagTypes.id),
    color: varchar("color").notNull().default('#ffffff'),
    bgColor: varchar("bg_color").notNull().default('#333333'),
    ...timestamps
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
