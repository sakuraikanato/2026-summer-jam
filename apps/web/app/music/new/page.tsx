import { redirect } from "next/navigation";
import MusicPostForm from "@/components/MusicPostForm";
import { requireUser } from "@/lib/dal";

export default async function NewMusic() {
  const user = await requireUser("音楽投稿");

  // 投稿できるのは応援される側だけ
  if (user.role !== "creator") redirect("/profile");

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6">
      <h1 className="text-xl font-bold">音楽を投稿する</h1>
      <MusicPostForm />
    </div>
  );
}
