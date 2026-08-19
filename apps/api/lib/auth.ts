import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db"; // your drizzle instance
import { point } from "drizzle-orm/pg-core";
import z from "zod"

const userRoleSchema = z.enum([
  "user",
  "creater",
  "admin"
])

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
      enabled: true
    },
    user: {
      additionalFields: {
        description: {
          type: "string",
          input: true
        },
        point: {
          type: "number",
          input: false,
          required: true,
        },
        role: {
          type: "string",
          input: false,
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
      }
    }
});