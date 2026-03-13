import {relations} from "drizzle-orm";
import {tags} from "./tags";
import {projects} from "../projects";
import {tagTypes} from "./tagTypes";
import {teams} from "../teams/teams";

export const tagsRelations = relations(tags, ({many, one}) => ({
    project: many(projects),
    team: many(teams),
    tagType: one(tagTypes, {
        fields: [tags.typeId],
        references: [tagTypes.id]
    })
}))

export const tagTypesRelations = relations(tagTypes, ({many}) => ({
    tag: many(tags)
}))