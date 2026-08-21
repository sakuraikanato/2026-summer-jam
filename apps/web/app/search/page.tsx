import SearchView from "@/components/SearchView";
import { getAllCats } from "@/lib/cats";

export default async function Search() {
  const cats = await getAllCats();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto px-4 py-6">
      <h1 className="text-xl font-bold">検索</h1>
      <SearchView cats={cats} />
    </div>
  );
}
