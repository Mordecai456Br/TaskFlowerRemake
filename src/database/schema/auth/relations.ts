import {relations} from "drizzle-orm";
import {tasks} from "../tasks";
import {projects} from "../projects";
import {account, session, user} from "./auth";

export const usersRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    task: many(tasks),
    project: many(projects)
}));

export const sessionsRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountsRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));