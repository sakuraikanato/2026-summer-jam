import Image from "next/image"
import Link from "next/link"
import { getUser } from "@/lib/dal"

export default async function Header() {
    const user = await getUser()

    return (
        <header className="w-full flex items-center justify-between gap-2 px-2 py-2 bg-[#FFF2E0]">
            {/* 幅が足りないときはロゴ側を縮めて、リンクの折り返しを防ぐ */}
            <div className="min-w-0">
                <Image
                    src="/logo.svg"
                    alt="PocketAle"
                    width={520}
                    height={150}
                    priority
                    className="h-6 md:h-12 w-auto max-w-full object-contain object-left"
                />
            </div>

            {user ? (
                <Link href="/profile" className="flex shrink-0 items-center">
                    <Image src="/images/usericon.svg" alt="プロフィール" width={30} height={30} />
                </Link>
            ) : (
                <nav className="shrink-0">
                    <ul className="flex items-center gap-2 whitespace-nowrap text-xs">
                        <li><Link href="/auth/signup">新規登録</Link>/<Link href="/auth/signin">ログイン</Link></li>
                        <li><Link href="/auth/creator/signup">応援希望の方はこちら＞</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    )
}
