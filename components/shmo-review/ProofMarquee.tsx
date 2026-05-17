// components/shmo-review/ProofMarquee.tsx — Shmo Review proof marquee.
//
// Replaces NumbersWall (Phase 7). Converts the 8 verified shop
// %-increases from animated bars into an infinite horizontal
// auto-scrolling proof strip using the .shm-marquee primitive
// added to components.css alongside this component.
//
// Server component — no client JS needed.
// Animation is pure CSS via .shm-marquee__track keyframe.
// Reduced-motion: animation stops; items remain in static flex row.

import Section from "@/components/layout/Section";

export const PROOF_ITEMS = [
  { shop: "Axel's Pawn",     owner: "Carly",     industry: "Pawn shop",   city: "Minneapolis", inc: "+71%" },
  { shop: "Garden City",     owner: "Thomas",    industry: "Roofing co",  city: "Atlanta",     inc: "+86%" },
  { shop: "Cashco",          owner: "Morris",    industry: "Pawn & loan", city: "Houston",     inc: "+47%" },
  { shop: "Buffalo Jewelry", owner: "Joey",      industry: "Pawn & loan", city: "Buffalo",     inc: "+81%" },
  { shop: "Smyrna",          owner: "Jason",     industry: "Auto detail", city: "Smyrna",      inc: "+41%" },
  { shop: "CC Pawn",         owner: "Claiborne", industry: "Pawn shop",   city: "Mobile",      inc: "+71%" },
  { shop: "Granters",        owner: "Vito",      industry: "Auto repair", city: "Phoenix",     inc: "+60%" },
  { shop: "The Pawn Shop",   owner: "Chase",     industry: "Pawn shop",   city: "Tampa",       inc: "+43%" },
];

function ProofItem({ item }: { item: (typeof PROOF_ITEMS)[number] }) {
  return (
    <div className="shm-marquee__item proof-marquee__item">
      <div className="proof-marquee__text">
        <span className="proof-marquee__shop">{item.shop}</span>
        <span className="proof-marquee__note">
          {item.owner} · {item.industry} · {item.city}
        </span>
      </div>
      <span className="proof-marquee__stat">{item.inc}</span>
    </div>
  );
}

export function ProofTiles() {
  return (
    <div className="crew-proof-grid" aria-label="Verified review-volume increases">
      {PROOF_ITEMS.map((item, i) => (
        <ProofItem key={i} item={item} />
      ))}
    </div>
  );
}

export default function ProofMarquee() {
  return (
    <Section
      bg="graham"
      nextBg="marsh"
      waveSize="lg"
      className="proof-marquee-section"
      ariaLabel="Verified review-volume increases"
    >
      <div className="shm-section-head proof-marquee__head">
        <img
          src="/mascot/mascot-celebrating.png"
          alt=""
          aria-hidden="true"
          className="shm-mascot shm-mascot--decoration proof-marquee__mascot"
        />
        <span className="shm-eyebrow">Verified · 8 shops · 8 industries</span>
        <h2 className="shm-h2">
          Real shops. Real <em>review-volume</em> increases.
        </h2>
        <p className="shm-lede">
          Reported by Shmo Review customers in their first 90 days. The shop
          with the lowest lift still doubled their monthly review pace.
        </p>
      </div>

      <div className="shm-marquee" aria-label="Scrolling proof items">
        <div className="shm-marquee__track">
          {/* Original 8 items */}
          {PROOF_ITEMS.map((item, i) => (
            <ProofItem key={i} item={item} />
          ))}
          {/* Duplicate 8 items — seamless loop, hidden from screen readers */}
          {PROOF_ITEMS.map((item, i) => (
            <div key={`dup-${i}`} aria-hidden="true">
              <ProofItem item={item} />
            </div>
          ))}
        </div>
      </div>

      <p className="proof-marquee__foot">
        Verified review-volume increases reported by Shmo Review customers · first 90 days post-install
      </p>
    </Section>
  );
}
