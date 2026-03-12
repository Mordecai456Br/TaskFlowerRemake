import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { neonDatabase } from "../database";
import * as schema from "../database/schema/auth/auth";

export const auth = betterAuth({

    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [process.env.FRONTEND_URL!],
    database: drizzleAdapter(neonDatabase, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: true, // Allow role to be set during registration
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true, // Allow imageCldPubId to be set during registration
            },
        },
    },
});