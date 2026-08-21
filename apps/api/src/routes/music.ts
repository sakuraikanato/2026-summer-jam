import { Hono } from "hono";
import { ApiResponse } from "@/lib/responseType";
import { userAuth } from "@/middlwere/userAuth";
import db from "../db";
import { musics, musicFiles } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { getParam } from "@/lib/getParam";
import { members } from "../db/schema/members";
import { HTTPException } from "hono/http-exception";
import { cutMp3 } from "@/lib/cutMp3";
import { getUploadPath, saveFile } from "@/lib/saveFile";

const DEFAULT_AUDIO_TRIM_START_SECONDS = 0;
const DEFAULT_AUDIO_TRIM_END_SECONDS = 30;

const parseTrimTime = (
  value: unknown,
  defaultValue: number,
  fieldName: string,
): number => {
  if (value === undefined || value === "") {
    return defaultValue;
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    throw new HTTPException(400, {
      message: `${fieldName} must be a number`,
    });
  }

  return parsedValue;
};

export const music = new Hono()

.get("/", async (c) => {
  const music = await db.select().from(musics);

  return c.json<ApiResponse<typeof music>>({
    success: true,
    data: music
  })
})

.use(userAuth)

.post("/", async (c) => {
  const body = await c.req.parseBody();
  const user = c.get("user");

  if (!user) {
    throw new HTTPException(401, { message: "User Not Found" });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const audio = body.audio instanceof File ? body.audio : null;
  const image = body.image instanceof File ? body.image : null;
  const startTime = parseTrimTime(
    body.startTime,
    DEFAULT_AUDIO_TRIM_START_SECONDS,
    "startTime",
  );
  const endTime = parseTrimTime(
    body.endTime,
    DEFAULT_AUDIO_TRIM_END_SECONDS,
    "endTime",
  );

  if (startTime < 0) {
    throw new HTTPException(400, {
      message: "startTime must be a non-negative number",
    });
  }

  if (endTime <= startTime) {
    throw new HTTPException(400, {
      message: "endTime must be greater than startTime",
    });
  }

  if (!title) {
    throw new HTTPException(400, { message: "title is required" });
  }

  if (!audio || audio.size === 0) {
    throw new HTTPException(400, { message: "audio is required" });
  }

  if (!image || image.size === 0) {
    throw new HTTPException(400, { message: "image is required" });
  }

  const iconUrl = await saveFile(image);
  const fullUrl = await saveFile(audio);
  const shortUrl = `/uploads/${crypto.randomUUID()}.mp3`;

  await cutMp3({
    inputPath: getUploadPath(fullUrl),
    outputPath: getUploadPath(shortUrl),
    startTime,
    endTime,
  });

  const artistId = Number(user.id);
  const { musicId, musicFileId } = await db.transaction(async (tx) => {
    const [musicFile] = await tx
      .insert(musicFiles)
      .values({ shortUrl, fullUrl, startTime, endTime })
      .$returningId();

    if (!musicFile?.id) {
      throw new Error("Failed to create music file");
    }

    const [music] = await tx
      .insert(musics)
      .values({
        title,
        iconUrl,
        artistId,
        fileId: musicFile.id,
      })
      .$returningId();

    if (!music?.id) {
      throw new Error("Failed to create music");
    }

    return {
      musicId: music.id,
      musicFileId: musicFile.id,
    };
  });

  return c.json<ApiResponse<{
    musicId: number;
    musicFileId: number;
    startTime: number;
    endTime: number;
  }>>({
    success: true,
    data: {
      musicId,
      musicFileId,
      startTime,
      endTime,
    },
  }, 201);
})

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
