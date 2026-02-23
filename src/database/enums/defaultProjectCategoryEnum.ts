import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const default_project_category = pgEnum('default_project_category',
 ['Lazy Projects', 'Logic Projects', 'Backend', "Frontend", "Figma Projects", "Fullstack"]);

