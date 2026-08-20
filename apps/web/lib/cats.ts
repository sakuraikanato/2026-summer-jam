/** 団体（保護活動をしているアカウント） */
export type Org = {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
};

/** 団体に所属する猫 */
export type Cat = {
  id: number;
  orgId: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
};

/** 投稿。団体全体の投稿もあるので catId は null 許容 */
export type Post = {
  id: number;
  orgId: number;
  catId: number | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
};

/**
 * バックエンド未実装のあいだの仮データ。
 * 各関数は async にしてあるので、API ができたら中身を fetch に差し替えるだけで済む。
 */

const orgs: Org[] = [
  { id: 1, name: "猫ちゃん囲み隊", imageUrl: null, description: "地域猫の保護活動をしています。" },
];

const cats: Cat[] = [
  { id: 1, orgId: 1, name: "ミケ", imageUrl: null, description: "人懐っこい三毛猫です。" },
  { id: 2, orgId: 1, name: "チャム", imageUrl: null, description: "甘えん坊です。" },
  { id: 3, orgId: 1, name: "ココア", imageUrl: null, description: "のんびり屋さんです。" },
];

const posts: Post[] = [
  { id: 1, orgId: 1, catId: 1, content: "ミケが日向ぼっこしています。", imageUrl: null, createdAt: "2026-08-18" },
  { id: 2, orgId: 1, catId: 2, content: "チャムの健康診断に行ってきました。", imageUrl: null, createdAt: "2026-08-19" },
  { id: 3, orgId: 1, catId: null, content: "今月のご支援ありがとうございました。", imageUrl: null, createdAt: "2026-08-20" },
];

export async function getOrg(id: number): Promise<Org | null> {
  return orgs.find((o) => o.id === id) ?? null;
}

export async function getCat(id: number): Promise<Cat | null> {
  return cats.find((c) => c.id === id) ?? null;
}

export async function getCatsByOrg(orgId: number): Promise<Cat[]> {
  return cats.filter((c) => c.orgId === orgId);
}

export async function getPostsByCat(catId: number): Promise<Post[]> {
  return posts.filter((p) => p.catId === catId);
}

export async function getPostsByOrg(orgId: number): Promise<Post[]> {
  return posts.filter((p) => p.orgId === orgId);
}

export async function getAllCats(): Promise<Cat[]> {
  return cats;
}
