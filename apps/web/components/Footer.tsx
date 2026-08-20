import Link from "next/link"

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-orange-100">
            <nav>
                <ul className="flex justify-around">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/search">Search</Link></li>
                    <li><Link href="/favorite">Favorite</Link></li>
                    <li><Link href="/profile">Profile</Link></li>
                </ul>
            </nav>
        </footer>
    )
}