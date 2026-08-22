import FollowFeed from "@/components/FollowFeed";
import { requireUser } from "@/lib/dal";
import { getFeed, getFollowingUsers } from "@/lib/feed";

export default async function Follow() {
    // 未ログインならサインインへ飛ばす
    await requireUser("フォロー");

    const [following, feed] = await Promise.all([getFollowingUsers(), getFeed()]);

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6 md:max-w-3xl md:px-6 md:py-10">
            <FollowFeed users={following} feed={feed} />
        </div>
    );
}
