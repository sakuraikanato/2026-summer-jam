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

/**
 * バックエンド未実装のあいだの仮データ。
 * TODO: public/audio/ に音源を置く。API ができたら中身を fetch に差し替える。
 */
const tracks: Track[] = [
  {
    id: 1,
    title: "放課後のリハーサル",
    artist: "橘 ひなた",
    artworkUrl: null,
    userId: 1,
    audioUrl: "/audio/1.mp3",
  },
  {
    id: 2,
    title: "始発待ちのホーム",
    artist: "橘 ひなた",
    artworkUrl: null,
    userId: 1,
    audioUrl: "/audio/2.mp3",
  },
  {
    id: 3,
    title: "デモテープ",
    artist: "橘 ひなた",
    artworkUrl: null,
    userId: 1,
    audioUrl: "/audio/3.mp3",
  },
  {
    id: 4,
    title: "ミッドナイトデモ",
    artist: "佐伯 りく",
    artworkUrl: null,
    userId: 2,
    audioUrl: "/audio/4.mp3",
  },
  {
    id: 5,
    title: "教室の窓",
    artist: "佐伯 りく",
    artworkUrl: null,
    userId: 2,
    audioUrl: "/audio/5.mp3",
  },
  {
    id: 6,
    title: "はじめての弾き語り",
    artist: "白石 かなで",
    artworkUrl: null,
    userId: 3,
    audioUrl: "/audio/6.mp3",
  },
];

export async function getTracks(): Promise<Track[]> {
  return tracks;
}

export async function getTracksByUser(userId: number): Promise<Track[]> {
  return tracks.filter((t) => t.userId === userId);
}
