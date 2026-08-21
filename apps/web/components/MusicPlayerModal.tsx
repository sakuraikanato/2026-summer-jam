"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Track } from "@/lib/tracks";

type MusicPlayerModalProps = {
    open: boolean;
    tracks: Track[];
    /** 開いたときに最初に表示する曲 */
    initialIndex?: number;
    onClose: () => void;
};

/** 矢印アイコンの表示サイズ（px）。svg 自体に余白があるので、実際の三角はこの 4 割ほど */
const ICON_SIZE = 48;

/** これ以上の距離を指で横に払ったら曲を切り替える（px） */
const SWIPE_THRESHOLD = 60;

/** 縦のスクロールか横のスワイプかを判定し始める距離（px） */
const AXIS_LOCK_THRESHOLD = 8;

/** 横スクロールでの曲送りに必要な累積スクロール量（px） */
const WHEEL_THRESHOLD = 40;

/** 慣性スクロールで曲が飛び続けないよう、1 回送ったら少し待つ（ms） */
const WHEEL_LOCK_MS = 500;

/**
 * << >> は同じ svg を 2 枚重ねて作る。
 * svg 自体に余白があるので、2 枚目を px 固定で引き寄せて三角同士をくっつける。
 * rem 指定だと端末の文字サイズ設定で間隔が変わるため、px で固定している。
 */
const arrow = (className?: string) => (
    <Image
        src="/images/soundarrow.svg"
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        aria-hidden
        className={`shrink-0 ${className ?? ""}`}
    />
);

