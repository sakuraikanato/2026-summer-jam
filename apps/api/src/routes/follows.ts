import { Hono } from "hono"
import { users } from "../db/schema"
import { follows } from "../db/schema/follow"
import { eq, and } from "drizzle-orm"
import db from "../db"
import { ApiResponse } from "@/lib/responseType"
import { userAuth } from "@/middlwere/userAuth"
import { HTTPException } from "hono/http-exception"
import { getParam } from "@/lib/getParam"

export const follow = new Hono<{ Variables: typeof userAuth }>()

.get("/:id/following", async (c) => {
  const id = getParam(c, "id")
  const follow = await db.select({users}).from(follows).where(eq(follows.userFrom, id)).leftJoin(users, eq(follows.userTo, users.id));
  return c.json<ApiResponse<typeof follow>>({
    success: true,
    data: follow
  }, 200)
})

.get("/:id/followers", async (c) => {
  const id = getParam(c, "id")
  const follow = await db.select({users}).from(follows).where(eq(follows.userTo, id)).leftJoin(users, eq(follows.userFrom, users.id));
  return c.json<ApiResponse<typeof follow>>({
    success: true,
    data: follow
  }, 200)
})
.use(userAuth)

.get("/:id", async (c) => {
  const id = getParam(c, "id")
  const user = c.get("user");
  if (!user) {
    throw new Error("User Not Found")
  }
  const follow = await db.select().from(follows).where(and(eq(follows.userFrom, Number(user.id)), eq(follows.userTo, id)))

  const hasItem = follow.length > 0
  return c.json<ApiResponse<boolean>>({
    success: true,
    data: hasItem
  }, 200)
})

.post("/:id", async (c) => {
  const id = getParam(c, "id")

  const user = c.get("user");
  if (!user) {
    throw new Error("User Not Found")
  }

  await db.insert(follows).values({userFrom: Number(user.id), userTo: id})

  return c.json<ApiResponse<null>>({
    success: true,
    data: null
  }, 200)
})

.delete("/:id", async (c) => {
  const id = getParam(c, "id")

  const user = c.get("user");
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.insert(follows).values({userFrom: Number(user.id), userTo: id})

  return c.json<ApiResponse<null>>({
    success: true,
    data: null
  }, 200)
})
