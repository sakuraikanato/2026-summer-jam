import CatCardList from "@/components/CatCardList";
import { getCatsByOrg, getOrg } from "@/lib/cats";

export default async function Home() {
  const org = await getOrg(1);
  const cats = await getCatsByOrg(1);

  return (
    <>
      {/* TODO: next/image に差し替え */}
      <div className="w-full aspect-[4/3] bg-gray-300" />
      <div className="flex flex-col gap-8 w-full max-w-sm mx-auto px-4 py-6">

        {org && (
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">応援できる子たち</h2>
            <CatCardList org={org} cats={cats} />
          </section>
        )}
      </div>
    </>
  );
}
