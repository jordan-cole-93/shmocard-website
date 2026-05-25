// app/offer/free-card/page.tsx — Free + shipping funnel landing page.
//
// Hidden landing for paid-ad traffic. NOT linked from anywhere on the main
// site, robots noindex, excluded from sitemap. See:
//   .planning/sidequests/free-shipping-funnel/SPEC.md
//
// Kill switch: NEXT_PUBLIC_OFFER_ENABLED=false → page 404s.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Shmo Review Card — Special Offer",
  description:
    "Get a free Shmo Review NFC card. You only pay $7 shipping. Limited time.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function OfferFreeCardPage() {
  // Env-var kill switch: setting NEXT_PUBLIC_OFFER_ENABLED to the literal
  // string "false" 404s the route without a code deploy.
  if (process.env.NEXT_PUBLIC_OFFER_ENABLED === "false") {
    notFound();
  }

  return (
    <main>
      <h1>Free + Shipping Offer — placeholder</h1>
      <p>Real page lands in Task 5.</p>
    </main>
  );
}
