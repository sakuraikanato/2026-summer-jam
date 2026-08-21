import Link from "next/link";
import type { Cat } from "@/lib/cats";

type CatCardProps = {
    cat: Pick<Cat, "id" | "userId" | "name" | "imageUrl">;
};

export default function CatCard({ cat }: CatCardProps) {
    return (
        <Link
            href={`/detail/${cat.userId}/cats/${cat.id}`}
            className="flex flex-col items-center gap-2 w-full"
        >
            {/* TODO: imageUrl があれば next/image に差し替え */}
            <div className="w-full aspect-square rounded-lg bg-gray-300" />
            <p className="text-sm font-medium text-center text-gray-900 dark:text-gray-100">
                {cat.name}
            </p>
        </Link>
    );
}
