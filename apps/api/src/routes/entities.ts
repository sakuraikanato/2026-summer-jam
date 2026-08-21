import { Hono } from "hono";
import db from "../db";
import { entities, images } from "../db/schema";
import { ApiResponse } from "@/lib/responseType";
import { getParam } from "@/lib/getParam";
import { eq } from "drizzle-orm";
import { userAuth } from "@/middlwere/userAuth";
import z from "zod";
import { saveFile } from "@/lib/saveFile";
import { HTTPException } from "hono/http-exception";

const entitySchema = z.object({
  name: z.string().min(1),
  calledName: z.string().min(1).optional(),
  description: z.string().min(1).optional()
})

export const entity = new Hono()

.get("/", async (c) => {
  const allEntities = await db.select().from(entities);

  return c.json<ApiResponse<typeof allEntities>>({
    success: true,
    data: allEntities
  }, 200)
})

.get("/:id", async (c) => {
  const id = getParam(c, "id");
  const entity = await db.select().from(entities).where(eq(entities.ownerId, id));

  return c.json<ApiResponse<typeof entity>>({
    success: true,
    data: entity
  }, 200)
})

.use(userAuth)

.post("/", async (c) => {
  const body = await c.req.parseBody();
  const user = c.get("user");
  if (!user) {
    throw new Error("User Not Found");
  }

  // --- 画像処理 --- 
  const image = body.image instanceof File ? body.image : null;
  const url = image ? await saveFile(image) : null;
  console.log(url);

  let imageId: number | null = null
  // ---------------

  const param = entitySchema.safeParse(body.posts);
  if (param.success) {
    const { name, calledName, description } = param.data;

    await db.insert(entities).values({ ownerId: Number(user.id), name: name, calledName: calledName, icon: url })
  } else {
    throw new HTTPException(400, { message: "不正な値です" })
  }
})