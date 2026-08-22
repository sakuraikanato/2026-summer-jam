"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MONTHLY_PRICE } from "@/lib/fanPlan";

type SubscribeButtonProps = {
    /** 誰のファンになるか */
    name: string;
};

export default function SubscribeButton({ name }: SubscribeButtonProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // 確認中は Esc で閉じられるようにし、背面のスクロールを止める
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false);
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-1/2 self-center rounded-full bg-[#E9876E] px-4 py-2 text-center text-sm font-bold"
            >
                サブスク加入
            </button>

            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="サブスク加入の確認"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-5 text-black shadow-lg"
                    >
                        <p className="text-base font-bold">{name}のファンになりますか？</p>
                        <p className="text-sm">
                            月額 <span className="font-bold">{MONTHLY_PRICE}円</span> の
                            お支払いページへ進みます。キャンセルはいつでも可能です。
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full border border-black px-4 py-2 text-sm"
                            >
                                やめる
                            </button>
                            {/* TODO: サブスクの申し込み処理につなぐ。いまは課金ページへ送るだけ */}
                            <button
                                type="button"
                                onClick={() => router.push("/charge")}
                                className="rounded-full bg-[#E9876E] px-4 py-2 text-sm font-bold"
                            >
                                進む
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
