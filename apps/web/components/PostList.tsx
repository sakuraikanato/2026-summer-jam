import type { Post } from "@/lib/cats";

type PostListProps = {
    posts: Post[];
    emptyMessage: string;
};

export default function PostList({ posts, emptyMessage }: PostListProps) {
    if (posts.length === 0) {
        return <p className="text-sm text-gray-600">{emptyMessage}</p>;
    }

    return (
        <ul className="flex flex-col gap-3">
            {posts.map((post) => (
                <li key={post.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
                    <p className="text-sm">{post.content}</p>
                    <p className="mt-1 text-xs text-gray-500">{post.createdAt}</p>
                </li>
            ))}
        </ul>
    );
}
