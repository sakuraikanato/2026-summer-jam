import MusicPlayerLauncher from "@/components/MusicPlayerLauncher";
import { getUser } from "@/lib/cats";
import { getTracks } from "@/lib/tracks";

export default async function Home() {
  const user = await getUser(1);
  const tracks = await getTracks();

  return (
    <>
      {/* TODO: next/image に差し替え */}
      <div className="w-full shrink-0 aspect-[4/3] bg-gray-300 md:aspect-[3/1]" />
      <div className="flex flex-col gap-8 w-full max-w-sm mx-auto px-4 py-6 md:max-w-3xl md:px-6 md:py-10">
        <MusicPlayerLauncher tracks={tracks} />
      </div>
    </>
  );
}