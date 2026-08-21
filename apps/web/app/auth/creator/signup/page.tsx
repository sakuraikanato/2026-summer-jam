"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth";
import { authButtonClass, authFieldClass, authFormClass } from "@/lib/authForm";

export default function CreatorSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません。");
      return;
    }

    setIsPending(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      // users.description は NOT NULL なので空文字で埋める。紹介文はプロフィール編集で入力する
      description: "",
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
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6 md:max-w-md md:py-10">
      <h1 className="text-xl font-bold">応募希望の方の新規登録</h1>

      <form
        onSubmit={handleSubmit}
        className={authFormClass}
      >
        <input
          type="text"
          placeholder="お名前"
          className={authFieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="パスワード（確認）"
          className={authFieldClass}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className={authButtonClass}
        >
          {isPending ? "登録中..." : "登録する"}
        </button>

        <Link href="/auth/signin" className="text-center text-xs underline">
          すでにアカウントをお持ちの方はログイン＞
        </Link>
      </form>
    </div>
  );
}
