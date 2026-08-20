import { Hono } from "hono"
import { users } from "../db/schema"
import { follows } from "../db/schema/follow"
import { eq } from "drizzle-orm"
import db from "../db"
import { ApiResponse } from "@/lib/responseType"
import { userAuth } from "@/middlwere/userAuth"

export const follow = new Hono<{ Variables: typeof userAuth }>()

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
.use(userAuth)

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
