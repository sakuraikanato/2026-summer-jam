import { MONTHLY_PRICE, benefits } from "@/lib/fanPlan";

type FanPlanBoxProps = {
    /** 誰のファンになるか */
    name: string;
};

export default function FanPlanBox({ name }: FanPlanBoxProps) {
    return (
        <section className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/70 p-4">
            <h2 className="truncate text-base font-bold">{name}のファンになる</h2>

            <p className="text-sm">
                月額 <span className="font-bold">{MONTHLY_PRICE}円</span>
                <span className="text-gray-600"> / キャンセルはいつでも可能</span>
            </p>

            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">特典一覧:</p>
                <ul className="flex flex-col gap-1 text-sm">
                    {benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-1">
                            <span aria-hidden>・</span>
                            <span className="min-w-0">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
