import {integer, pgTable, primaryKey, serial, text, varchar} from "drizzle-orm/pg-core";
import {tags} from "../tags";
import { user } from "../auth";

export const teams = pgTable('teams', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
});

export type Teams = typeof teams.$inferSelect;
export type NewTeams = typeof teams.$inferInsert;



