import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import z from "zod"

const userRoleSchema = z.enum([
  "user",
  "creater",
])

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000",
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
        point: {
          type: "number",
          defaultValue: 0
        },
      }
    }),
  ]
})