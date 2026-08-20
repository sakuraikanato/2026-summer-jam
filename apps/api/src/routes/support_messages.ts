import { Hono } from "hono";
import { supportMessages } from "../db/schema";
import z from "zod";
import { ApiResponse } from "../../lib/responseType";
import db from "../db";
import { eq } from "drizzle-orm";

const supportMessageSchema = z.object({
  userId: z.number(),
  content: z.string()
})

export const supportMessage = new Hono()

.get("/", async (c) => {
  try {
    const Messages = await db.select().from(supportMessages);
    return c.json<ApiResponse<typeof Messages>>({
      success: true,
      data: Messages
    })
  } catch (e) {
    throw e
  }

})

.post("/", async (c) => {
  try{
    const body = await c.req.json();
    const valiedBody = supportMessageSchema.safeParse(body);

    if (valiedBody.success) {
      const { userId, content } = valiedBody.data;
      await db.insert(supportMessages).values({ userId: userId, content: content});
      return c.json<ApiResponse<null>>({
        success: true,
        data: null
      })
    }
    return c.json<ApiResponse<null>>({
      success: false,
      error: {
        message: `bad request: ${valiedBody.error}`
    }
  });
  } catch (e) {
    throw e
  }
})

.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const MessagesToCreater = await db.select().from(supportMessages).where(eq(supportMessages.userId, id));
    return c.json<ApiResponse<typeof MessagesToCreater>>({
      success: true,
      data: MessagesToCreater
    })
  } catch (e) {
    throw e
  }

})