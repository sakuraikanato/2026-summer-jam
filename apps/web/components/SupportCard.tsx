import Link from "next/link";
import FollowButton from "./FollowButton";
import type { SupportingCat } from "@/lib/cats";

type SupportCardProps = {
    cat: SupportingCat;
};

const yen = (amount: number) => `¥${amount.toLocaleString("ja-JP")}`;

export default function SupportCard({ cat }: SupportCardProps) {
    return (
        <article className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/70 p-3">
            <div className="flex items-center gap-3">
                {/* TODO: next/image に差し替え */}
                <div className="w-12 shrink-0 aspect-square rounded-full bg-gray-300" />

                <p className="min-w-0 truncate text-sm font-bold">{cat.name}</p>

                <p className="shrink-0 text-xs">
                    総応援額：<span className="font-bold">{yen(cat.totalAmount)}</span>
                </p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-1 pt-3">
                <p className="bg-[#FFCFA5] p-2 text-xs">
                    今月の総応援額：<span className="font-bold">{yen(cat.monthlyAmount)}</span>
                </p>

                <FollowButton initialFollowing={cat.isFollowing} />

                <Link
                    href={`/detail/${cat.userId}/cats/${cat.id}`}
                    className="rounded-full border border-black px-3 py-1 text-xs"
                >
                    詳細
                </Link>

                <Link
                    href="/charge"
                    className="rounded-full bg-[#E9876E] px-3 py-1 text-xs font-bold"
                >
                    応援追加
                </Link>
            </div>
        </article>
    );
}
