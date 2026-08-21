import { Hono } from "hono"
import { eq, like } from "drizzle-orm"
import { entities, posts, users, images } from "../db/schema"
import { ApiResponse } from "../../lib/responseType"
import z from "zod"
import db from "../db"
<<<<<<< Updated upstream
import path from "node:path"
import { mkdir, writeFile, readFile } from "node:fs/promises"
=======
import { userAuth } from "@/middlwere/userAuth"
import { HTTPException } from "hono/http-exception"
import { saveFile } from "@/lib/saveFile"
>>>>>>> Stashed changes

const postsSchema = z.object({
  content: z.string(),
  entityId: z.number(),
})

const parmSchema = z.string().optional();



export const post = new Hono()

.get("/", async (c) => {
  try {
    const valiedParm = parmSchema.safeParse(c.req.query("search"));

    if (valiedParm.success) {
      const parm = valiedParm.data

      const findPosts = parm 
        ? await db.select().from(posts).where(like(posts.content, `%${parm}%`))
        : await db.select().from(posts)

      return c.json<ApiResponse<typeof findPosts>>({
        success: true,
        data: findPosts
      }, 200)
    }
    
  } catch (e) {
    throw e
  }
})

.get("/:post_id", async (c) => {
  try {
    const parm = Number(c.req.param("post_id"));
    
    const post = await db.select().from(posts).where(eq(posts.id, parm));
    return c.json<ApiResponse<typeof post>>({
      success: true,
      data: post
    })
  } catch (e) {
    throw e
  }
})

.use(userAuth)

.post("/", async (c) => {
  const body = await c.req.parseBody();

  // --- 画像処理 --- 
  const image = body.image instanceof File ? body.image : null;
  const url = image ? await saveFile(image) : null;
  console.log(url);

  let imageId: number | null = null

  if (url) {
    const imageIds = await db.insert(images).values({imageUrl: url, alt: "投稿画像"}).$returningId()
    imageId = imageIds[0].id;
  }
  console.log(imageId)

  // --------------
  // --- json ---

  const valiedPosts = typeof body.posts === "string" 
    ? postsSchema.safeParse(JSON.parse(body.posts)) 
    : null

  if (valiedPosts && valiedPosts.success) {
    const { content, entityId } = valiedPosts.data;
    const user = c.get("user");
    if (!user) throw new Error("User Not Found");

    const userEntities = await db.select({id: entities.id}).from(entities).where(eq(entities.ownerId, Number(user.id)));
    let entityList: Array<number> = []
    userEntities.forEach((obj) => {
      entityList.push(obj.id)
    });
    if (entityList.includes(entityId)) {
      await db.insert(posts).values({content: content, entityId: entityId, imageId: imageId})
    } else {
      throw new HTTPException(400, { message: "不正な値です" });
    }
  }
  //--------------
  
  return c.json<ApiResponse<null>>({
    success: true,
    data: null
  })
})