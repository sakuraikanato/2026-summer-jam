import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth";
import { auth } from "api/lib/auth";
import { client } from "./client";

/**
 * Data Access Layer
 *
 * セッション参照はここに集約する。React.cache で包んでいるので、
 * 1リクエスト中に何度呼んでも API へのアクセスは1回だけになる。
 * Server Component / Server Action から使うこと（Client Component は useSession を使う）。
 */

/** セッションを取得する。未ログインなら null */

/** ログイン中のユーザーを取得する。未ログインなら null */
export const getUser = cache(async () => {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie")
  console.log(cookie)

  const res = await client.api.me.$get(
    undefined,
    {
      headers: { Cookie: cookie ?? "" }
  })
  const session = await res.json()
  if (!session.success) return null;

  return session.data ?? null;
});

/**
 * ログイン必須のページ・Server Action で使う。未ログインならサインインへ飛ばす。
 * feature を渡すと、サインイン画面に「◯◯機能を利用するには…」の案内を出せる。
 */
export const requireUser = cache(async (feature?: string) => {
  const user = await getUser();
  if (!user) {
    redirect(feature ? `/auth/signin?required=${encodeURIComponent(feature)}` : "/auth/signin");
  }
  return user;
});
