// components/category/category-data.ts
// Static content for the /shmo-review category page.
// Sourced from context/general/marketing.md + context/general/product.md.
// NO Shopify product data here — prices/SKUs/inventory live in Shopify and
// are fetched on the PDPs (03-05/06/07). This file is marketing copy only.

export type FormatSlug = "cr-80" | "l-sign" | "square-card";

export type CategoryFormat = {
  slug: FormatSlug;
  shopifyHandle: string;
  name: string;
  tag: string;
  kicker: string;
  oneLiner: string;
  bestFor: string;
  image: string;
  imageAlt: string;
  href: string;
};

// Three formats — sourced verbatim from product.md.
// Image paths are transparent product cuts that landed in /public during 3-Foundations.
export const FORMATS: CategoryFormat[] = [
  {
    slug: "cr-80",
    shopifyHandle: "google-reviews-nfc-tap-card-cr80",
    name: "CR-80 Card",
    tag: "Best seller",
    kicker: "Credit-card size · PVC",
    oneLiner:
      "The classic. Slips in a wallet, clips to a lanyard, lives in a back pocket.",
    bestFor: "One per employee. The product that makes the bulk math work.",
    image: "/products/cr80/transparent/magnific_2884306972.png",
    imageAlt: "Shmo Review CR-80 wallet-size NFC card",
    href: "/shmo-review/cr-80",
  },
  {
    slug: "l-sign",
    shopifyHandle: "google-review-nfc-tap-card-l-sign",
    name: "L-Sign",
    tag: "For the counter",
    kicker: "Tabletop stand · 4×6",
    oneLiner:
      "Lives next to the register. Guests tap on their way out — no staff prompt needed.",
    bestFor: "Cafés, salons, retail counters where customers self-serve at the end.",
    image: "/products/l-sign/transparent/magnific_2884477047.png",
    imageAlt: "Shmo Review L-Sign acrylic counter standee",
    href: "/shmo-review/l-sign",
  },
  {
    slug: "square-card",
    shopifyHandle: "google-review-plaque",
    name: "Square Card",
    tag: "Window cling",
    kicker: "Disc · 2.25 inch",
    oneLiner:
      "Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.",
    bestFor: "Mobile crews, service vans, roofers, anywhere a counter doesn't exist.",
    image: "/products/plate/transparent/magnific_2885042834.png",
    imageAlt: "Shmo Review Square Card adhesive disc",
    href: "/shmo-review/square-card",
  },
];

// Bulk-math tiers — illustrative only.
// Multiplier comes from marketing.md: behind the counter ~2/wk, in every
// employee's pocket ~15/wk. We extrapolate per crew size at the same
// 15/wk per-employee rate, then convert to "per month" using 4 weeks.
// We DO NOT show prices here — pricing lives on the PDPs in Shopify.
export type BulkMathTier = {
  crew: number;
  cards: number;
  tapsPerShift: string;
  reviewsPerMonth: string;
  note: string;
};

export const BULK_MATH_TIERS: BulkMathTier[] = [
  {
    crew: 1,
    cards: 1,
    tapsPerShift: "~2 a week",
    reviewsPerMonth: "~8 / month",
    note: "One card behind the counter. The single-unit baseline.",
  },
  {
    crew: 3,
    cards: 3,
    tapsPerShift: "~6 a shift",
    reviewsPerMonth: "~45 / month",
    note: "Small crew. Every transaction has a card in the right hand.",
  },
  {
    crew: 5,
    cards: 5,
    tapsPerShift: "~10 a shift",
    reviewsPerMonth: "~75 / month",
    note: "Mid-size shop. The math compounds fast.",
  },
  {
    crew: 10,
    cards: 10,
    tapsPerShift: "~20 a shift",
    reviewsPerMonth: "~150 / month",
    note: "Full crew. Bulk pricing kicks in. Free expedited shipping.",
  },
];

// Category FAQ — drafted from marketing.md FAQ + product.md.
// Six questions cover the six required areas:
//   1. what is this        -> what
//   2. why one per employee -> why-bulk
//   3. how does it work    -> how
//   4. what does it cost   -> cost
//   5. what do other shops say -> proof
//   6. what format do I need -> format
// Two extra entries (phones, returns) round out the 8.
export type CategoryFaqItem = {
  id: string;
  q: string;
  a: string;
};

