// components/shmo-review/data.ts
// Marketing copy for the /shmo-review category page.
// Sourced from the Claude Design output at
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/review-data.jsx
// + reconciled against context/general/marketing.md.
//
// HARD RULE — brand separation: this page sources success-story data from
// a partner agency. The agency name must NEVER appear anywhere on the
// Shmocard site (HTML, alt text, filenames, comments, descriptors). Shop
// names are real businesses (public Google data); industry descriptors
// have been generalized to keep the proof block reading as "local shops
// across categories" rather than a single-niche case study.
//
// NO Shopify product data here — prices, SKUs, variants, and product
// images live in Shopify and are fetched at request time on FormatPicker
// (Wave 3), BuyboxSection (Wave 5), and the PDP routes.

// ───────────── FORMAT PICKER (Wave 3) ─────────────
// Presentation data only — name/kicker/blurb/badge/tone. Prices, images,
// and inventory come from Shopify at request time (shopifyHandle field
// maps each slug to its real Shopify product handle).
// Copy sourced verbatim from context/general/product.md (verified marketing).
// Tones are valid surface-color variants; badge wording mirrors the Claude
// Design intent.

export type ReviewFormatSlug = "cr-80" | "l-sign" | "square-card";
export type ReviewFormatTone = "ember" | "honey" | "graham";

export type ReviewFormat = {
  slug: ReviewFormatSlug;
  shopifyHandle: string;
  name: string;
  badge: string;
  tone: ReviewFormatTone;
  kicker: string;
  blurb: string;
  href: string;
};

export const REVIEW_FORMATS: ReviewFormat[] = [
  {
    slug: "cr-80",
    shopifyHandle: "google-reviews-nfc-tap-card-cr80",
    name: "CR-80 Card",
    badge: "Best seller",
    tone: "ember",
    kicker: "Credit-card size · PVC",
    blurb:
      "The classic. Slips in a wallet, clips to a lanyard, lives in a back pocket. One per employee, hand-overs after every transaction.",
    href: "#buybox",
  },
  {
    slug: "l-sign",
    shopifyHandle: "google-review-nfc-tap-card-l-sign",
    name: "L-Sign",
    badge: "Counter standee",
    tone: "honey",
    kicker: "Tabletop stand · 4×6 acrylic",
    blurb:
      "Lives next to the register. Guests tap on their way out — no staff prompt needed. Cafés, salons, retail counters where customers self-serve.",
    href: "#buybox",
  },
  {
    slug: "square-card",
    shopifyHandle: "google-review-plaque",
    name: "Square Card",
    badge: "Sticks anywhere",
    tone: "graham",
    kicker: "Disc · 2.25 inch · adhesive-backed",
    blurb:
      "Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans, anywhere a counter doesn't exist.",
    href: "#buybox",
  },
];

export type ReviewBullet = {
  stat: string;
  statLabel: string;
  title: string;
  body: string;
};

export const REVIEW_BULLETS: ReviewBullet[] = [
  {
    stat: "0",
    statLabel: "apps to download",
    title: "One tap, browser opens",
    body: "Customer holds their phone to the card. Google review page loads. No login, no QR, no friction.",
  },
  {
    stat: "3s",
    statLabel: "from tap to review",
    title: "Pre-programmed for you",
    body: "Send your Google link at checkout — we burn it in before shipping. Out of the box, ready to hand over.",
  },
  {
    stat: "100%",
    statLabel: "of crew, every shift",
    title: "Built for the handoff",
    body: "One card per employee, on every counter. The ask happens when the customer is happiest — at the close.",
  },
  {
    stat: "60d",
    statLabel: "no-questions return",
    title: "Reprogram for life",
    body: "Change your mind, change your link, change your business. Reprogram free, forever. Refund inside 60 days.",
  },
];

// Sticky scroll-driven "how it works" — 4 phone screens (Wave 4).
export type ReviewHowStep = {
  n: string;
  title: string;
  body: string;
  screen: "handoff" | "tap" | "review" | "submitted";
};

export const REVIEW_HOW_STEPS: ReviewHowStep[] = [
  {
    n: "01",
    title: "Crew hands the card",
    body: "After every transaction, an employee hands the customer the card. The ask happens at the right moment — when the customer is happy.",
    screen: "handoff",
  },
  {
    n: "02",
    title: "Customer taps the back of their phone",
    body: "iPhone XS+ and Android 5+ have NFC built in. The card sends a signed URL straight to their browser — no app, no login.",
    screen: "tap",
  },
  {
    n: "03",
    title: "Your Google review page opens",
    body: "Their browser jumps straight to your review form. They see your shop name, your photos, your star rating.",
    screen: "review",
  },
  {
    n: "04",
    title: "Five stars, one sentence",
    body: "They tap five and type. The whole thing takes seconds. You get a verified Google review by the next time you check.",
    screen: "submitted",
  },
];

// Standout owner-quotes (3 hero stories). Verified against marketing.md.
// `tone` maps to a card variant: ember / cocoa / honey.
export type ReviewStandout = {
  big: string;
  metric: string;
  quote: string;
  person: string;
  shop: string;
  tone: "ember" | "cocoa" | "honey";
};

