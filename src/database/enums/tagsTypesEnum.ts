import {pgEnum} from "drizzle-orm/pg-core";

export const tagsTypesEnum = pgEnum('tags_types_enum',
    ['category', 'tech', 'team'])