import { notFound } from "next/navigation";
import Link from "next/link";
import { getCat, getOrg, getPostsByCat } from "@/lib/cats";

export default async function CatPage({
  params,
}: PageProps<"/detail/[id]/cats/[catId]">) {
  const { id, catId } = await params;
  const cat = await getCat(Number(catId));

  // URL の団体と実際の所属が食い違う場合は 404 にする
  if (!cat || cat.orgId !== Number(id)) notFound();

  const [org, posts] = await Promise.all([
    getOrg(cat.orgId),
    getPostsByCat(cat.id),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6">
      {org && (
        <p className="text-sm">
          飼い主：
          <Link href={`/detail/${org.id}`} className="underline">
            {org.name}
          </Link>
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        {/* TODO: next/image に差し替え */}
        <div className="w-32 aspect-square rounded-full bg-gray-300" />
        <h1 className="text-xl font-bold">{cat.name}</h1>
        {cat.description && <p className="text-sm text-center">{cat.description}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">投稿</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-600">まだ投稿がありません。</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
                <p className="text-sm">{post.content}</p>
                <p className="mt-1 text-xs text-gray-500">{post.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
