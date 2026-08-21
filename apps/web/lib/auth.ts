import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import z from "zod"

const userRoleSchema = z.enum([
  "user",
  "creator",
])

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        description: {
          type: "string",
          defaultValue: "a"
        },
        role: {
          type: "string",
          validator: {
            input: userRoleSchema,
            output: userRoleSchema
          }
        },
      }
    }),
  ]
})
