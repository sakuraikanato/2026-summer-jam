import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import db from "../db";
import { follows as followsTable, users } from "../db/schema";
import type { AuthVariables } from "../../lib/auth";
import { ApiResponse } from "../../lib/responseType";
import { userAuth } from "../../middlwere/userAuth";
import { getParam } from "../../lib/getParam";

const getPositiveId = (c: Parameters<typeof getParam>[0], name: string): number => {
  const id = getParam(c, name);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HTTPException(400, { message: "値の形式が不正です" });
  }
  return id;
};

const findUser = async (id: number) => {
  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) {
    throw new HTTPException(404, { message: "User Not Found" });
  }

  return user;
};

const requireRole = async (id: number, role: "user" | "creator") => {
  const user = await findUser(id);
  if (user.role !== role) {
    throw new HTTPException(403, {
      message: role === "user"
        ? "フォローできるのはuserのみです"
        : "フォロー対象はcreatorのみです",
    });
  }
  return user;
};

export const follows = new Hono<{ Variables: AuthVariables }>()

// 指定したuserがフォローしているcreator一覧
.get("/:id/following", async (c) => {
  const userId = getPositiveId(c, "id");
  await requireRole(userId, "user");

  const following = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      role: users.role,
    })
    .from(followsTable)
    .innerJoin(users, eq(followsTable.toUserId, users.id))
    .where(and(
      eq(followsTable.fromUserId, userId),
      eq(users.role, "creator"),
    ));

  return c.json<ApiResponse<typeof following>>({
    success: true,
    data: following,
  });
})

// 指定したcreatorをフォローしているuser一覧
.get("/:id/followers", async (c) => {
  const creatorId = getPositiveId(c, "id");
  await requireRole(creatorId, "creator");

  const followers = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      role: users.role,
    })
    .from(followsTable)
    .innerJoin(users, eq(followsTable.fromUserId, users.id))
    .where(and(
      eq(followsTable.toUserId, creatorId),
      eq(users.role, "user"),
    ));

  return c.json<ApiResponse<typeof followers>>({
    success: true,
    data: followers,
  });
})

.use(userAuth)

// ログインユーザーが指定creatorをフォローしているか
.get("/:id", async (c) => {
  const creatorId = getPositiveId(c, "id");
  await requireRole(creatorId, "creator");

  const currentUser = c.get("user");
  if (!currentUser) {
    throw new HTTPException(401, { message: "User Not Found" });
  }

  const userId = Number(currentUser.id);
  await requireRole(userId, "user");

  const [follow] = await db
    .select({ id: followsTable.id })
    .from(followsTable)
    .where(and(
      eq(followsTable.fromUserId, userId),
      eq(followsTable.toUserId, creatorId),
    ))
    .limit(1);

  return c.json<ApiResponse<boolean>>({
    success: true,
    data: Boolean(follow),
  });
})

// userからcreatorへのフォローを追加
.post("/:id", async (c) => {
  const creatorId = getPositiveId(c, "id");
  await requireRole(creatorId, "creator");

  const currentUser = c.get("user");
  if (!currentUser) {
    throw new HTTPException(401, { message: "User Not Found" });
  }

  const userId = Number(currentUser.id);
  await requireRole(userId, "user");

  const [existingFollow] = await db
    .select({ id: followsTable.id })
    .from(followsTable)
    .where(and(
      eq(followsTable.fromUserId, userId),
      eq(followsTable.toUserId, creatorId),
    ))
    .limit(1);

  if (existingFollow) {
    throw new HTTPException(409, { message: "フォロー済みです" });
  }

  await db.insert(followsTable).values({
    fromUserId: userId,
    toUserId: creatorId,
  });

  return c.json<ApiResponse<null>>({
    success: true,
    data: null,
  }, 201);
})

// userからcreatorへのフォローを解除
.delete("/:id", async (c) => {
  const creatorId = getPositiveId(c, "id");
  await requireRole(creatorId, "creator");

  const currentUser = c.get("user");
  if (!currentUser) {
    throw new HTTPException(401, { message: "User Not Found" });
  }

  const userId = Number(currentUser.id);
  await requireRole(userId, "user");

  await db
    .delete(followsTable)
    .where(and(
      eq(followsTable.fromUserId, userId),
      eq(followsTable.toUserId, creatorId),
    ));

  return c.json<ApiResponse<null>>({
    success: true,
    data: null,
  });
});

// 既存の命名との互換用
export const follow = follows;
