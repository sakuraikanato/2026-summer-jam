import Image from "next/image"
import Link from "next/link"
import { getUser } from "@/lib/dal"

export default async function Header() {
    const user = await getUser()

    return (
        <header className="w-full flex items-center justify-between px-2 bg-[#FFF2E0]">
            <div>
                <Image src="/logo.png" alt="Logo" width={100} height={20} />
            </div>

            {user ? (
                <Link href="/profile" className="flex items-center">
                    <Image src="/images/usericon.svg" alt="プロフィール" width={30} height={30} />
                </Link>
            ) : (
                <nav>
                    <ul className="flex gap-4">
                        <li><Link href="/auth/signup">新規登録</Link>/<Link href="/auth/signin">ログイン</Link></li>
                        <li><Link href="/auth/signin">応援希望の方はこちら＞</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    )
}
