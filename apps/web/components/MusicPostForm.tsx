"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// TODO: lib/auth.ts や lib/client.ts と同じく直書き。環境変数にまとめるときは一緒に直す
const API_URL = "http://localhost:8000";

const fieldClass = "rounded-lg border border-black/20 bg-white px-3 py-2 text-sm";

export default function MusicPostForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [audio, setAudio] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!audio || !thumbnail) {
            setError("音声ファイルとサムネイルを選んでください。");
            return;
        }

        setIsPending(true);

        const form = new FormData();
        form.append("title", title);
        form.append("audio", audio);
        form.append("thumbnail", thumbnail);

        try {
            const res = await fetch(`${API_URL}/api/musics`, {
                method: "POST",
                body: form,
                // セッションの Cookie を送る
                credentials: "include",
            });
            const json = await res.json();

            if (!res.ok || !json.success) {
                setError(json?.error?.message ?? "投稿に失敗しました。");
                setIsPending(false);
                return;
            }
        } catch {
            setError("通信に失敗しました。時間をおいて試してください。");
            setIsPending(false);
            return;
        }

        router.push("/profile");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
                <span className="text-sm font-bold">タイトル</span>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="曲のタイトル"
                    maxLength={255}
                    required
                    className={fieldClass}
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-bold">音声ファイル</span>
                <input
                    type="file"
                    accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg"
                    onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
                    required
                    className={fieldClass}
                />
                <span className="text-xs text-gray-600">mp3 / m4a / wav / aac / ogg</span>
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-bold">サムネイル</span>
                <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                    required
                    className={fieldClass}
                />
                <span className="text-xs text-gray-600">jpg / png / webp</span>
            </label>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-[#E9876E] px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
                {isPending ? "投稿中..." : "投稿する"}
            </button>
        </form>
    );
}
