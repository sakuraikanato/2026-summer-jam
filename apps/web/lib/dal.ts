import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth";
import { auth } from "api/lib/auth";

/**
 * Data Access Layer
 *
 * セッション参照はここに集約する。React.cache で包んでいるので、
 * 1リクエスト中に何度呼んでも API へのアクセスは1回だけになる。
 * Server Component / Server Action から使うこと（Client Component は useSession を使う）。
 */

/** セッションを取得する。未ログインなら null */
export const getSession = cache(async () => {
  const { data, error } = await authClient.getSession({
    // Server Component からはブラウザの Cookie が自動で乗らないので明示的に転送する
    fetchOptions: { headers: await headers() },
  });

  console.log(error)
  return data ?? null;
});

/** ログイン中のユーザーを取得する。未ログインなら null */
export const getUser = cache(async () => {
  let session
  if (typeof window === "undefined") {
    session = await auth.api.getSession({
      headers: await headers()
    })
  } else {
    
    session = await authClient.useSession().data;
  }
  
  if (!session) return null;
  return session.user
});

/** ログイン必須のページ・Server Action で使う。未ログインならサインインへ飛ばす */
export const requireUser = cache(async () => {
  const user = await getUser();
  if (!user) redirect("/auth/signin");
  return user;
});
