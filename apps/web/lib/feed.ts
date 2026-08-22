import { getAllUsers, type User } from "./cats";
import { getTracks, type Track } from "./tracks";

/** フォロー中の人の投稿（曲＋歌詞） */
export type FeedItem = {
  id: number;
  user: User;
  track: Track;
  lyrics: string;
};

/** バックエンド未実装のあいだの仮データ。TODO: API ができたら fetch に差し替える */
const posts = [
  {
    id: 1,
    userId: 1,
    trackId: 1,
    lyrics:
      "（1番）\n放課後の教室 チューニングの音\nはい、もう一回 頭から あわせよう\n窓の外は もう夕方\n（サビ）\nもう一回 もう一回 声を出すたび\n近づいてく 昨日より 少しだけ",
  },
  {
    id: 2,
    userId: 3,
    trackId: 6,
    lyrics:
      "（1番）\n鍵盤に指をおいて 息をひとつ\nはい、ゆっくり 音を置いて 転がして\n止まらないまま 朝がくる\n（サビ）\n弾いて 歌って くり返すだけ\n忘れてた ことばが 戻ってくる",
  },
  {
    id: 3,
    userId: 2,
    trackId: 4,
    lyrics:
      "（1番）\n夜中の部屋で 打ち込んだビート\nはい、ここから 少しだけ 走らせて\n気づけば 外は 白んでる\n（サビ）\n重ねて 削って 並べるだけで\n知らない景色が 見えてくる",
  },
] as const;

export async function getFeed(): Promise<FeedItem[]> {
  const [users, tracks] = await Promise.all([getAllUsers(), getTracks()]);

  return posts.flatMap((post) => {
    const user = users.find((u) => u.id === post.userId);
    const track = tracks.find((t) => t.id === post.trackId);
    return user && track ? [{ id: post.id, user, track, lyrics: post.lyrics }] : [];
  });
}

/** フォロー中のユーザー（仮） */
export async function getFollowingUsers(): Promise<User[]> {
  return getAllUsers();
}
