// components/shmo-review/index.ts
// Barrel export for /shmo-review section components.
// Populated wave-by-wave as components land.

export * from "./data";

// Wave 2A — static content sections
export { default as Hero } from "./Hero";
export { default as BulletStrip } from "./BulletStrip";
export { default as Objections } from "./Objections";

// Wave 2B — static content sections (more)
export { default as StandoutMoments } from "./StandoutMoments";
export { default as NumbersWall } from "./NumbersWall";
export { default as ShipReturns } from "./ShipReturns";

// Wave 2C — FAQ + closing CTA
export { default as ReviewFaq } from "./ReviewFaq";
export { default as FinalCta } from "./FinalCta";

// Wave 3 — Shopify-fed
export { default as FormatPicker } from "./FormatPicker";

// Wave 4 — Client-side scroll-driven
export { default as HowItWorksSticky } from "./HowItWorksSticky";

// Wave 5 — Shopify-fed, cart-wired
export { default as BuyboxSection } from "./BuyboxSection";
