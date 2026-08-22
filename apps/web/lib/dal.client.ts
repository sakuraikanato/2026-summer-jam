"use client"
import { cache } from "react";
import { headers } from "next/headers";
import { client } from "./client";
import { authClient } from "./auth";


/** ログイン中のユーザーを取得する。未ログインなら null */
export const getUser = cache(async () => {
  const session = authClient.useSession().data;
  if (!session) return null;
  return session.user
});