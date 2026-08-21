import Link from "next/link";
import CatCard from "./CatCard";
import type { Cat, User } from "@/lib/cats";

type CatCardListProps = {
    user: Pick<User, "id" | "name" | "imageUrl">;
    cats: Cat[];
    limit?: number;
};

export default function CatCardList({ user, cats, limit = 3 }: CatCardListProps) {
    return (
        <section className="flex flex-col gap-4 w-full max-w-sm mx-auto rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
            <Link href={`/detail/${user.id}`} className="flex items-center gap-2">
                {/* TODO: imageUrl があれば next/image に差し替え */}
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            </Link>

            <ul className="grid grid-cols-3 gap-2">
                {cats.slice(0, limit).map((cat) => (
                    <li key={cat.id}>
                        <CatCard cat={cat} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
