import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
/**
 * 
 * @param c コンテキスト
 * @param name パラメータの名前
 * @returns number
 * @throws HTTPException
 */
export function getParam(c: Context, name: string): number {
  try {
    return Number(c.req.param(name))
  } catch {
    throw new HTTPException(400, { message: "値の形式が不正です" })
  }
}