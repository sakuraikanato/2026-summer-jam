import { Hono } from "hono"
import { eq, like } from "drizzle-orm"
import { posts } from "../db/schema"
import { images } from "../db/schema"
import { ApiResponse } from "../../lib/responseType"
import z from "zod"
import db from "../db"
import path from "node:path"
import { mkdir, writeFile, readFile } from "node:fs/promises"
import { userAuth } from "@/middlwere/userAuth"

const postsSchema = z.object({
  content: z.string(),
  userId: z.number(),
})

const parmSchema = z.string().optional();

const saveFile = async (file: File): Promise<string | null> => {
  const arrayBuff = await file.arrayBuffer();

  const fileName = `${crypto.randomUUID()}.jpg`
  console.log(process.cwd())
  const uploadDir = path.join(path.resolve("./src"), "public", "uploads");
  console.log(uploadDir)

  await mkdir(uploadDir, {
    recursive: true,
  });
  await writeFile(
    path.join(uploadDir, fileName),
    new Uint8Array(arrayBuff),
  );

  if (await readFile(`${uploadDir}/${fileName}`)) {
    return `/uploads/${fileName}`;
  } else {
    return null;
  }
}

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
  try {
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
      const { content, userId } = valiedPosts.data;

      await db.insert(posts).values({content: content, userId: userId, imageId: imageId})
    }
    //--------------
    
    return c.json<ApiResponse<null>>({
      success: true,
      data: null
    })
  } catch (e) {
    throw e
  }
})