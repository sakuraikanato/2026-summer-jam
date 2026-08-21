import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import MusicPlayerLauncher from "@/components/MusicPlayerLauncher";
import { getUser } from "@/lib/cats";
import { getTracksByUser } from "@/lib/tracks";

const yen = (amount: number) => `¥${amount.toLocaleString("ja-JP")}`;

export default async function UserPage({ params }: PageProps<"/detail/[id]">) {
  const { id } = await params;
  const user = await getUser(Number(id));
  if (!user) notFound();

  const tracks = await getTracksByUser(user.id);

  return (
    <div className="flex flex-1 flex-col gap-3 w-full max-w-sm mx-auto px-4 pt-2">
      <div className="flex items-center gap-3">
        {/* TODO: next/image に差し替え */}
        <div className="w-14 shrink-0 aspect-square rounded-full bg-gray-300" />
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

      {/* 紹介文が長くてもヘッダーを画面外へ押し出さないよう行数を制限する */}
      {user.description && <p className="line-clamp-3 text-sm">{user.description}</p>}

      <div className="-mx-4 flex flex-1 flex-col gap-3 bg-[#FFF2CF] px-4 py-2">
        {tracks.length === 0 ? (
          <p className="text-sm text-gray-600">まだ曲が投稿されていません。</p>
        ) : (
          <MusicPlayerLauncher tracks={tracks} />
        )}
      </div>
    </div>
  );
}
