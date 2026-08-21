import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth";

/**
 * Data Access Layer
 *
 * セッション参照はここに集約する。React.cache で包んでいるので、
 * 1リクエスト中に何度呼んでも API へのアクセスは1回だけになる。
 * Server Component / Server Action から使うこと（Client Component は useSession を使う）。
 */

/** セッションを取得する。未ログインなら null */
export const getSession = cache(async () => {
  const { data } = await authClient.getSession({
    // Server Component からはブラウザの Cookie が自動で乗らないので明示的に転送する
    fetchOptions: { headers: await headers() },
  });

  return data ?? null;
});

/** ログイン中のユーザーを取得する。未ログインなら null */
export const getUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
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
