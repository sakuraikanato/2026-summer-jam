"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth";
import { authButtonClass, authFieldClass, authFormClass } from "@/lib/authForm";

export default function Signin({ searchParams }: PageProps<"/auth/signin">) {
  // 未ログインで弾かれてきた場合、どの機能を使おうとしたかが ?required= に入る
  const required = use(searchParams).required;
  const feature = typeof required === "string" ? required : null;

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const { error } = await authClient.signIn.email({ email: email, password: password });

    if (error) {
      setError(error.message ?? "ログインに失敗しました。");
      setIsPending(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6 md:max-w-md md:py-10">
      {feature && (
        <p className="text-sm">
          {feature}機能を利用するにはログイン/新規登録をする必要があります。
        </p>
      )}

      <h1 className="text-xl font-bold">ログイン</h1>

      <form
        onSubmit={handleSubmit}
        className={authFormClass}
      >
        <input
          type="email"
          placeholder="メールアドレス"
          className={authFieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="パスワード"
          className={authFieldClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className={authButtonClass}
        >
          {isPending ? "ログイン中..." : "ログイン"}
        </button>

        <Link href="/auth/creator/signup" className="text-center text-xs underline">
          応募希望の方の新規登録はこちら＞
        </Link>
      </form>
    </div>
  );
}
