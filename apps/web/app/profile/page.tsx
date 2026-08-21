import Link from "next/link";
import SupportCard from "@/components/SupportCard";
import PostList from "@/components/PostList";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import { requireUser } from "@/lib/dal";
import { getPostsByOrg, getSupportingCats } from "@/lib/cats";

export default async function Profile() {
  const user = await requireUser();
  const userId = Number(user.id);

  // "creater" = 応援される側（団体）
  const isCreater = user.role === "creater";

  const supportingCats = isCreater ? [] : await getSupportingCats(userId);
  const posts = isCreater ? await getPostsByOrg(userId) : [];

  return (
    <div className="flex flex-1 flex-col gap-8 w-full max-w-sm mx-auto py-6">
      <ProfileHeader name={user.name}/>

      {isCreater ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">投稿一覧</h2>
            <Link
              href="/posts/new"
              className="rounded-full bg-orange-600 px-4 py-1 text-sm font-bold"
            >
              投稿する
            </Link>
          </div>
          <PostList posts={posts} emptyMessage="まだ投稿がありません。" />
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="-mx-4 border-b border-black px-4 pb-2 text-base font-semibold">
            応援している子たち
          </h2>
          {supportingCats.length === 0 ? (
            <p className="text-sm text-gray-600">まだ応援している子がいません。</p>
          ) : (
            <ul className="-mx-4 flex flex-col gap-3">
              {supportingCats.map((cat) => (
                <li key={cat.id}>
                  <SupportCard cat={cat} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="-mx-4 mt-auto border-t border-black px-4 pt-4">
        <ProfileMenu />
      </div>
    </div>
  );
}
