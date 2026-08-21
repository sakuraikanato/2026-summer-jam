import Link from "next/link";

type ReadMoreButtonProps = {
  href: string;
};

export default function ReadMoreButton({ href }: ReadMoreButtonProps) {
  return (
    <Link
      href={href}
      className="inline-block bg-orange-600 text-black text-sm font-bold py-2 px-6 rounded-full text-center hover:bg-orange-700 transition-colors"
    >
      もっと知る＞
    </Link>
  );
}
