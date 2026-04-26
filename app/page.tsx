import Nav from "@/components/nav/Nav";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ShmoFamily from "@/components/home/ShmoFamily";
import WhyShmocard from "@/components/home/WhyShmocard";
import Showcase from "@/components/home/Showcase";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="bg-snow min-h-screen">
        <Hero />
        <TrustBar />
        <ShmoFamily />
        <WhyShmocard />
        <Showcase />
      </main>
    </>
  );
}
