// home-data.ts — content for the homepage. Pulled from marketing.md / product.md.
//
// HARD RULE: never write the services-agency brand name ("P-L") anywhere
// on the Shmocard public site. Brand separation between Shmocard (product)
// and the services agency. Use shop names directly, no agency attribution.

import type { MascotPose } from "../mascot-poses";

export type SubBrand = {
  slug: "review" | "biz" | "link" | "reputation";
  number: "01" | "02" | "03" | "04";
  status: "live" | "soon";
  eyebrow: string;
  name: string;
  badge: string;
  badgeStatus: "clover" | "honey";
  headlineLead: string;
  headlineEm: string;
  headlineTrail: string;
  lede: string;
  bullets: string[];
  ctaPrimary: { label: string; href?: string; modal?: "waitlist" };
  ctaSecondary?: { label: string; href: string };
  aside: string;
  bg: "marsh" | "graham" | "cocoa";
  art: { kind: "photo"; src: string; chip?: { label: string; pill: string } } | { kind: "mascot"; pose: MascotPose; fitRatio?: number };
  reverse?: boolean;
  formats?: { title: string; sub: string }[];
};

export const SUB_BRANDS: SubBrand[] = [
  {
    slug: "review",
    number: "01",
    status: "live",
    eyebrow: "Shmo Review",
    name: "Review",
    badge: "Available now",
    badgeStatus: "clover",
    headlineLead: "One tap. One five-star ",
    headlineEm: "review",
    headlineTrail: ".",
    lede:
      "An NFC card, sign or disc that, when tapped by a customer's phone, opens your Google review page directly. No app, no login, no QR-code gymnastics.",
    bullets: [
      "Pre-programmed to your Google review link before it ships.",
      "Reprogrammable for life — change the destination from your dashboard.",
      "Three formats: wallet-size CR-80, counter L-Sign, square disc.",
    ],
    ctaPrimary: { label: "Shop the cards", href: "/shmo-review" },
    ctaSecondary: { label: "See how it works", href: "#how" },
    aside: "Live now · ships within the week",
    bg: "marsh",
    art: {
      kind: "photo",
      src: "/products/cr80/transparent/magnific_2884306972.png",
      chip: { label: "Wallet-size · PVC", pill: "CR-80" },
    },
    formats: [
      { title: "CR-80 Card", sub: "Best seller · wallet-size · PVC" },
      { title: "L-Sign", sub: "Counter standee · 4×6 acrylic" },
      { title: "Square Card", sub: 'Disc · 2.25" · sticks anywhere' },
    ],
  },
  {
    slug: "biz",
    number: "02",
    status: "soon",
    eyebrow: "Shmo Biz",
    name: "Biz",
    badge: "Coming soon",
    badgeStatus: "honey",
    headlineLead: "Your business card. ",
    headlineEm: "Always",
    headlineTrail: " up to date.",
    lede:
      "An NFC business card that taps into a contact profile you can edit any time. Change your number, role or socials — every card you've ever handed out updates automatically.",
    bullets: [
      "Physical NFC card and shareable digital link in one.",
      "Edit your contact profile from a dashboard. Never reprint.",
      "Custom-printed with your shop's branding.",
    ],
    ctaPrimary: { label: "Notify me when it's live", modal: "waitlist" },
    aside: "Pre-launch · email signup",
    bg: "graham",
    art: { kind: "mascot", pose: "holding-card" },
    reverse: true,
  },
  {
    slug: "link",
    number: "03",
    status: "soon",
    eyebrow: "Shmo Link",
    name: "Link",
    badge: "Coming soon",
    badgeStatus: "honey",
    headlineLead: "One link. ",
    headlineEm: "All",
    headlineTrail: " the things you do.",
    lede:
      "A branded link-in-bio for local shops. Booking, menu, location, hiring, current promotion — every important link a customer might need, on one tap-friendly page.",
    bullets: [
      "Hosts every link your shop needs in one branded page.",
      "Tap or scan to open. Drop the link anywhere.",
      "Reorder, swap and update from your dashboard.",
    ],
    ctaPrimary: { label: "Notify me when it's live", modal: "waitlist" },
    aside: "Pre-launch · email signup",
    bg: "marsh",
    art: { kind: "mascot", pose: "heart-hands" },
  },
  {
    slug: "reputation",
    number: "04",
    status: "soon",
    eyebrow: "Shmo Reputation",
    name: "Reputation",
    badge: "Coming soon",
    badgeStatus: "honey",
    headlineLead: "Every review, ",
    headlineEm: "answered",
    headlineTrail: ".",
    lede:
      "Auto-respond to every Google review — positive and negative — in your shop's voice. Replying is a known ranking factor and a trust signal. Stop letting reviews sit.",
    bullets: [
      "AI replies in your voice, on every review.",
      "Approval mode for shops that want a final say.",
      "Subscription pricing. Billed monthly. Cancel any time.",
    ],
    ctaPrimary: { label: "Notify me when it's live", modal: "waitlist" },
    aside: "Pre-launch · email signup",
    bg: "cocoa",
    art: { kind: "mascot", pose: "megaphone", fitRatio: 1.3 },
    reverse: true,
  },
];

