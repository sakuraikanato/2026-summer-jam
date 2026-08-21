/**
 * ログイン / 新規登録で見た目を揃えるための共通クラス。
 * 2 画面を行き来してもカードの大きさが変わらないよう、
 * min-h は入力欄が多い方（新規登録・4 項目）の高さに合わせている。
 */
export const authFormClass =
  "flex min-h-[332px] flex-col gap-4 rounded-2xl bg-white p-5 text-black shadow-sm";

export const authFieldClass = "rounded-lg border border-black/20 px-3 py-2 text-sm";

/**
 * mt-auto でカード下端に寄せる。入力欄の数が違ってもボタンの位置が揃う。
 * w-1/2 + self-center で、フォーム幅の半分を中央に置く。
 */
export const authButtonClass =
  "mt-auto w-1/2 self-center rounded-xl bg-[#7D7373] px-4 py-3 text-sm font-bold text-white disabled:opacity-50";
