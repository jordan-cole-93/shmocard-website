import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { SubBrandShowcase } from "@/components/home/SubBrandShowcase";
import { WhyShmocard } from "@/components/home/WhyShmocard";

export default function HomePage() {
  return (
    <div className="home">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <SubBrandShowcase />
        <WhyShmocard />
      </main>
      <Footer />
    </div>
  );
}
