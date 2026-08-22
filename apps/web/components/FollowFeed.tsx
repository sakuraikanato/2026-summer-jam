"use client";

import { useState } from "react";
import FeedPost from "./FeedPost";
import FollowingRow from "./FollowingRow";
import type { User } from "@/lib/cats";
import type { FeedItem } from "@/lib/feed";

type FollowFeedProps = {
    users: User[];
    feed: FeedItem[];
};

export default function FollowFeed({ users, feed }: FollowFeedProps) {
    // null = 全員ぶん。人を選ぶとその人の投稿だけに絞る
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const shown = selectedId === null ? feed : feed.filter((item) => item.user.id === selectedId);
    const selectedName = users.find((user) => user.id === selectedId)?.name;

    return (
        <div className="flex flex-col gap-4">
            <FollowingRow users={users} selectedId={selectedId} onSelect={setSelectedId} />

            {/* 上の一覧と投稿を黒線で分ける。画面端まで伸ばす */}
            <hr className="-mx-4 border-black md:-mx-6" />

            {shown.length === 0 ? (
                <p className="text-sm text-gray-600">
                    {selectedName ? `${selectedName}の投稿はまだありません。` : "まだ投稿がありません。"}
                </p>
            ) : (
                <ul className="-mx-4 flex flex-col divide-y divide-black border-b border-black md:-mx-6">
                    {shown.map((item) => (
                        <li key={item.id} className="px-4 py-4 md:px-6">
                            <FeedPost item={item} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
