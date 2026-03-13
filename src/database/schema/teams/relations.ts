import {relations} from "drizzle-orm";
import {teamsUsers} from "./teamsUsers";
import {teams} from "./teams";
import {teamsTags} from "./teamsTags";
import { user} from "../auth/auth"
import {tags} from "../tags";

export const teamsRelations = relations(teams, ({many}) => ({
    teamsUser: many(teamsUsers),
    teamsTag: many(teamsTags),
}))

export const teamsTagsRelations = relations(teamsTags, ({many, one}) => ({
    team: one(teams, {
      fields: [teamsTags.teamId],
      references: [teams.id]
    }),
    tag: one(tags, {
        fields: [teamsTags.tagId],
        references: [tags.id]
    })
}))

export const teamUsersRelations = relations(teamsUsers, ({many, one}) => ({
    team: one(teams, {
        fields: [teamsUsers.teamId],
        references: [teams.id]
    }),
    user: one(user, {
        fields: [teamsUsers.userId],
        references: [user.id]
    })
}))