export const CATEGORY_FAQ: CategoryFaqItem[] = [
  {
    id: "what",
    q: "What is Shmo Review?",
    a: "An NFC card, sign or disc that, when tapped by a customer's phone, opens your Google review page directly. No app, no login, no QR-code gymnastics.",
  },
  {
    id: "why-bulk",
    q: "Why one card per crew member?",
    a: "A card behind the counter captures roughly 2 reviews a week. One per employee captures roughly 15. The card has to live with the person handing the customer their coffee, keys, or receipt — not on the counter.",
  },
  {
    id: "how",
    q: "How does it work?",
    a: "You order — one card per employee — and send us your Google review link. We program every card with that link before it ships. Your employee hands the card to the customer after the transaction. Customer taps. Their Google review page opens. They tap five stars and type a sentence. A QR code on the back covers any phone that can't tap.",
  },
  {
    id: "cost",
    q: "What does it cost?",
    a: "Pricing depends on format and crew size. Bulk orders of 10 or more ship free expedited. See current pricing on the CR-80, L-Sign, and Square Card product pages.",
  },
  {
    id: "proof",
    q: "What do other shops say?",
    a: "Verified review-volume increases from real shops range from +41% to +86%. Allan Macias logged 80+ five-star reviews in a single week. Carly at Axel's Pawn pulled 14 in the first week — and Marshall at the same shop got 5 in less than two hours of being open.",
  },
  {
    id: "format",
    q: "What format do I need?",
    a: "The CR-80 is the bulk-math workhorse — wallet-size, one per employee, lives in a back pocket. The L-Sign sits on the counter for self-serve businesses like cafés. The Square Card sticks to any flat surface — perfect for mobile crews and service vans. Most crews start with CR-80 cards and add an L-Sign or Square Card for the storefront.",
  },
  {
    id: "phone",
    q: "Does it work with every phone?",
    a: "iPhone XS and newer (2018+) and Android 5.0 and newer have NFC built in — customers tap and the review page opens. A QR code on the back covers any phone that can't.",
  },
  {
    id: "returns",
    q: "What if my crew hates it?",
    a: "30-day no-questions returns. Box it back up and we'll refund the full amount.",
  },
];

// 5-step compressed how-it-works (distinct from the homepage's 6-step
// HOW IT WORKS — that one is locked at 6 steps; this one is the
// compressed pitch for the category page).
export type HowStep = { n: number; title: string; body: string };

export const HOW_IT_WORKS_SHORT: HowStep[] = [
  {
    n: 1,
    title: "You order one per employee",
    body: "Pick a format. Tell us how many. Send your Google review link.",
  },
  {
    n: 2,
    title: "We program every card",
    body: "Each card ships pre-programmed to your review link. Reprogrammable for life.",
  },
  {
    n: 3,
    title: "Crew hands it over",
    body: "After every transaction, an employee hands a card to the customer.",
  },
  {
    n: 4,
    title: "Customer taps",
    body: "Phone unlocks the review page instantly. No app. No login.",
  },
  {
    n: 5,
    title: "Five stars, one sentence",
    body: "They tap five stars, type a sentence, post. QR fallback for older phones.",
  },
];

// Proof block — real client results from marketing.md.
// HARD RULE: shop names + metrics only. Never the words "Pawn Leads" or "PawnLeads".
export type ProofRow = { owner: string; shop: string; increase: string };

export const PROOF_RESULTS: ProofRow[] = [
  { owner: "Thomas", shop: "Garden City", increase: "+86%" },
  { owner: "Joey", shop: "Buffalo Jewelry & Loan", increase: "+81%" },
  { owner: "Carly", shop: "Axel's Pawn", increase: "+71%" },
  { owner: "Claiborne", shop: "CC Pawn", increase: "+71%" },
  { owner: "Vito", shop: "Granters", increase: "+60%" },
  { owner: "Morris", shop: "Cashco", increase: "+47%" },
];

export type ProofQuote = { quote: string; attribution: string };

export const PROOF_QUOTES: ProofQuote[] = [
  {
    quote:
      "We've gotten 5 Google Reviews just today now that our NFC cards are up and running. It makes it so much easier to get customers to follow through.",
    attribution: "Carli Karlson, Axel's Pawn",
  },
  {
    quote: "Cards are working. 80+ five-star reviews in a week.",
    attribution: "Allan Macias, pawn shop owner",
  },
];
