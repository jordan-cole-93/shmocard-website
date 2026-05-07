// app/page.tsx — Shmocard homepage.
// Composition of 12 sections per TRANSLATION.md:
//   1  Hero                   marsh  → graham
//   2  AudienceStrip          graham → marsh
//   3  Proof                  marsh  → marsh
//   4  SubBrandSpotlight Review     marsh  → marsh
//   5  CrewStrip              marsh  → graham
//   6  SubBrandSpotlight Biz        graham → marsh   (reverse)
//   7  SubBrandSpotlight Link       marsh  → cocoa
//   8  SubBrandSpotlight Reputation cocoa  → marsh   (tall wave, reverse)
//   9  HowItWorks             marsh  → graham
//  10  VideoTestimonials      marsh  → graham        (after 03-04 reorder this slot)
//  11  Compatibility          graham → marsh
//  12  HomeFaq                marsh  → ember         (tall wave to FinalCta)
//  13  FinalCta               ember  → (footer follows)
//
// Mascot inventory (showcase exception — homepage only):
//   • 4 hero-size mascots (200px) — sub-brand spotlights
//     · biz: holding-card
//     · link: heart-hands
//     · reputation: megaphone (fitRatio 1.3)
//     · review uses photo, not mascot
//   • 1 sticker — FaqHead (thinking pose, md size)
//
// Server component. All client interactivity is opted-in inside leaf
// components (HeroTypeCycle, FaqItem) — keeps SSR/streaming clean.

import Hero from "@/components/home/Hero";
import AudienceStrip from "@/components/home/AudienceStrip";
import Proof from "@/components/home/Proof";
import SubBrandSpotlight from "@/components/home/SubBrandSpotlight";
import CrewStrip from "@/components/home/CrewStrip";
import HowItWorks from "@/components/home/HowItWorks";
import VideoTestimonials from "@/components/home/VideoTestimonials";
import Compatibility from "@/components/home/Compatibility";
import HomeFaq from "@/components/home/HomeFaq";
import FinalCta from "@/components/home/FinalCta";
import { SUB_BRANDS } from "@/components/home/home-data";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AudienceStrip />
      <Proof />
      {/* Section rotation: Review on marsh → CrewStrip on marsh → Biz on graham. */}
      <SubBrandSpotlight data={SUB_BRANDS[0]} nextBg="marsh" />
      <CrewStrip />
      <SubBrandSpotlight data={SUB_BRANDS[1]} nextBg="marsh" />
      <SubBrandSpotlight data={SUB_BRANDS[2]} nextBg="cocoa" />
      <SubBrandSpotlight data={SUB_BRANDS[3]} nextBg="marsh" waveSize="xl" />
      <HowItWorks />
      <VideoTestimonials />
      <Compatibility />
      <HomeFaq />
      <FinalCta />
    </main>
  );
}
