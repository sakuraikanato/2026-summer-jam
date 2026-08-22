import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { and, eq } from "drizzle-orm";
import z from "zod";

import db from "../db";
import { members as membersTable, users } from "../db/schema";
import type { AuthVariables } from "../../lib/auth";
import { ApiResponse } from "../../lib/responseType";
import { getParam } from "../../lib/getParam";
import { userAuth } from "../../middlwere/userAuth";

type Member = typeof membersTable.$inferSelect;

const getPositiveId = (
  c: Parameters<typeof getParam>[0],
  name: string,
): number => {
  const id = getParam(c, name);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HTTPException(400, { message: "値の形式が不正です" });
  }
  return id;
};

const getCurrentUserId = (c: { get: (key: "user") => AuthVariables["user"] }): number => {
  const user = c.get("user");
  const userId = Number(user?.id);

  if (!user || !Number.isInteger(userId) || userId <= 0) {
    throw new HTTPException(401, { message: "User Not Found" });
  }

  return userId;
};

const findArtist = async (artistId: number) => {
  const [artist] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, artistId))
    .limit(1);

  if (!artist) {
    throw new HTTPException(404, { message: "Artist Not Found" });
  }
};

const findMember = async (artistId: number, userId: number) => {
  const [member] = await db
    .select()
    .from(membersTable)
    .where(and(
      eq(membersTable.artistId, artistId),
      eq(membersTable.userId, userId),
    ))
    .limit(1);

  return member;
};

const parseJoinedMonths = async (
  c: { req: { json: () => Promise<unknown> } },
  required: boolean,
) => {
  const body = await c.req.json().catch(() => null);
  const schema = z.object({
    joinedMonths: required
      ? z.coerce.number().int().positive()
      : z.coerce.number().int().positive().optional().default(1),
  });
  const parsed = schema.safeParse(body ?? {});

  if (!parsed.success) {
    throw new HTTPException(400, {
      message: "joinedMonths must be a positive integer",
    });
  }

  return parsed.data.joinedMonths;
};

export const members = new Hono<{ Variables: AuthVariables }>()

// ログインユーザー自身の加入中プラン一覧
.use(userAuth)
.get("/", async (c) => {
  const userId = getCurrentUserId(c);
  const memberList = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.userId, userId));

  return c.json<ApiResponse<Member[]>>({
    success: true,
    data: memberList,
  });
})

// 指定したartistのサブスク加入状態
.get("/:artistId", async (c) => {
  const artistId = getPositiveId(c, "artistId");
  const userId = getCurrentUserId(c);
  await findArtist(artistId);

  const member = await findMember(artistId, userId);

  return c.json<ApiResponse<{
    isMember: boolean;
    member: Member | null;
  }>>({
    success: true,
    data: {
      isMember: Boolean(member),
      member: member ?? null,
    },
  });
})

// 指定したartistのサブスクに加入
.post("/:artistId", async (c) => {
  const artistId = getPositiveId(c, "artistId");
  const userId = getCurrentUserId(c);
  await findArtist(artistId);

  const existingMember = await findMember(artistId, userId);
  if (existingMember) {
    throw new HTTPException(409, { message: "加入済みです" });
  }

  const joinedMonths = await parseJoinedMonths(c, false);
  await db.insert(membersTable).values({
    artistId,
    userId,
    joinedMonths,
  });

  const member = await findMember(artistId, userId);
  if (!member) {
    throw new Error("Failed to create member");
  }

  return c.json<ApiResponse<Member>>({
    success: true,
    data: member,
  }, 201);
})

// 指定したartistの加入月数を更新
.patch("/:artistId", async (c) => {
  const artistId = getPositiveId(c, "artistId");
  const userId = getCurrentUserId(c);
  const joinedMonths = await parseJoinedMonths(c, true);
  const existingMember = await findMember(artistId, userId);

  if (!existingMember) {
    throw new HTTPException(404, { message: "Member Not Found" });
  }

  await db
    .update(membersTable)
    .set({ joinedMonths })
    .where(eq(membersTable.id, existingMember.id));

  const member = await findMember(artistId, userId);
  if (!member) {
    throw new Error("Failed to update member");
  }

  return c.json<ApiResponse<Member>>({
    success: true,
    data: member,
  });
})

// 指定したartistのサブスクを解約
.delete("/:artistId", async (c) => {
  const artistId = getPositiveId(c, "artistId");
  const userId = getCurrentUserId(c);
  const existingMember = await findMember(artistId, userId);

  if (!existingMember) {
    throw new HTTPException(404, { message: "Member Not Found" });
  }

  await db
    .delete(membersTable)
    .where(eq(membersTable.id, existingMember.id));

  return c.json<ApiResponse<null>>({
    success: true,
    data: null,
  });
});
