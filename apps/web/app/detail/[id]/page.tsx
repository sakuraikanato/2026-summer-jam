import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import FanPlanBox from "@/components/FanPlanBox";
import SubscribeButton from "@/components/SubscribeButton";
import MusicPlayerLauncher from "@/components/MusicPlayerLauncher";
import { getUser } from "@/lib/cats";
import { getTracksByUser } from "@/lib/tracks";

/** 日付だけを見て「2日前」のような相対表示にする。時刻は無視してカレンダー上の差で数える */
const relativeDate = (isoDate: string) => {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(`${isoDate}T00:00:00`))) / 86_400_000,
  );

  if (days <= 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 30) return `${days}日前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
};

export default async function UserPage({ params }: PageProps<"/detail/[id]">) {
  const { id } = await params;
  const user = await getUser(Number(id));
  if (!user) notFound();

  const tracks = await getTracksByUser(user.id);
  const updated = `最終更新：${relativeDate(user.updatedAt)}`;

  return (
    <div className="flex flex-1 flex-col gap-3 w-full max-w-sm mx-auto px-4 pt-2 md:max-w-3xl md:gap-5 md:px-6 md:pt-8">
      <div className="flex items-center gap-3">
        {/* TODO: next/image に差し替え */}
        <div className="w-14 shrink-0 aspect-square rounded-full bg-gray-300 md:w-24" />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold">{user.name}</h1>
          {/* スマホは横幅が足りないので名前の下に置く */}
          <p className="truncate text-xs text-gray-600 md:hidden">{updated}</p>
        </div>

        <FollowButton initialFollowing={user.isFollowing} />

        <p className="hidden shrink-0 text-xs text-gray-600 md:block">{updated}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
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

        <p className="ml-auto">
          活動歴：<span className="font-bold">{user.activityYears}年</span>
        </p>
      </div>

      <hr className="-mx-4 border-black" />

      {/* 紹介文が長くてもヘッダーを画面外へ押し出さないよう行数を制限する */}
      {user.description && <p className="line-clamp-3 text-sm">{user.description}</p>}

      <FanPlanBox name={user.name} />

      <SubscribeButton name={user.name} />

      <div className="-mx-4 flex flex-1 flex-col gap-3 px-4 py-2 md:-mx-6 md:px-6 md:py-6">
        {tracks.length === 0 ? (
          <p className="text-sm text-gray-600">まだ曲が投稿されていません。</p>
        ) : (
          <MusicPlayerLauncher tracks={tracks} />
        )}
      </div>
    </div>
  );
}
