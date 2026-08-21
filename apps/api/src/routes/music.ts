import { Hono } from "hono";
import { ApiResponse } from "@/lib/responseType";
import { userAuth } from "@/middlwere/userAuth";
import db from "../db";
import { musics, musicFiles } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { getParam } from "@/lib/getParam";
import { members } from "../db/schema/members";

export const music = new Hono()

.get("/", async (c) => {
  const music = await db.select().from(musics);

  return c.json<ApiResponse<typeof music>>({
    success: true,
    data: music
  })
})

.use(userAuth)

.get("/:id", async (c) => {
  const id = getParam(c, "id")
  const user = c.get("user");
  if (!user) {
    throw new Error("User Not Found");
  }
  const [music] = await db.select().from(musics).where(eq(musics.id, id)).leftJoin(musicFiles, eq(musics.fileId, musicFiles.id));

  const member = await db.select().from(members).where(and(eq(members.artistId, music.musics.artistId), eq(members.userId, Number(user.id))));
  if (member.length > 0) {
    return c.json<ApiResponse<typeof music>>({
      success: true,
      data: music
    })
  } else {
    const { fullUrl, ...rest } = music.music_files ?? {}
    const response = {
      music: music.musics,
      musicFiles: rest,
    }
    return c.json<ApiResponse<typeof response>>({
      success: true,
      data: response
    })
  }
})

.use(userAuth)
