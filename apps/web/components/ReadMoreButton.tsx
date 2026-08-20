import Link from "next/link";

export default function ReadMoreButton() {
  return (
    <Link
      href="/detail"
      className="inline-block bg-orange-600 text-black text-sm font-bold py-2 px-6 rounded-full text-center hover:bg-orange-700 transition-colors"
    >
      もっと知る＞
    </Link>
  );
}
