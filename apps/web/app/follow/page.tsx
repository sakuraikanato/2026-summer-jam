import { requireUser } from "@/lib/dal";

export default async function Follow() {
    // 未ログインならサインインへ飛ばす
    await requireUser();

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6 md:max-w-3xl md:px-6 md:py-10">
            <h1 className="text-xl font-bold">フォロー</h1>
        </div>
    )
}
