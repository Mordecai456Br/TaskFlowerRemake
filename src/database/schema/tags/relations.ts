import {relations} from "drizzle-orm";
import {tags} from "./tags";
import {projects} from "../projects";
import {tagTypes} from "./tagTypes";

export const tagsRelations = relations(tags, ({many, one}) => ({
    project: many(projects),
    tagType: one(tagTypes, {
        fields: [tags.typeId],
        references: [tagTypes.id]
    })
}))

export const tagTypesRelations = relations(tagTypes, ({many}) => ({
    tag: many(tags)
}))