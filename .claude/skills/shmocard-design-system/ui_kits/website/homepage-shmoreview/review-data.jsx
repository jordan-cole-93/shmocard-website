// review-data.jsx — content for the Shmo Review category page.

const REVIEW_BULLETS = [
  { stat: "0", statLabel: "apps to download", title: "One tap, browser opens", body: "Customer holds their phone to the card. Google review page loads. No login, no QR, no friction." },
  { stat: "3s", statLabel: "from tap to review", title: "Pre-programmed for you", body: "Send your Google link at checkout — we burn it in before shipping. Out of the box, ready to hand over." },
  { stat: "100%", statLabel: "of crew, every shift", title: "Built for the handoff", body: "One card per employee, on every counter. The ask happens when the customer is happiest — at the close." },
  { stat: "60d", statLabel: "no-questions return", title: "Reprogram for life", body: "Change your mind, change your link, change your business. Reprogram free, forever. Refund inside 60 days." }
];

const REVIEW_FORMATS = [
  {
    id: "cr80",
    name: "CR-80 Card",
    sub: "Wallet-size · PVC · best seller",
    blurb: "The countertop tap that turns happy crews into five-star reviews. Hand it over after every transaction.",
    price: "$29.99",
    priceMeta: "Bulk: $22 / card",
    art: "assets/products/cr80-flat-pair.png",
    badge: "Best seller",
    tone: "ember",
    href: "#buybox"
  },
  {
    id: "lsign",
    name: "L-Sign",
    sub: "Counter standee · 4×6 acrylic",
    blurb: "A clear acrylic standee for the counter. Tap, scan, done. Stays put when the crew is busy.",
    price: "$39.99",
    priceMeta: "Bulk: $32 / sign",
    art: "assets/products/cr80-trio.png",
    badge: null,
    tone: "honey",
    href: "#"
  },
  {
    id: "square",
    name: "Square Card",
    sub: "Disc · 2.25\" · sticks anywhere",
    blurb: "An adhesive-backed disc. Sticks to laptops, tablets, registers, dashboards. Travels with the crew.",
    price: "$24.99",
    priceMeta: "Bulk: $18 / disc",
    art: "assets/products/cr80-flat-pair.png",
    badge: "New",
    tone: "graham",
    href: "#"
  }
];

const REVIEW_PACKS = [
  { qty: 1,  price: 29.99,  perCard: 29.99, save: null,    note: null,                         compare: null,   pop: false },
  { qty: 2,  price: 49.99,  perCard: 25.00, save: null,    note: null,                         compare: 59.98,  pop: false },
  { qty: 5,  price: 119.99, perCard: 24.00, save: "20%",   note: "Free shipping included",     compare: 149.95, pop: false },
  { qty: 10, price: 219.99, perCard: 22.00, save: "27%",   note: "Free shipping included",     compare: 299.90, pop: true  }
];

// Sticky scroll-driven "how it works" — 4 phone screens
const REVIEW_HOW_STEPS = [
  {
    n: "01",
    title: "Crew hands the card",
    body: "After every transaction, an employee hands the customer the card. The ask happens at the right moment — when the customer is happy.",
    screen: "handoff"
  },
  {
    n: "02",
    title: "Customer taps the back of their phone",
    body: "iPhone XS+ and Android 5+ have NFC built in. The card sends a signed URL straight to their browser — no app, no login.",
    screen: "tap"
  },
  {
    n: "03",
    title: "Your Google review page opens",
    body: "Their browser jumps straight to your review form. They see your shop name, your photos, your star rating.",
    screen: "review"
  },
  {
    n: "04",
    title: "Five stars, one sentence",
    body: "They tap five and type. The whole thing takes seconds. You get a verified Google review, by the next time you check.",
    screen: "submitted"
  }
];

