import CatCardList from "@/components/CatCardList";
import { getCatsByUser, getUser } from "@/lib/cats";

export default async function Home() {
  const user = await getUser(1);
  const cats = await getCatsByUser(1);

  return (
    <>
      {/* TODO: next/image に差し替え */}
      <div className="w-full shrink-0 aspect-[4/3] bg-gray-300" />
      <div className="flex flex-col gap-8 w-full max-w-sm mx-auto px-4 py-6">

        {user && (
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">応援できる子たち</h2>
            <CatCardList user={user} cats={cats} />
          </section>
        )}
      </div>
    </>
  );
}