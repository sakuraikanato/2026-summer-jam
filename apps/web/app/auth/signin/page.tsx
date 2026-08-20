export default function Signin() {
  return (
    <>
      <h1>ログイン</h1>
      <form className="flex flex-col m-auto gap-4 min-w-1/3 max-w-2/3">
        <input type="email" placeholder="メールアドレス" className="border" />
        <input type="password" placeholder="パスワード" className="border" />
        <button type="submit">ログイン</button>
      </form>
    </>
  )
}