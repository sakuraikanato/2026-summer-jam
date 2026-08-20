import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../src/db"; // your drizzle instance
import z from "zod"

const userRoleSchema = z.enum([
  "user",
  "creater",
])

export const auth = betterAuth({
    trustedOrigins: [
      process.env.FRONT_URL ?? "http://localhost:3000",
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
        point: {
          type: "number",
          input: false,
          required: true,
          defaultValue: 0
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
      }
    }
});