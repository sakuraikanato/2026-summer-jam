import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <header className="w-full flex justify-around bg-[#FFF2E0]">
            <div>
                <Image src="/logo.png" alt="Logo" width={100} height={20} />
            </div>
            <nav>
                <ul className="flex gap-4">
                    <li><Link href="/auth/signup">新規登録</Link>/<Link href="/auth/signin">ログイン</Link></li>
                    <li><Link href="/auth/signin">応援希望の方はこちら＞</Link></li>
                </ul>
            </nav>
        </header>
    )
}