import { and, asc, eq, inArray } from "drizzle-orm";
import db, { connection } from "../src/db";
import { musicFiles, musics, users } from "../src/db/schema";

const iconUrl = "/uploads/07eb4ba3-33a6-469f-ac05-e8b86081e1f1.jpg";

const musicFileSeeds = [
  {
    shortUrl: "/uploads/5c4b3007-be85-41a3-ab44-d2c01bd74fc8.mp3",
    fullUrl: "/uploads/5c4b3007-be85-41a3-ab44-d2c01bd74fc8.mp3",
    startTime: 0,
    endTime: 30,
  },
  {
    shortUrl: "/uploads/a1e6d135-e33d-435e-afc9-ff4321bbeea0.mp3",
    fullUrl: "/uploads/a1e6d135-e33d-435e-afc9-ff4321bbeea0.mp3",
    startTime: 0,
    endTime: 30,
  },
  {
    shortUrl: "/uploads/6e0635eb-c529-4b6d-8ab9-256a1c962389.mp3",
    fullUrl: "/uploads/6e0635eb-c529-4b6d-8ab9-256a1c962389.mp3",
    startTime: 0,
    endTime: 30,
  },
  {
    shortUrl: "/uploads/94cca6e5-2ad7-4e47-bbe3-e87eaf40b045.mp3",
    fullUrl: "/uploads/94cca6e5-2ad7-4e47-bbe3-e87eaf40b045.mp3",
    startTime: 0,
    endTime: 30,
  },
] as const;

const musicSeeds = [
  "放課後のリハーサル",
  "始発待ちのホーム",
  "ミッドナイトデモ",
  "教室の窓",
] as const;

const parseArtistIds = (): number[] | null => {
  const value = process.env.SEED_ARTIST_IDS;
  if (!value) return null;

  const ids = value
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);

  return ids.length > 0 ? ids : null;
};

async function ensureMusicFiles() {
  const shortUrls = musicFileSeeds.map((seed) => seed.shortUrl);
  const existingFiles = await db
    .select({ id: musicFiles.id, shortUrl: musicFiles.shortUrl })
    .from(musicFiles)
    .where(inArray(musicFiles.shortUrl, shortUrls));

  const fileIds = new Map(existingFiles.map((file) => [file.shortUrl, file.id]));

  for (const seed of musicFileSeeds) {
    if (fileIds.has(seed.shortUrl)) continue;

    const [insertedFile] = await db
      .insert(musicFiles)
      .values(seed)
      .$returningId();

    if (!insertedFile?.id) {
      throw new Error(`Failed to insert music file: ${seed.shortUrl}`);
    }

    fileIds.set(seed.shortUrl, insertedFile.id);
  }

  return fileIds;
}

async function findArtistIds() {
  const requestedIds = parseArtistIds();

  const artists = requestedIds
    ? await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.id, requestedIds))
    : await db
        .select({ id: users.id })
        .from(users)
        .orderBy(asc(users.id))
        .limit(musicSeeds.length);

  return artists.map((artist) => artist.id);
}

async function seedMusics(fileIds: Map<string, number>, artistIds: number[]) {
  if (artistIds.length === 0) {
    console.warn(
      "No existing users were found. Skipping musics because artistId references users.id.",
    );
    return 0;
  }

  let insertedCount = 0;

  for (const [index, title] of musicSeeds.entries()) {
    const fileSeed = musicFileSeeds[index];
    const fileId = fileIds.get(fileSeed.shortUrl);
    const artistId = artistIds[index % artistIds.length];

    if (!fileId || !artistId) continue;

    const [existingMusic] = await db
      .select({ id: musics.id })
      .from(musics)
      .where(
        and(
          eq(musics.title, title),
          eq(musics.artistId, artistId),
          eq(musics.fileId, fileId),
        ),
      )
      .limit(1);

    if (existingMusic) continue;

    await db.insert(musics).values({
      title,
      iconUrl,
      artistId,
      fileId,
    });
    insertedCount += 1;
  }

  return insertedCount;
}

async function main() {
  const fileIds = await ensureMusicFiles();
  const artistIds = await findArtistIds();
  const insertedMusicCount = await seedMusics(fileIds, artistIds);

  console.log(`Music files ready: ${fileIds.size}`);
  console.log(`Music records inserted: ${insertedMusicCount}`);
  console.log("Auth tables were not modified.");
}

try {
  await main();
} finally {
  await connection.end();
}
