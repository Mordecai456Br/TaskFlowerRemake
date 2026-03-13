import {integer, pgTable, primaryKey, text} from "drizzle-orm/pg-core";
import {user} from "../auth";
import {teams} from "./teams";

export const teamsUsers = pgTable('teams_users', {
    teamId: integer('team_id').references(() => teams.id),
    userId: text('user_id').references(() => user.id),
}, (table) => ({
    pk: primaryKey({
        columns: [table.teamId, table.userId],
    })
}))

export type TeamsUsers = typeof teams.$inferSelect;
export type NewTeamsUsers = typeof teams.$inferInsert;