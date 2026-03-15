import {integer, pgTable, primaryKey} from "drizzle-orm/pg-core";
import {projects} from "./projects";
import {teams} from "../teams/teams";

export const projectTeams = pgTable('project_teams', {
    projectId: integer('project_id').references(() => projects.id).notNull(),
    teamId: integer('team_id').references(() => teams.id).notNull(),
}, (table) => ({
    pk: primaryKey({
    columns: [table.projectId, table.teamId],
})
}))