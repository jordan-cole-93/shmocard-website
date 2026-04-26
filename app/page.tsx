import Nav from "@/components/nav/Nav";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ShmoFamily from "@/components/home/ShmoFamily";
import WhyShmocard from "@/components/home/WhyShmocard";
import Showcase from "@/components/home/Showcase";
import RealResults from "@/components/home/RealResults";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/footer/Footer";

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
        <RealResults />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
