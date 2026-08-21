import Link from "next/link";
import SupportCard from "@/components/SupportCard";
import PostList from "@/components/PostList";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import { requireUser } from "@/lib/dal";
import { getPostsByUser, getSupportingUsers } from "@/lib/cats";

export default async function Profile() {
  const user = await requireUser("マイページ");
  const userId = Number(user.id);

  // "creator" = 応援される側（応募した在校生）
  const isCreater = user.role === "creator";

  const supportingUsers = isCreater ? [] : await getSupportingUsers(userId);
  const posts = isCreater ? await getPostsByUser(userId) : [];

  return (
    <div className="flex flex-1 flex-col gap-8 w-full max-w-sm mx-auto px-4 py-6 md:max-w-3xl md:px-6 md:py-10">
      <ProfileHeader name={user.name}/>

      {isCreater ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">投稿一覧</h2>
            <Link
              href="/music/new"
              className="rounded-full bg-[#E9876E] px-4 py-1 text-sm font-bold"
            >
              音楽を投稿
            </Link>
          </div>
          <PostList posts={posts} emptyMessage="まだ投稿がありません。" />
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="-mx-4 border-b border-black px-4 pb-2 text-base font-semibold">
            応援している人たち
          </h2>
          {supportingUsers.length === 0 ? (
            <p className="text-sm text-gray-600">まだ応援している人がいません。</p>
          ) : (
            <ul className="-mx-4 flex flex-col gap-3 md:mx-0 md:grid md:grid-cols-2">
              {supportingUsers.map((user) => (
                <li key={user.id}>
                  <SupportCard user={user} />
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
