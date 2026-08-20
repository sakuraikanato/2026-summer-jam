import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { eq, and } from "drizzle-orm"

import { ApiResponse } from "@/lib/responseType"
import { userAuth } from "@/middlwere/userAuth"
import { getParam } from "@/lib/getParam"

import db from "../db"
import { entities } from "../db/schema/entities"
import { follows } from "../db/schema/follow"

export const follow = new Hono<{ Variables: typeof userAuth }>()

.get("/:id/following", async (c) => {
  const id = getParam(c, "id")
  const follow = await db.select({entities}).from(follows).where(eq(follows.fromUserId, id)).leftJoin(entities, eq(follows.toEntityId, entities.id));
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
  const follow = await db.select().from(follows).where(and(eq(follows.fromUserId, Number(user.id)), eq(follows.toEntityId, id)))

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

  try {
    await db.insert(follows).values({fromUserId: Number(user.id), toEntityId: id})
  } catch (e) {
    throw new HTTPException(409, { message: "フォロー済みです" })
  }

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

  try {
    await db.delete(follows).where(and(eq(follows.fromUserId, Number(user.id)), eq(follows.toEntityId, id)));
  } catch {
    throw new HTTPException(400, { message: "フォロー解除に失敗しました" })
  }

  return c.json<ApiResponse<null>>({
    success: true,
    data: null
  }, 200)
})
