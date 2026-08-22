/// <reference types="bun" />

import ffmpegPath from "ffmpeg-static";

export type CutMp3Options = {
  inputPath: string;
  outputPath: string;
  startTime: number;
  endTime: number;
  fadeOutDuration?: number;
};

export const cutMp3 = async ({
  inputPath,
  outputPath,
  startTime,
  endTime,
  fadeOutDuration = 2,
}: CutMp3Options): Promise<void> => {
  if (!Number.isFinite(startTime) || startTime < 0) {
    throw new Error("startTime must be a non-negative number");
  }

  if (!Number.isFinite(endTime) || endTime <= startTime) {
    throw new Error("endTime must be greater than startTime");
  }

  const duration = endTime - startTime;

  if (
    !Number.isFinite(fadeOutDuration) ||
    fadeOutDuration < 0 ||
    fadeOutDuration > duration
  ) {
    throw new Error(
      "fadeOutDuration must be between 0 and the selected duration",
    );
  }

  const ffmpegExecutable = ffmpegPath;
  if (!ffmpegExecutable) {
    throw new Error("FFmpeg binary was not found");
  }

  const filters = [
    `atrim=start=${startTime}:end=${endTime}`,
    "asetpts=PTS-STARTPTS",
  ];

  if (fadeOutDuration > 0) {
    filters.push(
      `afade=t=out:st=${duration - fadeOutDuration}:d=${fadeOutDuration}`,
    );
  }

  const args = [
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-af",
    filters.join(","),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "2",
    outputPath,
  ];

  let child: Bun.Subprocess<"ignore", "ignore", "pipe">;
  try {
    child = Bun.spawn([ffmpegExecutable, ...args], {
      stdio: ["ignore", "ignore", "pipe"],
    });
  } catch (error) {
    throw new Error(
      `Failed to start FFmpeg: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }

  const code = await child.exited;
  if (code === 0) {
    return;
  }

  const stderr = child.stderr
    ? await new Response(child.stderr).text()
    : "";

  throw new Error(stderr.trim() || `FFmpeg exited with code ${code}`);
};
