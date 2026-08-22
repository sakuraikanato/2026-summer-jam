import Image from "next/image"
import Link from "next/link"
import { getUser } from "@/lib/dal"

export default async function Header() {
    const user = await getUser()

    // 高さを固定しておくと、ロゴを大きくしてもヘッダーの見た目が変わらない
    return (
        <header className="h-10 w-full bg-[#FFF2E0] px-2 md:h-16 md:px-6">
            <div className="mx-auto flex h-full w-full max-w-sm items-center justify-between gap-2 md:max-w-3xl">
            {/* 幅が足りないときはロゴ側を縮めて、リンクの折り返しを防ぐ */}
            <div className="min-w-0">
                <Image
                    src="/logo.svg"
                    alt="PocketAle"
                    width={520}
                    height={150}
                    priority
                    className="h-8 md:h-14 w-auto max-w-full object-contain object-left"
                />
            </div>

            {user ? (
                <Link href="/profile" className="flex shrink-0 items-center">
                    <Image src="/images/usericon.svg" alt="プロフィール" width={30} height={30} />
                </Link>
            ) : (
                <nav className="shrink-0">
                    <ul className="flex items-center gap-2 whitespace-nowrap text-xs md:gap-4 md:text-sm">
                        <li><Link href="/auth/signup">新規登録</Link>/<Link href="/auth/signin">ログイン</Link></li>
                        <li><Link href="/auth/creator/signup">応援希望の方はこちら＞</Link></li>
                    </ul>
                </nav>
            )}
            </div>
        </header>
    )
}
