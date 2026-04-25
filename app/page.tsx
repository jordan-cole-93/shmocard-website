import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ShmoFamily } from "@/components/home/ShmoFamily";
import { WhyShmocard } from "@/components/home/WhyShmocard";

export default function HomePage() {
  return (
    <div className="home">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <ShmoFamily />
        <WhyShmocard />
      </main>
      <Footer />
    </div>
  );
}
