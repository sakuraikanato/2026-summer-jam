import { basename, extname, join, resolve } from "node:path"
import { mkdir, writeFile } from "node:fs/promises"

const uploadDir = resolve("./public/uploads");

const extensionsByMimeType: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/webm": ".webm",
  "audio/mp4": ".m4a",
};

const getExtension = (file: File): string => {
  const extension = extname(file.name).toLowerCase();

  if (/^\.[a-z0-9]{1,10}$/.test(extension)) {
    return extension;
  }

  return extensionsByMimeType[file.type] ?? ".bin";
};

export const getUploadPath = (url: string): string => {
  return join(uploadDir, basename(url));
};

export const saveFile = async (file: File): Promise<string> => {
  const arrayBuff = await file.arrayBuffer();

  const fileName = `${crypto.randomUUID()}${getExtension(file)}`;

  await mkdir(uploadDir, {
    recursive: true,
  });
  await writeFile(
    join(uploadDir, fileName),
    new Uint8Array(arrayBuff),
  );

  return `/uploads/${fileName}`;
}
