/** 団体（保護活動をしているアカウント） */
export type User = {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  /** 累計応援金額（円） */
  totalSupport: number;
  followerCount: number;
  /** 活動歴（年） */
  activityYears: number;
  /** 最終更新日 */
  updatedAt: string;
  instagramUrl: string | null;
  twitterUrl: string | null;
  isFollowing: boolean;
};

/** 団体に所属する猫 */
export type Cat = {
  id: number;
  userId: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
};

/** 投稿。団体全体の投稿もあるので catId は null 許容 */
export type Post = {
  id: number;
  userId: number;
  catId: number | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

/**
 * バックエンド未実装のあいだの仮データ。
 * 各関数は async にしてあるので、API ができたら中身を fetch に差し替えるだけで済む。
 */

const users: User[] = [
  {
    id: 1,
    name: "橘 ひなた",
    imageUrl: null,
    description:
      "音楽学校のボーカル専攻2年。作詞作曲もひとりでやっています。卒業制作のアルバムを出すのが目標です。",
    totalSupport: 128000,
    followerCount: 342,
    activityYears: 2,
    updatedAt: "2026-08-20",
    instagramUrl: "https://instagram.com/",
    twitterUrl: "https://x.com/",
    isFollowing: false,
  },
  {
    id: 2,
    name: "佐伯 りく",
    imageUrl: null,
    description:
      "作曲・DTM 専攻。打ち込みで作った曲を、ボーカル科の子に歌ってもらっています。",
    totalSupport: 46000,
    followerCount: 118,
    activityYears: 1,
    updatedAt: "2026-08-18",
    instagramUrl: "https://instagram.com/",
    twitterUrl: null,
    isFollowing: false,
  },
  {
    id: 3,
    name: "白石 かなで",
    imageUrl: null,
    description:
      "ピアノ専攻の1年。いまは弾き語りの曲を書いていて、学内のライブに向けて練習中です。",
    totalSupport: 21500,
    followerCount: 64,
    activityYears: 3,
    updatedAt: "2026-08-21",
    instagramUrl: null,
    twitterUrl: "https://x.com/",
    isFollowing: true,
  },
];

const cats: Cat[] = [
  { id: 1, userId: 1, name: "ミケ", imageUrl: null, description: "人懐っこい三毛猫です。" },
  { id: 2, userId: 1, name: "チャム", imageUrl: null, description: "甘えん坊です。" },
  { id: 3, userId: 1, name: "ココア", imageUrl: null, description: "のんびり屋さんです。" },
];

const posts: Post[] = [
  { id: 1, userId: 1, catId: 1, content: "ミケが日向ぼっこしています。", imageUrl: null, createdAt: "2026-08-18" },
  { id: 2, userId: 1, catId: 2, content: "チャムの健康診断に行ってきました。", imageUrl: null, createdAt: "2026-08-19" },
  { id: 3, userId: 1, catId: null, content: "今月のご支援ありがとうございました。", imageUrl: null, createdAt: "2026-08-20" },
];

export async function getUser(id: number): Promise<User | null> {
  return users.find((o) => o.id === id) ?? null;
}

export async function getAllUsers(): Promise<User[]> {
  return users;
}

export async function getCat(id: number): Promise<Cat | null> {
  return cats.find((c) => c.id === id) ?? null;
}

export async function getCatsByUser(userId: number): Promise<Cat[]> {
  return cats.filter((c) => c.userId === userId);
}

export async function getPostsByCat(catId: number): Promise<Post[]> {
  return posts.filter((p) => p.catId === catId);
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
  return posts.filter((p) => p.userId === userId);
}

export async function getAllCats(): Promise<Cat[]> {
  return cats;
}

/** 応援している在校生。金額を持つ */
export type SupportingUser = User & {
  /** これまでの応援額の合計（円） */
  totalAmount: number;
  /** 今月の応援額（円） */
  monthlyAmount: number;
};

/** ログイン中のユーザーが応援している在校生（仮） */
export async function getSupportingUsers(userId: number): Promise<SupportingUser[]> {
  return users
    .filter((u) => u.id !== userId)
    .map((u) => ({
      ...u,
      totalAmount: u.id * 3200,
      monthlyAmount: u.id * 500,
    }));
}
