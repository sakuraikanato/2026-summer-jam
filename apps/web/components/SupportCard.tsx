import Link from "next/link";
import FollowButton from "./FollowButton";
import type { SupportingUser } from "@/lib/cats";

type SupportCardProps = {
    user: SupportingUser;
};

const yen = (amount: number) => `¥${amount.toLocaleString("ja-JP")}`;

/**
 * 月の応援額からメンバー区分を決める。
 * TODO: 区分と金額はいまのところ仮。正式な基準が決まったらここを直す。
 */
const memberRanks = [
    { min: 1500, label: "ゴールドメンバー" },
    { min: 1000, label: "シルバーメンバー" },
    { min: 0, label: "ブロンズメンバー" },
] as const;

const rankOf = (monthlyAmount: number) =>
    memberRanks.find((rank) => monthlyAmount >= rank.min)?.label ?? "ブロンズメンバー";

export default function SupportCard({ user }: SupportCardProps) {
    return (
        <article className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/70 p-3">
            <div className="flex items-center gap-3">
                {/* TODO: next/image に差し替え */}
                <div className="w-12 shrink-0 aspect-square rounded-full bg-gray-300" />

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    {user.description && (
                        <p className="truncate text-xs text-gray-600">{user.description}</p>
                    )}
                </div>

                <p className="shrink-0 text-xs">
                    総応援額：<span className="font-bold">{yen(user.totalAmount)}</span>
                </p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-1 pt-3">
                <p className="bg-[#FFCFA5] p-2 text-xs font-bold">
                    {rankOf(user.monthlyAmount)}
                </p>

                <FollowButton initialFollowing={user.isFollowing} />

                <Link
                    href={`/detail/${user.id}`}
                    className="rounded-full border border-black px-3 py-1 text-xs"
                >
                    詳細
                </Link>

                {/* TODO: 解約処理につなぐ。いまは表示のみ */}
                <button
                    type="button"
                    className="rounded-full bg-[#E9876E] px-3 py-1 text-xs font-bold"
                >
                    解約
                </button>
            </div>
        </article>
    );
}
