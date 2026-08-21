import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db"; // your drizzle instance
import z from "zod"

const userRoleSchema = z.enum([
  "user",
  "creator",
])

export const auth = betterAuth({
    trustedOrigins: [
      process.env.FRONT_URL!
    ],
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
      enabled: true
    },
    user: {
      modelName: "users",
      additionalFields: {
        description: {
          type: "string",
          input: true
        },
        role: {
          type: "string",
          input: true,
          required: true,
          validator: {
            input: userRoleSchema,
            output: userRoleSchema
          }
        }
      }
    },
    advanced: {
      database: {
        generateId: "serial"
      },
      defaultCookieAttributes: {
        secure: true,
        sameSite: "none"
      },
      crossSubDomainCookies: {
        enabled: false,
        domain: undefined
      }
    }
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}