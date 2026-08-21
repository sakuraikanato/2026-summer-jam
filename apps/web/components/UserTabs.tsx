"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type TabKey = "cats" | "posts";

type UserTabsProps = {
    cats: ReactNode;
    posts: ReactNode;
};

const tabs = [
    { key: "cats", label: "飼ってる猫" },
    { key: "posts", label: "投稿" },
] as const;

export default function UserTabs({ cats, posts }: UserTabsProps) {
    const [active, setActive] = useState<TabKey>("cats");

    return (
        <div className="-mx-4 flex flex-1 flex-col gap-3 bg-[#FFF2CF]">
            <div role="tablist" className="flex -space-x-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active === tab.key}
                        onClick={() => setActive(tab.key)}
                        className={`flex-1 border border-black py-2 text-sm ${
                            active === tab.key ? "bg-[#F2E3BC] font-bold" : "bg-[#FFF2CF]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div role="tabpanel">{active === "cats" ? cats : posts}</div>
        </div>
    );
}
