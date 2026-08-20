"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth";
import { client } from "@/lib/client";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    console.log("email:", typeof email, "password:", typeof password);

    const { error, data } = await authClient.signIn.email({email: email, password: password});
    console.log(data)

    if (error) {
      setError(error.message ?? "ログインに失敗しました。");
      setIsPending(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleClick() {
    await client.api.follows[":id"].$post({param: {id: "4"}})
  }

  return (
    <>
      <h1>ログイン</h1>
      <form className="flex flex-col m-auto gap-4 min-w-1/3 max-w-2/3" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
        />

        {error && <p className="text-red-500">{error}</p>
        }
        <button type="submit" disabled={isPending}>
          {isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <button onClick={handleClick}>aaaaaq</button>
    </>
  );
}