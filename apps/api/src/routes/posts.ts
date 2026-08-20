import { Hono } from "hono"
import { posts } from "../db/schema"
import { images } from "../db/schema"
import { ApiResponse } from "../../lib/responseType"
import z from "zod"
import db from "../db"
import path from "node:path"
import { mkdir, writeFile, readFile } from "node:fs/promises"

const postsSchema = z.object({
  content: z.string(),
  userId: z.number(),
})

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
  }
})

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

    const valedPosts = typeof body.posts === "string" 
      ? postsSchema.safeParse(JSON.parse(body.posts)) 
      : null

    if (valedPosts && valedPosts.success) {
      const { content, userId } = valedPosts.data;

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