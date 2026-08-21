import Link from "next/link";

type ProfileHeaderProps = {
    name: string;
};

export default function ProfileHeader({ name }: ProfileHeaderProps) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                {/* TODO: next/image に差し替え */}
                <div className="w-10 shrink-0 aspect-square rounded-full bg-gray-300" />

                <h1 className="min-w-0 truncate text-lg font-bold">{name}</h1>

                <Link
                    href="/profile/edit"
                    className="shrink-0 px-3 py-1 text-xs"
                >
                    プロフィール編集
                </Link>
            </div>

        </section>
    );
}
