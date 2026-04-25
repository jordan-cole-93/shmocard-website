import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { ShmoFamily } from "@/components/home/ShmoFamily";
import { WhyShmocard } from "@/components/home/WhyShmocard";
import { ShmoReviewSpotlight } from "@/components/home/ShmoReviewSpotlight";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ShmoFamily />
        <WhyShmocard />
        <ShmoReviewSpotlight />
      </main>
      <Footer />
    </>
  );
}
