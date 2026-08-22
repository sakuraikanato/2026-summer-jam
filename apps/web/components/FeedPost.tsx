import Image from "next/image";
import Link from "next/link";
import type { FeedItem } from "@/lib/feed";

type FeedPostProps = {
    item: FeedItem;
};

/** 再生バーのアイコン。svg 自体に余白があるので、2 枚重ねる箇所は px 固定で寄せる */
const transportIcon = (src: string, className?: string) => (
    <Image src={src} alt="" width={20} height={20} aria-hidden className={`shrink-0 ${className ?? ""}`} />
);

export default function FeedPost({ item }: FeedPostProps) {
    const { user, track, lyrics } = item;

    return (
        <article className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Link href={`/detail/${user.id}`} className="flex min-w-0 items-center gap-2">
                    {/* TODO: imageUrl があれば next/image に差し替え */}
                    <span className="block w-8 shrink-0 aspect-square rounded-full bg-gray-300" />
                    <span className="truncate text-sm font-bold">{user.name}</span>
                </Link>

                {/* TODO: メニューの中身。いまは表示のみ */}
                <button type="button" aria-label="メニュー" className="ml-auto shrink-0 px-2 text-sm">
                    ・・・
                </button>
            </div>

            <div className="flex gap-3">
                <div className="flex w-2/5 shrink-0 flex-col gap-1">
                    {/* TODO: artworkUrl があれば next/image に差し替え */}
                    <div className="aspect-square w-full rounded-lg bg-gray-300" />

                    <div className="flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-xs">{track.title}</p>
                        {/* TODO: 共有・お気に入りの処理につなぐ */}
                        <button type="button" aria-label="共有" className="shrink-0 text-xs">
                            共有
                        </button>
                        <button type="button" aria-label="お気に入り" className="shrink-0 text-xs">
                            ♡
                        </button>
                    </div>

                    {/* TODO: 再生処理につなぐ。いまは表示のみ */}
                    <div className="flex items-center justify-between">
                        {transportIcon("/images/soundarrow.svg", "-scale-x-100")}
                        {transportIcon("/images/soundclick.svg")}
                        {transportIcon("/images/soundarrow.svg")}
                    </div>
                </div>

                <p className="min-w-0 flex-1 whitespace-pre-line text-xs leading-relaxed">{lyrics}</p>
            </div>
        </article>
    );
}
