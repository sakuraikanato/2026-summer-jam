"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";

const leftLinks = [
    { href: "/purchases", label: "購入履歴" },
    { href: "/supports", label: "応援履歴" },
    { href: "/help", label: "ヘルプ/お問い合わせ" },
] as const;

const rightLinks = [
    { href: "/settings/notifications", label: "通知設定" },
    { href: "/bookmarks", label: "ブックマーク" },
    { href: "/terms", label: "利用規約" },
] as const;

const itemClass =
    "flex w-full items-center justify-between gap-2 border border-black px-3 py-2 text-left text-sm";

export default function ProfileMenu() {
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <nav className="grid grid-cols-2 -space-x-px">
            <ul className="flex flex-col -space-y-px">
                {leftLinks.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className={itemClass}>
                            <span className="min-w-0 truncate">{link.label}</span>
                            <span aria-hidden>＞</span>
                        </Link>
                    </li>
                ))}
                <li>
                    <button type="button" onClick={handleSignOut} className={itemClass}>
                        <span className="min-w-0 truncate">ログアウト</span>
                        <span aria-hidden>＞</span>
                    </button>
                </li>
            </ul>

            <ul className="flex flex-col -space-y-px">
                {rightLinks.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href} className={itemClass}>
                            <span className="min-w-0 truncate">{link.label}</span>
                            <span aria-hidden>＞</span>
                        </Link>
                    </li>
                ))}
                <li>
                    {/* TODO: 確認ダイアログ + 削除 API */}
                    <button type="button" className={`${itemClass}`}>
                        <span className="min-w-0 truncate">アカウント削除</span>
                        <span aria-hidden>＞</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}
