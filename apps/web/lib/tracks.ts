import { client } from "./client";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

/** プレイヤーで再生する曲 */
export type Track = {
  id: number;
  title: string;
  artist: string;
  artworkUrl: string | null;
  /** アーティストのユーザー ID。「フルを聴く」はこの人の詳細ページへ飛ぶ */
  userId: number;
  /** 試聴用の音源 URL */
  audioUrl: string;
};

type MusicApiTrack = {
  id: number;
  title: string;
  artist: string;
  artworkUrl: string;
  userId: number;
  audioUrl: string;
};

function toAssetUrl(path: string): string {
  return new URL(path, API_URL).toString();
}

export async function getTracks(): Promise<Track[]> {
  const response = await client.api.music.$get();
  if (!response.ok) return [];

  const json = await response.json();
  if (!json.success) return [];

  return json.data.map((track: MusicApiTrack) => ({
    ...track,
    artworkUrl: toAssetUrl(track.artworkUrl),
    audioUrl: toAssetUrl(track.audioUrl),
  }));
}

export async function getTracksByUser(userId: number): Promise<Track[]> {
  const tracks = await getTracks();
  return tracks.filter((track) => track.userId === userId);
}
