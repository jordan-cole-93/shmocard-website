import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ShmoFamily } from "@/components/home/ShmoFamily";
import { WhyShmocard } from "@/components/home/WhyShmocard";
import { SubBrandShowcase } from "@/components/home/SubBrandShowcase";
import { RealResults } from "@/components/home/RealResults";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <div className="home">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <ShmoFamily />
        <WhyShmocard />
        <SubBrandShowcase />
        <RealResults />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
