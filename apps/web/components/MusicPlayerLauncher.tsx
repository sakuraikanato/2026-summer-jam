"use client";

import { useState } from "react";
import Image from "next/image";
import MusicPlayerModal from "./MusicPlayerModal";
import type { Track } from "@/lib/tracks";

type MusicPlayerLauncherProps = {
    tracks: Track[];
    /** 最初から開いた状態にしたいときに true */
    defaultOpen?: boolean;
};

/**
 * page.tsx は Server Component なのでモーダルの開閉 state を持てない。
 * 一覧とモーダルをまとめたこのクライアント側のラッパーを置く。
 */
export default function MusicPlayerLauncher({
    tracks,
    defaultOpen = false,
}: MusicPlayerLauncherProps) {
    // 選んだ曲から再生を始めたいので、開いているかどうかは index の有無で持つ
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ? 0 : null);

    if (tracks.length === 0) return null;
    console.log(tracks)

    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">うたを聴く</h2>

            <ul className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-4">
                {tracks.map((track, index) => (
                    <li key={track.id}>
                        <button
                            type="button"
                            onClick={() => setOpenIndex(index)}
                            className="flex w-full flex-col items-center gap-2"
                        >
                            <span className="relative block w-full">
                                {track.artworkUrl ? (
                                    <Image
                                        src={track.artworkUrl}
                                        alt={track.title}
                                        width={200}
                                        height={200}
                                        className="aspect-square w-full rounded-lg object-cover"
                                    />
                                ) : (
                                    /* TODO: artworkUrl が入ったらプレースホルダーは不要 */
                                    <span className="block aspect-square w-full rounded-lg bg-gray-300" />
                                )}

                                {/* タップで再生できることを示すアイコンをジャケット中央に重ねる */}
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src="/images/soundclick.svg"
                                        alt=""
                                        width={40}
                                        height={40}
                                        aria-hidden
                                    />
                                </span>
                            </span>

                            <p className="w-full truncate text-center text-sm font-medium">
                                {track.title}
                            </p>
                        </button>
                    </li>
                ))}
            </ul>

            <MusicPlayerModal
                open={openIndex !== null}
                tracks={tracks}
                initialIndex={openIndex ?? 0}
                onClose={() => setOpenIndex(null)}
            />
        </section>
    );
}