const formatTime = (sec: number) => {
    if (!Number.isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
};

/**
 * 閉じているあいだは中身をアンマウントする。
 * 再生位置や表示中の曲は Player 側の state なので、開き直すと自然に初期状態へ戻る。
 */
export default function MusicPlayerModal({ open, tracks, ...rest }: MusicPlayerModalProps) {
    if (!open || tracks.length === 0) return null;

    return <Player tracks={tracks} {...rest} />;
}

type PlayerProps = Omit<MusicPlayerModalProps, "open">;

function Player({ tracks, initialIndex = 0, onClose }: PlayerProps) {
    const lastIndex = tracks.length - 1;

    const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), lastIndex));
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    /** 指の追従ぶんのズレ。0 以外なら指を置いている最中 */
    const [dragX, setDragX] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const axisRef = useRef<"none" | "x" | "y">("none");
    const wheelDeltaRef = useRef(0);
    const wheelLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 端では止める（ループさせない）
    const go = useCallback(
        (delta: number) => {
            setIndex((prev) => Math.min(Math.max(prev + delta, 0), lastIndex));
            setCurrentTime(0);
            setDuration(0);
        },
        [lastIndex],
    );

    // 再生状態と曲の切り替えを audio 要素に反映する
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            // ユーザー操作なしの再生はブラウザにブロックされるので、その場合は停止状態に戻す
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying, index]);

    // Esc で閉じる / 矢印キーでも曲を切り替えられるようにする
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, go]);

    // アンマウント後にロックのタイマーが残らないようにする
    useEffect(() => {
        return () => {
            if (wheelLockRef.current) clearTimeout(wheelLockRef.current);
        };
    }, []);

    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        axisRef.current = "none";
    }

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        const start = touchStartRef.current;
        if (!start) return;

        const touch = e.touches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;

        // 動き始めの向きで縦スクロールか横スワイプかを決め、以降は変えない
        if (axisRef.current === "none") {
            if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) return;
            axisRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        }
        if (axisRef.current === "y") return;

        // 先頭 / 末尾ではそれ以上引っ張れない感触にする
        const atEdge = (dx > 0 && index === 0) || (dx < 0 && index === lastIndex);
        setDragX(atEdge ? dx / 4 : dx);
    }

    function handleTouchEnd() {
        if (axisRef.current === "x") {
            if (dragX <= -SWIPE_THRESHOLD) go(1);
            else if (dragX >= SWIPE_THRESHOLD) go(-1);
        }

        touchStartRef.current = null;
        axisRef.current = "none";
        // dragX を 0 に戻すと transition が復活して、そのままスナップする
        setDragX(0);
    }

    /** トラックパッド / 横スクロール対応のマウスでの曲送り */
    function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
        // 縦方向が主な動きなら、ただのスクロールとみなして無視する
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        // 1 曲送ったあとの慣性ぶんは捨てる
        if (wheelLockRef.current) return;

        wheelDeltaRef.current += e.deltaX;
        if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) return;

        go(wheelDeltaRef.current > 0 ? 1 : -1);
        wheelDeltaRef.current = 0;
        wheelLockRef.current = setTimeout(() => {
            wheelLockRef.current = null;
        }, WHEEL_LOCK_MS);
    }

    function handleEnded() {
        if (index < lastIndex) go(1);
        else setIsPlaying(false);
    }

    function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
        const audio = audioRef.current;
        if (!audio) return;

        const time = Number(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    }

    const track = tracks[index];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="音楽プレイヤー"
            onClick={onClose}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-full w-full max-w-sm flex-col gap-3 overflow-y-auto rounded-2xl bg-[#F5EFDF] p-4 shadow-lg md:max-w-md md:p-6"
            >
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                        {index + 1} / {tracks.length}
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="閉じる"
                        className="px-2 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* スワイプ / 横スクロールで曲を切り替える。縦スクロールは殺さないよう touch-action は pan-y */}
                <div
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    className="touch-pan-y overflow-hidden"
                >
                    <div
                        className="flex"
                        style={{
                            transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                            // 指を置いているあいだは追従させたいので transition を切る
                            transition: dragX === 0 ? "transform 300ms ease-out" : "none",
                        }}
                    >
                        {tracks.map((item) => (
                            <div key={item.id} className="w-full shrink-0">
                                {item.artworkUrl ? (
                                    <Image
                                        src={item.artworkUrl}
                                        alt={item.title}
                                        width={400}
                                        height={400}
                                        className="aspect-square w-full rounded-xl object-cover"
                                    />
                                ) : (
                                    /* TODO: artworkUrl が入ったらプレースホルダーは不要 */
                                    <div className="aspect-square w-full rounded-xl bg-gray-300" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 写真のすぐ下：アーティストの詳細ページへの導線 */}
                <Link
                    href={`/detail/${track.userId}`}
                    className="rounded-full bg-[#E9876E] px-4 py-2 text-center text-sm font-bold"
                >
                    フルを聴く
                </Link>

                <div className="text-center">
                    <p className="truncate text-base font-bold">{track.title}</p>
                    <p className="truncate text-xs text-gray-600">{track.artist}</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-9 shrink-0 text-xs tabular-nums">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        aria-label="再生位置"
                        className="w-full accent-[#E9876E]"
                    />
                    <span className="w-9 shrink-0 text-right text-xs tabular-nums">
                        {formatTime(duration)}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        disabled={index === 0}
                        aria-label="前の曲"
                        className="flex items-center disabled:opacity-30"
                    >
                        {/* 右向きの矢印を左右反転し、2 つ重ねて << の形にする */}
                        {arrow("-scale-x-100")}
                        {arrow("-ml-[32px] -scale-x-100")}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPlaying((prev) => !prev)}
                        aria-label={isPlaying ? "一時停止" : "再生"}
                        className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FFCFA5]"
                    >
                        <Image
                            src={isPlaying ? "/images/soundstop.svg" : "/images/soundarrow.svg"}
                            alt=""
                            width={ICON_SIZE * 2}
                            height={ICON_SIZE * 2}
                            aria-hidden
                        />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        disabled={index === lastIndex}
                        aria-label="次の曲"
                        className="flex items-center disabled:opacity-30"
                    >
                        {arrow()}
                        {arrow("-ml-[32px]")}
                    </button>
                </div>

                <audio
                    ref={audioRef}
                    src={track.audioUrl}
                    preload="metadata"
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onEnded={handleEnded}
                />
            </div>
        </div>
    );
}
