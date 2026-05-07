// components/pdp/pdp-copy.ts
//
// Marketing copy for the PDP. Lives in code per shopify-data-discipline:
// - Product title / price / images / variants come from Shopify (never here)
// - Programming-process steps, returns guarantee, slug-specific value props,
//   and PDP-level FAQ are MARKETING COPY (Shopify never owns these strings)
//
// Source of truth for voice + locked phrases: context/general/marketing.md
// Source of truth for specs: context/general/product.md
//
// Slug keys:
//   'cr-80'        -> CR-80 wallet card
//   'l-sign'       -> Counter standee
//   'square-card'  -> Adhesive disc
//
// Shared by 03-05 (CR-80), 03-06 (L-Sign), 03-07 (Square Card). Edits to
// per-slug copy land here; component tree never duplicates.
//
// Shopify product handles (programmatic — exposed for tests / docs):
//   cr-80       => google-reviews-nfc-tap-card-cr80
//   l-sign      => google-review-nfc-tap-card-l-sign
//   square-card => google-review-plaque

export type PdpSlug = "cr-80" | "l-sign" | "square-card";

export type PdpFaqItem = { q: string; a: string };
export type PdpProgrammingStep = { n: number; title: string; body: string };

// Sub-headline shown directly under the H1. Italic emphasis lives in the
// component (PdpHeading wraps in <em>).
export function subline(slug: PdpSlug): string {
  switch (slug) {
    case "cr-80":
      return "The wallet card your crew hands over after every transaction.";
    case "l-sign":
      return "The countertop tap that turns happy customers into five-star reviews.";
    case "square-card":
      return "The disc that sticks anywhere — door, window, dashboard, service van.";
  }
}

// Slug-specific value-prop bullets. Render as .shm-checklist--featured.
// Each list ends with the same 60-day guarantee for consistency.
export function bullets(slug: PdpSlug): string[] {
  const common = [
    "Pre-programmed to your Google review link before shipping",
    "Works on every modern phone — no app, no download",
    "60-day reprogramming + return guarantee",
  ];
  switch (slug) {
    case "cr-80":
      return [
        "Wallet-size PVC card — slips in a back pocket or clips to a lanyard",
        "Built for one-per-employee crews — the bulk math the whole product is priced around",
        ...common,
      ];
    case "l-sign":
      return [
        "Acrylic 4×6 tabletop standee — lives next to the register",
        "Customers tap on their way out without anyone prompting them",
        ...common,
      ];
    case "square-card":
      return [
        "2.25-inch adhesive disc — sticks to a door, window, dashboard, or service van",
        "Built for mobile crews and shops that don't have a counter to put a sign on",
        ...common,
      ];
  }
}

// Programming process — same 5 steps for every format. Plain copy from
// product.md "How it works (full process)".
export const programmingSteps: PdpProgrammingStep[] = [
  {
    n: 1,
    title: "You order — one per employee",
    body: "Pick a pack size. Bulk math: one card per crew member, not one per shop.",
  },
  {
    n: 2,
    title: "We program every card with your Google review link",
    body: "Share the link at checkout (or send it after). We program every card before it ships.",
  },
  {
    n: 3,
    title: "Cards arrive ready to use",
    body: "Standard shipping: 3 days. Bulk orders (10+) ship free, expedited.",
  },
  {
    n: 4,
    title: "Your crew hands them out after every transaction",
    body: "Customer taps the card with their phone. Their Google review page opens instantly.",
  },
  {
    n: 5,
    title: "Reprogrammable for life — free",
    body: "Move locations, rebrand, swap the destination URL — update from the dashboard, no reorder.",
  },
];

// PDP FAQ. Shared base + slug-specific extension. Pulled from
// marketing.md FAQ table; lightly edited for PDP context.
const baseFaq: PdpFaqItem[] = [
  {
    q: "How does it work?",
    a: "An NFC card, sign, or disc. The customer taps it with their phone and your Google review page opens directly. No app, no login, no QR-code gymnastics. A QR code on the back covers any phone that can't tap.",
  },
  {
    q: "Does it work with every phone?",
    a: "iPhone XS and newer (2018+) and Android 5.0 and newer have NFC built in — customers tap and the review page opens. The QR on the back is the fallback for anything older.",
  },
  {
    q: "Can I change where the card sends people?",
    a: "Yes — every card is reprogrammable for life. Update the destination URL from the dashboard whenever you want. Free, forever.",
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days; bulk orders (10+) ship free, expedited.",
  },
  {
    q: "How do I get my Google review link?",
    a: "Search your business in Google Maps, click \"Ask for reviews,\" and copy the short link. Paste it at checkout — every card ships pre-programmed.",
  },
  {
    q: "What if my crew hates it?",
    a: "30-day no-questions returns. Box it back up and we'll refund the full amount.",
  },
];

const slugFaq: Record<PdpSlug, PdpFaqItem[]> = {
  "cr-80": [
    {
      q: "Why one card per employee?",
      a: "A card behind the counter captures roughly 2 reviews a week. One per employee captures roughly 15. The card has to live with the person handing the customer their coffee, keys, or receipt.",
    },
    {
      q: "Is the card printed with my logo?",
      a: "Yes. Every order is custom-printed with the shop's brand — logo, name, color treatment.",
    },
  ],
  "l-sign": [
    {
      q: "Where does the L-Sign live?",
      a: "Right next to the register or on the counter. Customers tap on their way out. No staff prompt needed — the sign does the asking.",
    },
    {
      q: "Can I add my logo to the L-Sign?",
      a: "Yes. The face of the standee is custom-printed with your shop's branding — logo, name, color treatment.",
    },
  ],
  "square-card": [
    {
      q: "What surfaces does the disc stick to?",
      a: "Glass, painted metal, plastic, laminated wood. Doors, windows, dashboards, service-van panels. The adhesive is residue-free when removed cleanly.",
    },
    {
      q: "Why pick the disc over a CR-80 card or L-Sign?",
      a: "Pick the disc when there's no counter to put a sign on. Mobile crews, service vans, shops where customers walk past on the way in or out — the disc lives where they look.",
    },
  ],
};

export function pdpFaqFor(slug: PdpSlug): PdpFaqItem[] {
  return [...baseFaq, ...slugFaq[slug]];
}

// Type guard for the URL slug param. Used in the dynamic route to gate
// the HANDLE_MAP lookup before any Shopify call.
export function isPdpSlug(s: string): s is PdpSlug {
  return s === "cr-80" || s === "l-sign" || s === "square-card";
}
