import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {tags} from "../tags";
import {teams} from "./teams";

export const teamsTags = pgTable('teams_tags', {
        teamId: integer('team_id').references(() => teams.id),
        tagId: integer('tag_id').references(() => tags.id),
    }, (table) =>
        ({
            pk: primaryKey({
                columns: [table.teamId, table.tagId]
            }),
        })
);

export type TeamsTags = typeof teams.$inferSelect;
export type NewTeamsTags = typeof teams.$inferInsert;