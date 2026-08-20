import { Hono } from "hono"
import { users } from "../db/schema"
import { follows } from "../db/schema/follow"
import { eq } from "drizzle-orm"
import db from "../db"
import { ApiResponse } from "@/lib/responseType"

export const follow = new Hono()

.get("/:id/following", async (c) => {
  try {
    const id = Number(c.req.param("id"))
    const follow = await db.select({users}).from(follows).where(eq(follows.userFrom, id)).leftJoin(users, eq(follows.userTo, users.id));
    return c.json<ApiResponse<typeof follow>>({
      success: true,
      data: follow
    })
  } catch (e) {
    throw e
  }
})

.get("/:id/followers", async (c) => {
  try {
    const id = Number(c.req.param("id"))
    const follow = await db.select({users}).from(follows).where(eq(follows.userTo, id)).leftJoin(users, eq(follows.userFrom, users.id));
    return c.json<ApiResponse<typeof follow>>({
      success: true,
      data: follow
    })
  } catch (e) {
    throw e
  }
})

.post("/")