// 10 audiences in source order — locked per CONTEXT.md B2.
export const AUDIENCES: string[] = [
  "Barbers",
  "Pawn shops",
  "Auto shops",
  "Jewelers",
  "Roofers",
  "Salons",
  "Cafés",
  "Restaurants",
  "Mobile crews",
  "Independent retailers",
];

// Real shop data — verified review-volume increases per marketing.md.
// HARD RULE: shop names + owner first names + metric only. No agency attribution.
export type Shop = { name: string; owner: string; inc: string };

export const SHOPS: Shop[] = [
  { name: "The Pawn Shop", owner: "Chase", inc: "+43%" },
  { name: "Granters", owner: "Vito", inc: "+60%" },
  { name: "Axel's Pawn", owner: "Carly", inc: "+71%" },
  { name: "Buffalo Jewelry & Loan", owner: "Joey", inc: "+81%" },
  { name: "Smyrna", owner: "Jason", inc: "+41%" },
  { name: "CC Pawn", owner: "Claiborne", inc: "+71%" },
  { name: "Garden City", owner: "Thomas", inc: "+86%" },
  { name: "Cashco", owner: "Morris", inc: "+47%" },
];

export type Quote = { body: string; author: string; shop: string; initials: string };

export const QUOTES: Quote[] = [
  {
    body:
      "We've gotten 5 Google Reviews just today now that our NFC cards are up and running. It makes it so much easier to get customers to follow through.",
    author: "Carli Karlson",
    shop: "Axel's Pawn",
    initials: "CK",
  },
  {
    body:
      "My ShmoCards are the best. They have boosted our Google reviews by giving my team the ability to ask for a review just at the right time during a transaction.",
    author: "Pawnbrokers Helping Pawnbrokers",
    shop: "Industry group",
    initials: "PH",
  },
];

// 6 steps — locked per CONTEXT.md B4.
export type HowStep = { n: string; title: string; body: string };

export const HOW_STEPS: HowStep[] = [
  {
    n: "01",
    title: "You order",
    body: "One card per crew member. Send us your Google review link at checkout.",
  },
  {
    n: "02",
    title: "We program",
    body: "Every card ships pre-loaded with your link. Custom-printed with your shop's branding.",
  },
  {
    n: "03",
    title: "Crew hands it over",
    body: "After every transaction, an employee hands the card to the customer.",
  },
  {
    n: "04",
    title: "Customer taps",
    body: "The phone reads the card. Their browser opens your Google review page instantly.",
  },
  {
    n: "05",
    title: "Five stars, one sentence",
    body: "They tap five and type. The whole thing takes seconds — no app, no login.",
  },
  {
    n: "06",
    title: "QR fallback",
    body: "A QR code on the back covers any phone that can't tap. Same destination, same flow.",
  },
];

export type FaqEntry = { q: string; a: string };

// Drafted from marketing.md FAQ + product.md. Jordan reviews at sign-off (CONTEXT.md B5).
export const FAQ: FaqEntry[] = [
  {
    q: "What is ShmoCard?",
    a: "ShmoCard is a family of NFC tools built for local shop crews — review cards, business cards, link hubs, and an AI review responder. One brand, one dashboard, one-time card purchase.",
  },
  {
    q: "Does it work with every phone?",
    a: "iPhone XS and newer (2018+) and Android 5.0 and newer have NFC built in — customers tap and the page opens. A QR code on the back covers any phone that can't.",
  },
  {
    q: "Can I change where the card sends people?",
    a: "Yes — every card is reprogrammable for life. Update the destination URL from the dashboard whenever you want.",
  },
  {
    q: "Why one card per crew member?",
    a: "A card behind the counter captures roughly 2 reviews a week. One per employee captures roughly 15. The card has to live with the person handing the customer their coffee, keys, or receipt — not on the counter.",
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days; bulk orders of 10 or more ship free expedited.",
  },
  {
    q: "Is the card printed with our brand?",
    a: "Yes — every order is custom-printed with your shop's logo, name, and color treatment. Send us your assets at checkout.",
  },
  {
    q: "What if my crew hates it?",
    a: "30-day no-questions returns. Box it back up and we'll refund the full amount.",
  },
];

// Video testimonial tiles. Crew photos / video URLs pending — placeholder treatment until assets land.
// `videoUrl` and `posterUrl` are optional: VideoLightbox renders a "coming soon"
// placeholder inside the lightbox shell when videoUrl is absent.
export type VideoTile = {
  bgVariant: "ember" | "cocoa" | "honey";
  duration: string;
  quote: string;
  person: string;
  role: string;
  shop: string;
  pending?: boolean;
  videoUrl?: string;
  posterUrl?: string;
};

export const VIDEO_TILES: VideoTile[] = [
  {
    bgVariant: "ember",
    duration: "1:42",
    quote:
      "Got 14 in the first week. Marshall's already gotten five today and we've been open for an hour and a half.",
    person: "Carly",
    role: "Owner",
    shop: "Axel's Pawn",
  },
  {
    bgVariant: "cocoa",
    duration: "0:58",
    quote:
      "He got five Google reviews in less than two hours of being open.",
    person: "Carly",
    role: "Owner",
    shop: "Axel's Pawn",
  },
  {
    bgVariant: "honey",
    duration: "—",
    quote: "Video coming soon — shop transcription pending.",
    person: "Joey",
    role: "Owner",
    shop: "Buffalo Jewelry & Loan",
    pending: true,
  },
];
