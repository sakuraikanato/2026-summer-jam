import { notFound } from "next/navigation";
import CatCardList from "@/components/CatCardList";
import { getCatsByOrg, getOrg, getPostsByOrg } from "@/lib/cats";

export default async function OrgPage({ params }: PageProps<"/detail/[id]">) {
  const { id } = await params;
  const org = await getOrg(Number(id));
  if (!org) notFound();

  const [cats, posts] = await Promise.all([
    getCatsByOrg(org.id),
    getPostsByOrg(org.id),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6">
      <div className="flex flex-col items-center gap-3">
        {/* TODO: next/image に差し替え */}
        <div className="w-24 aspect-square rounded-full bg-gray-300" />
        <h1 className="text-xl font-bold">{org.name}</h1>
        {org.description && <p className="text-sm text-center">{org.description}</p>}
      </div>

      <CatCardList org={org} cats={cats} limit={cats.length} />

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
