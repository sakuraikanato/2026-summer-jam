import { notFound } from "next/navigation";
import Link from "next/link";
import CatCard from "@/components/CatCard";
import FollowButton from "@/components/FollowButton";
import UserTabs from "@/components/UserTabs";
import PostList from "@/components/PostList";
import { getCatsByUser, getUser, getPostsByUser } from "@/lib/cats";

const yen = (amount: number) => `¥${amount.toLocaleString("ja-JP")}`;

export default async function UserPage({ params }: PageProps<"/detail/[id]">) {
  const { id } = await params;
  const user = await getUser(Number(id));
  if (!user) notFound();

  const [cats, posts] = await Promise.all([
    getCatsByUser(user.id),
    getPostsByUser(user.id),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 w-full max-w-sm mx-auto pt-6">
      <div className="flex items-center gap-3">
        {/* TODO: next/image に差し替え */}
        <div className="w-16 shrink-0 aspect-square rounded-full bg-gray-300" />
        <h1 className="min-w-0 truncate text-lg font-bold">{user.name}</h1>
        <FollowButton initialFollowing={user.isFollowing} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <p>
          累計応援金額：<span className="font-bold">{yen(user.totalSupport)}</span>
        </p>
        <p>
          フォロワー：<span className="font-bold">{user.followerCount}</span>
        </p>

        <div className="flex items-center gap-2">
          {user.instagramUrl && (
            /* TODO: インスタのアイコンに差し替え */
            <a href={user.instagramUrl} target="_blank" rel="noreferrer" aria-label="インスタグラム">
              <span className="block w-6 aspect-square rounded-full bg-gray-300" />
            </a>
          )}
          {user.twitterUrl && (
            /* TODO: ツイッターのアイコンに差し替え */
            <a href={user.twitterUrl} target="_blank" rel="noreferrer" aria-label="ツイッター">
              <span className="block w-6 aspect-square rounded-full bg-gray-300" />
            </a>
          )}
        </div>
      </div>

      <hr className="-mx-4 border-black" />

      {user.description && <p className="text-sm">{user.description}</p>}

      <UserTabs
        cats={
          cats.length === 0 ? (
            <p className="text-sm text-gray-600">まだ登録されていません。</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {cats.map((cat) => (
                <li key={cat.id}>
                  <CatCard cat={cat} />
                </li>
              ))}
            </ul>
          )
        }
        posts={<PostList posts={posts} emptyMessage="まだ投稿がありません。" />}
      />
    </div>
  );
}
