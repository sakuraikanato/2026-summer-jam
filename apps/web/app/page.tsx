import Image from "next/image";
import MusicPlayerLauncher from "@/components/MusicPlayerLauncher";
import { getTracks } from "@/lib/tracks";

export default async function Home() {
  const tracks = await getTracks();

  return (
    <>
      <Image
        src="/PocketAle_hero.svg"
        alt="PocketAle"
        width={1440}
        height={640}
        priority
        className="w-full shrink-0 h-auto"
      />
      <div className="flex flex-col gap-8 w-full max-w-sm mx-auto px-4 py-6 md:max-w-3xl md:px-6 md:py-10">
        <MusicPlayerLauncher tracks={tracks} />
      </div>
    </>
  );
}