"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/lib/cats";

type SearchViewProps = {
    users: User[];
};

// TODO: localStorage / API から取得する
const histories = ["橘", "佐伯 りく", "白石"];

export default function SearchView({ users }: SearchViewProps) {
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    function search(keyword: string) {
        setQuery(keyword);
        setSubmitted(keyword);
        setIsFocused(false);
    }

    // 名前の部分一致で絞り込む。前後の空白は無視し、英字は大小を区別しない
    const keyword = submitted?.trim().toLowerCase() ?? "";
    const results =
        keyword === ""
            ? []
            : users.filter((user) => user.name.toLowerCase().includes(keyword));

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        search(query);
                    }}
                    className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2"
                >
                    <Image src="/images/search.svg" alt="サーチ" width={20} height={20} />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="ユーザー名で検索"
                        className="w-full bg-transparent text-sm outline-none"
                    />
                </form>

                {/* フォーカス中だけ履歴を下に開く */}
                {isFocused && histories.length > 0 && (
                    <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md">
                        {histories.map((history) => (
                            <li key={history}>
                                <button
                                    type="button"
                                    // onBlur より先に発火させて、履歴のクリックを拾えるようにする
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => search(history)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-black/5"
                                >
                                    <Image
                                        src="/images/history.svg"
                                        alt=""
                                        width={20}
                                        height={20}
                                        aria-hidden
                                    />
                                    {history}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {submitted !== null && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold">
                        {submitted}の検索結果：{results.length}件見つかりました
                    </h2>

                    {results.length === 0 ? (
                        <p className="text-sm text-gray-600">該当するユーザーが見つかりませんでした。</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {results.map((user) => (
                                <li key={user.id}>
                                    <Link
                                        href={`/detail/${user.id}`}
                                        className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 p-3"
                                    >
                                        {/* TODO: imageUrl があれば next/image に差し替え */}
                                        <div className="w-12 shrink-0 aspect-square rounded-full bg-gray-300" />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold">{user.name}</p>
                                            {user.description && (
                                                <p className="truncate text-xs text-gray-600">
                                                    {user.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}
