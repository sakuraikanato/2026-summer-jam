"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth";

export default function CreatorSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      description,
      // 応募する在校生は応援される側なので creator 固定
      role: "creator",
    });

    if (error) {
      setError(error.message ?? "登録に失敗しました。");
      setIsPending(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <h1>応募希望の方の新規登録</h1>
      <form className="flex flex-col m-auto gap-4 min-w-1/3 max-w-2/3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="お名前"
          className="border"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="メールアドレス"
          className="border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="パスワード"
          className="border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <textarea
          placeholder="紹介文（専攻や活動について）"
          className="border"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? "登録中..." : "登録する"}
        </button>

        <Link href="/auth/signin" className="text-sm underline">
          すでにアカウントをお持ちの方はログイン＞
        </Link>
      </form>
    </>
  );
}
