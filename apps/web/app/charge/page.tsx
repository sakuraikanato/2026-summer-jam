import Image from "next/image";

/**
 * 決済画面のはめ込み画像。
 * 画像の縦横比の都合で縦長の端末だと下に余白が出るため、
 * 画像と同じ白でその領域を埋めて、画面の下まで途切れないようにしている。
 * -mb-14 は layout.tsx の main の pb-14（固定ナビ用の余白）を打ち消すため。
 * TODO: 実際の決済フローができたら差し替える
 */
export default function Charge() {
    return (
        <div className="-mb-14 flex flex-1 flex-col bg-white">
            <Image
                src="/images/PaymentSampleSP.png"
                alt="支払い画面"
                width={479}
                height={797}
                priority
                className="w-full h-auto md:hidden"
            />
            <Image
                src="/images/PaymentSamplePC.png"
                alt="支払い画面"
                width={1244}
                height={875}
                priority
                className="hidden w-full h-auto md:block"
            />
        </div>
    );
}
