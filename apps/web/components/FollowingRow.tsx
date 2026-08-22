"use client";

import type { User } from "@/lib/cats";

type FollowingRowProps = {
    users: User[];
    /** null なら全員ぶんを表示する */
    selectedId: number | null;
    onSelect: (id: number | null) => void;
};

export default function FollowingRow({ users, selectedId, onSelect }: FollowingRowProps) {
    return (
        <section className="flex flex-col gap-2">
            <h1 className="text-base font-bold">フォローコンテンツ</h1>

            {/* 人数が増えても崩れないよう横スクロールにする */}
            <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6 md:px-6">
                {users.map((user) => {
                    const isSelected = selectedId === user.id;
                    return (
                        <li key={user.id} className="shrink-0">
                            {/* もう一度押すと全員表示に戻す */}
                            <button
                                type="button"
                                onClick={() => onSelect(isSelected ? null : user.id)}
                                aria-pressed={isSelected}
                                className="flex items-center gap-2"
                            >
                                {/* TODO: imageUrl があれば next/image に差し替え */}
                                <span
                                    className={`block w-8 shrink-0 aspect-square rounded-full bg-gray-300 ${
                                        isSelected ? "ring-2 ring-black" : ""
                                    }`}
                                />
                                <span className={`whitespace-nowrap text-sm ${isSelected ? "font-bold" : ""}`}>
                                    {user.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
