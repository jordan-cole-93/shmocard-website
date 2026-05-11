// app/shmo-review/page.tsx
// /shmo-review — Shmo Review category hub + embedded CR-80 buybox.
// Server component. Composes the new Wave-1 → Wave-5 sections from
// components/shmo-review/ inside the locked four-color rotation
// (marsh / graham / ember / cocoa). Section-bg invariants enforced
// at the type level by <Section bg nextBg> in components/layout/Section.tsx.
//
// SHOPIFY DATA DISCIPLINE:
//   The CR-80 product is fetched at request time and passed into
//   BuyboxSection (and reachable in cache for FormatPicker). Prices,
//   variants, images all live in Shopify. No hardcoded product data here.
//
// Reference plan: ~/.claude/plans/i-would-like-to-binary-feather.md

import type { Metadata } from "next";

import Section from "@/components/layout/Section";
import {
  Hero,
  BulletStrip,
  FormatPicker,
  BuyboxSection,
  HowItWorksSticky,
  StandoutMoments,
  NumbersWall,
  Objections,
  ShipReturns,
  ReviewFaq,
  FinalCta,
} from "@/components/shmo-review";
import "@/components/shmo-review/shmo-review.css";
import { getProductByHandle } from "@/lib/shopify/queries";

// CR-80 Shopify handle — single source of truth lives at
// components/shmo-review/data.ts::REVIEW_FORMATS. Mirrored here so the
// page can fetch the buybox product without instantiating REVIEW_FORMATS.
const CR80_HANDLE = "google-reviews-nfc-tap-card-cr80";

export const metadata: Metadata = {
  title: "Shmo Review — Built for crews. Priced for bulk.",
  description:
    "Pre-programmed NFC review cards, signs, and discs. Hand one over after every transaction — customer taps, leaves a five-star review, and you climb the rankings. No app, no login, no friction.",
};

export default async function ShmoReviewPage() {
  const cr80 = await getProductByHandle(CR80_HANDLE);

  return (
    <main className="rev-page">
      {/* Section rotation — clean marsh ↔ graham alternation with cocoa
         and ember as accents (audit H1 fix, 2026-05-11). Previously had
         five marsh-marsh runs with no waves; the page read monochrome.
         Now: marsh→graham→marsh→graham→marsh→graham→marsh→cocoa→marsh→
         graham→ember. Ratios land near the 60/25/10/5 guideline. */}

      {/* 1. Hero — marsh → graham */}
      <Section bg="marsh" nextBg="graham" waveSize="lg" ariaLabel="Shmo Review hero">
        <Hero />
      </Section>

      {/* 2. BulletStrip — graham → marsh */}
      <Section bg="graham" nextBg="marsh" waveSize="lg" ariaLabel="Why crews tap">
        <BulletStrip />
      </Section>

      {/* 3. FormatPicker — marsh → graham */}
      <Section
        bg="marsh"
        nextBg="graham"
        waveSize="lg"
        id="formats"
        ariaLabel="Formats"
      >
        <FormatPicker />
      </Section>

      {/* 4. BuyboxSection — graham → marsh (audit H1: BuyboxSection moved
          from marsh to graham to break the marsh-marsh run with FormatPicker). */}
      <Section
        bg="graham"
        nextBg="marsh"
        waveSize="lg"
        id="buybox"
        ariaLabel="CR-80 buybox"
      >
        <BuyboxSection product={cr80} />
      </Section>

      {/* 5. HowItWorksSticky — marsh → graham (xl wave for the dense section) */}
      <Section
        bg="marsh"
        nextBg="graham"
        waveSize="xl"
        id="how"
        ariaLabel="How it works"
      >
        <HowItWorksSticky />
      </Section>

      {/* 6. StandoutMoments — graham → marsh */}
      <Section
        bg="graham"
        nextBg="marsh"
        waveSize="lg"
        ariaLabel="Standout moments"
      >
        <StandoutMoments />
      </Section>

      {/* 7. NumbersWall — marsh → cocoa (xl wave for the dark-bg transition) */}
      <Section bg="marsh" nextBg="cocoa" waveSize="xl" ariaLabel="Verified shop numbers">
        <NumbersWall />
      </Section>

      {/* 8. Objections — cocoa → marsh */}
      <Section bg="cocoa" nextBg="marsh" waveSize="lg" ariaLabel="Objections answered">
        <Objections />
      </Section>

      {/* 9. ShipReturns — marsh → graham */}
      <Section
        bg="marsh"
        nextBg="graham"
        waveSize="lg"
        ariaLabel="Ship and returns"
      >
        <ShipReturns />
      </Section>

      {/* 10. ReviewFaq — graham → ember (xl wave for the bright-bg transition) */}
      <Section
        bg="graham"
        nextBg="ember"
        waveSize="xl"
        ariaLabel="Frequently asked questions"
      >
        <ReviewFaq />
      </Section>

      {/* 11. FinalCta — ember (footer follows in layout.tsx) */}
      <Section bg="ember" ariaLabel="Final call to action">
        <FinalCta />
      </Section>
    </main>
  );
}