// Numbers wall — 8 verified shop increases
const REVIEW_NUMBERS = [
  { shop: "Garden City",        owner: "Thomas",     inc: "+86%", note: "Roofing co · Atlanta" },
  { shop: "Buffalo Jewelry",    owner: "Joey",       inc: "+81%", note: "Pawn & loan · Buffalo" },
  { shop: "Axel's Pawn",        owner: "Carly",      inc: "+71%", note: "Pawn shop · Minneapolis" },
  { shop: "CC Pawn",            owner: "Claiborne",  inc: "+71%", note: "Pawn shop · Mobile" },
  { shop: "Granters",           owner: "Vito",       inc: "+60%", note: "Auto repair · Phoenix" },
  { shop: "Cashco",             owner: "Morris",     inc: "+47%", note: "Pawn & loan · Houston" },
  { shop: "The Pawn Shop",      owner: "Chase",      inc: "+43%", note: "Pawn shop · Tampa" },
  { shop: "Smyrna",             owner: "Jason",      inc: "+41%", note: "Auto detail · Smyrna" }
];

// Standout owner-quotes (3 hero stories)
const REVIEW_STANDOUT = [
  {
    big: "80+",
    metric: "reviews in 6 weeks",
    quote: "Allan was the highest-rated guy on the crew before. Now he's the highest-rated on Google, too.",
    person: "Allan",
    shop: "Granters Auto · Phoenix",
    tone: "ember"
  },
  {
    big: "14",
    metric: "in week one",
    quote: "Marshall's already gotten five today and we've been open for an hour and a half.",
    person: "Carly",
    shop: "Axel's Pawn · Minneapolis",
    tone: "cocoa"
  },
  {
    big: "5",
    metric: "in 90 minutes",
    quote: "He got five Google reviews in less than two hours of being open.",
    person: "Marshall",
    shop: "Axel's Pawn · Minneapolis",
    tone: "honey"
  }
];

const REVIEW_FAQ = [
  {
    q: "How does the card work?",
    a: "Every Shmo Review card has an NFC chip programmed with your Google review URL. When a customer taps the back of their phone to the card, their browser opens that URL directly — no app, no login, no QR-code gymnastics. iPhone XS and newer (2018+) and Android 5+ have NFC built in."
  },
  {
    q: "Do I have to set anything up?",
    a: "No. Send us your Google review link at checkout and we program every card before it ships. If you change your business name or move locations later, you can reprogram from the dashboard at no extra cost."
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days. Bulk orders (10+) ship free expedited."
  },
  {
    q: "What if a customer's phone can't tap?",
    a: "Every card has a QR code on the back as a fallback. Same destination, same flow — just a scan instead of a tap. Covers any phone that can't NFC."
  },
  {
    q: "Is the card branded with my shop?",
    a: "Yes. Every order is custom-printed with your logo, name, and color treatment. Send us your assets at checkout and we'll mock it up before printing."
  },
  {
    q: "What's the return policy?",
    a: "60-day no-questions returns. If your crew hates it, box it back up and we refund the full amount. We also reprogram for life — change your destination URL whenever you want."
  }
];

const REVIEW_OBJECTIONS = [
  {
    q: "But we already ask for reviews.",
    a: "And how often does it actually happen? The ask gets skipped because asking is awkward. Handing over a card isn't. Crews who hated asking love handing."
  },
  {
    q: "Won't customers ignore a card?",
    a: "Not when they see the crew member who just helped them holding it. The hand-over is the social pressure. The card is just the vessel."
  },
  {
    q: "What if my crew forgets to hand it over?",
    a: "That's the point — you stop relying on memory. Make it part of the receipt routine. After 2 weeks it's automatic."
  },
  {
    q: "Can my competitors just buy these too?",
    a: "Sure. But you're reading this first. Reviews compound: the shop with 200 five-star reviews wins searches against the one with 40, every time."
  }
];

Object.assign(window, {
  REVIEW_BULLETS,
  REVIEW_FORMATS,
  REVIEW_PACKS,
  REVIEW_HOW_STEPS,
  REVIEW_NUMBERS,
  REVIEW_STANDOUT,
  REVIEW_FAQ,
  REVIEW_OBJECTIONS
});
