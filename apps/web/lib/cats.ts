/** 団体（保護活動をしているアカウント） */
export type User = {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  /** 累計応援金額（円） */
  totalSupport: number;
  followerCount: number;
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
      "音楽学校のボーカル専攻2年です。作詞作曲もひとりでやっています。放課後は学校のスタジオにこもって、バンドのメンバーと録り直しの毎日。卒業制作のアルバムを出すのが目標です。聴いてもらえるだけでうれしいです。",
    totalSupport: 128000,
    followerCount: 342,
    instagramUrl: "https://instagram.com/",
    twitterUrl: "https://x.com/",
    isFollowing: false,
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

/** 応援中の猫。金額とフォロー状態を持つ */
export type SupportingCat = Cat & {
  /** これまでの応援額の合計（円） */
  totalAmount: number;
  /** 今月の応援額（円） */
  monthlyAmount: number;
  isFollowing: boolean;
};

/** ユーザーが応援している猫（仮） */
export async function getSupportingCats(userId: number): Promise<SupportingCat[]> {
  return cats
    .filter((c) => c.id !== userId % 2)
    .map((c) => ({
      ...c,
      totalAmount: c.id * 3200,
      monthlyAmount: c.id * 500,
      isFollowing: c.id % 2 === 1,
    }));
}
