import path from "node:path"
import { mkdir, writeFile, readFile } from "node:fs/promises"

export const saveFile = async (file: File): Promise<string | null> => {
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