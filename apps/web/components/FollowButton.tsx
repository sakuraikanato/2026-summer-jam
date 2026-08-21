"use client";

import { useState } from "react";

type FollowButtonProps = {
    initialFollowing: boolean;
};

export default function FollowButton({ initialFollowing }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);

    // TODO: API ができたらここで永続化する
    function toggle() {
        setIsFollowing((prev) => !prev);
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={isFollowing}
            className={`rounded-full border border-black px-3 py-1 text-xs ${
                isFollowing ? "bg-[#D4D4D4]" : "bg-[#FFE9C9]"
            }`}
        >
            {isFollowing ? "フォロー中" : "フォロー"}
        </button>
    );
}
