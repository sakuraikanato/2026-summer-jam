"use client";

import { useState } from "react";
import Image from "next/image";
import CatCard from "./CatCard";
import type { Cat } from "@/lib/cats";

type SearchViewProps = {
    cats: Cat[];
};

// TODO: localStorage / API から取得する
const histories = ["ミケ", "三毛猫", "子猫"];

export default function SearchView({ cats }: SearchViewProps) {
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    function search(keyword: string) {
        setQuery(keyword);
        setSubmitted(keyword);
        setIsFocused(false);
    }

    const results =
        submitted === null
            ? []
            : cats.filter((cat) => cat.name.includes(submitted));

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
                        placeholder="猫の名前で検索"
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
                        <p className="text-sm text-gray-600">該当する子が見つかりませんでした。</p>
                    ) : (
                        <ul className="grid grid-cols-3 gap-2">
                            {results.map((cat) => (
                                <li key={cat.id}>
                                    <CatCard cat={cat} />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}
