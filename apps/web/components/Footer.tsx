import Image from "next/image"
import Link from "next/link"

const items = [
    { href: "/", label: "ホーム", icon: "/images/home.svg" },
    { href: "/search", label: "サーチ", icon: "/images/search.svg" },
    { href: "/follow", label: "フォロー", icon: "/images/follow.svg" },
    { href: "/profile", label: "プロフィール", icon: "/images/profile.svg" },
] as const

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-orange-100">
            <nav>
                <ul className="flex justify-around">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className="flex items-center px-4 py-3"
                            >
                                <Image src={item.icon} alt={item.label} width={30} height={30} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </footer>
    )
}
