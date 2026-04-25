import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/home/Hero";
import { ShmoFamily } from "@/components/home/ShmoFamily";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ShmoFamily />
      </main>
      <Footer />
    </>
  );
}
