import { Hono } from "hono";
import { userAuth } from "@/middlwere/userAuth";
import { AuthVariables } from "@/lib/auth";
import db from "../db";
import { follows } from "../db/schema";
import { ApiResponse } from "@/lib/responseType";

export const auth = new Hono<{ Variables: AuthVariables }>()

.post("/follows/:id", async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      throw new Error("Unauthorized")
    }
    const id = Number(c.req.param("id"));

    await db.insert(follows).values({userFrom: Number(user.id), userTo: id})

    return c.json<ApiResponse<null>>({
      success: true,
      data: null
    })
  } catch (e) {
    throw e
  }
})
