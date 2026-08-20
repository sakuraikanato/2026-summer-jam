import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadMoreButton from "@/components/ReadMoreButton";
import ReadMoreButton from "@/components/ReadMoreButton";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-16">
        <p>メイン</p>
        <ReadMoreButton/>
      </main>
      <Footer />
    </>
  );
}