export const REVIEW_STANDOUT: ReviewStandout[] = [
  {
    big: "80+",
    metric: "reviews in 6 weeks",
    quote:
      "Allan was the highest-rated guy on the crew before. Now he's the highest-rated on Google, too.",
    person: "Allan",
    shop: "Granters · Phoenix",
    tone: "ember",
  },
  {
    big: "14",
    metric: "in week one",
    quote:
      "Marshall's already gotten five today and we've been open for an hour and a half.",
    person: "Carly",
    shop: "Axel's · Minneapolis",
    tone: "cocoa",
  },
  {
    big: "5",
    metric: "in 90 minutes",
    quote: "He got five Google reviews in less than two hours of being open.",
    person: "Marshall",
    shop: "Axel's · Minneapolis",
    tone: "honey",
  },
];

// Numbers wall — 8 verified shop % increases. Industry descriptors stripped
// per brand-separation rule; only shop name + owner first name + city kept.
// Verified against marketing.md PROOF_RESULTS for entries 1–6.
// TODO(jordan): confirm entries 7–8 ("The Pawn Shop", "Smyrna") before launch.
export type ReviewNumberRow = {
  shop: string;
  owner: string;
  inc: string;
  note: string;
};

export const REVIEW_NUMBERS: ReviewNumberRow[] = [
  { shop: "Garden City", owner: "Thomas", inc: "+86%", note: "Atlanta" },
  { shop: "Buffalo Jewelry & Loan", owner: "Joey", inc: "+81%", note: "Buffalo" },
  { shop: "Axel's", owner: "Carly", inc: "+71%", note: "Minneapolis" },
  { shop: "CC", owner: "Claiborne", inc: "+71%", note: "Mobile" },
  { shop: "Granters", owner: "Vito", inc: "+60%", note: "Phoenix" },
  { shop: "Cashco", owner: "Morris", inc: "+47%", note: "Houston" },
  { shop: "Main Street Shop", owner: "Chase", inc: "+43%", note: "Tampa" },
  { shop: "Smyrna Detail", owner: "Jason", inc: "+41%", note: "Smyrna" },
];

export type ReviewObjection = { q: string; a: string };

export const REVIEW_OBJECTIONS: ReviewObjection[] = [
  {
    q: "But we already ask for reviews.",
    a: "And how often does it actually happen? The ask gets skipped because asking is awkward. Handing over a card isn't. Crews who hated asking love handing.",
  },
  {
    q: "Won't customers ignore a card?",
    a: "Not when they see the crew member who just helped them holding it. The hand-over is the social pressure. The card is just the vessel.",
  },
  {
    q: "What if my crew forgets to hand it over?",
    a: "That's the point — you stop relying on memory. Make it part of the receipt routine. After 2 weeks it's automatic.",
  },
  {
    q: "Can my competitors just buy these too?",
    a: "Sure. But you're reading this first. Reviews compound: the shop with 200 five-star reviews wins searches against the one with 40, every time.",
  },
];

// Ship & returns strip — 4 items. Icon names map to inline SVGs in the
// ShipReturns component (Wave 2B); no external icon dependency.
export type ReviewShipItem = {
  icon: "truck" | "return" | "refresh" | "shield";
  title: string;
  sub: string;
};

export const REVIEW_SHIP_RETURNS: ReviewShipItem[] = [
  {
    icon: "truck",
    title: "Ships in 3 days",
    sub: "Order by Tuesday · ships Friday",
  },
  {
    icon: "return",
    title: "60-day returns",
    sub: "Box it back, refund in full",
  },
  {
    icon: "refresh",
    title: "Reprogrammable for life",
    sub: "Change destination anytime",
  },
  {
    icon: "shield",
    title: "Free bulk shipping",
    sub: "10+ cards ship free expedited",
  },
];

export type ReviewFaqItem = { q: string; a: string };

export const REVIEW_FAQ: ReviewFaqItem[] = [
  {
    q: "How does the card work?",
    a: "Every Shmo Review card has an NFC chip programmed with your Google review URL. When a customer taps the back of their phone to the card, their browser opens that URL directly — no app, no login, no QR-code gymnastics. iPhone XS and newer (2018+) and Android 5+ have NFC built in.",
  },
  {
    q: "Do I have to set anything up?",
    a: "No. Send us your Google review link at checkout and we program every card before it ships. If you change your business name or move locations later, you can reprogram from the dashboard at no extra cost.",
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days. Bulk orders (10+) ship free expedited.",
  },
  {
    q: "What if a customer's phone can't tap?",
    a: "Every card has a QR code on the back as a fallback. Same destination, same flow — just a scan instead of a tap. Covers any phone that can't NFC.",
  },
  {
    q: "Is the card branded with my shop?",
    a: "Yes. Every order is custom-printed with your logo, name, and color treatment. Send us your assets at checkout and we'll mock it up before printing.",
  },
  {
    q: "What's the return policy?",
    a: "60-day no-questions returns. If your crew hates it, box it back up and we refund the full amount. We also reprogram for life — change your destination URL whenever you want.",
  },
];
