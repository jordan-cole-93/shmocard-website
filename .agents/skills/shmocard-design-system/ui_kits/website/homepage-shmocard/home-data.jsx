// home-data.jsx — content for the homepage. Pulled from marketing.md / product.md.

const SUB_BRANDS = [
  {
    id: "review",
    eyebrow: "Shmo Review",
    name: "Review",
    status: "live",
    badge: "Available now",
    headline: <>One tap. One five-star <em>review</em>.</>,
    lede: "An NFC card, sign or disc that, when tapped by a customer's phone, opens your Google review page directly. No app, no login, no QR-code gymnastics.",
    bullets: [
      "Pre-programmed to your Google review link before it ships.",
      "Reprogrammable for life — change the destination from your dashboard.",
      "Three formats: wallet-size CR-80, counter L-Sign, square disc."
    ],
    primary: { label: "Shop the cards →", href: "/shmo-review" },
    secondary: { label: "See how it works", href: "#how" },
    aside: "Live now · ships within the week",
    bg: "shm-bg-marsh",
    art: { kind: "photo", src: "assets/products/cr80-trio.png", chip: <><span className="pill-ember">CR-80</span> Wallet-size · PVC</> },    formats: [
      { title: "CR-80 Card", sub: "Best seller · wallet-size · PVC" },
      { title: "L-Sign", sub: "Counter standee · 4×6 acrylic" },
      { title: "Square Card", sub: "Disc · 2.25\" · sticks anywhere" }
    ]
  },
  {
    id: "biz",
    eyebrow: "Shmo Biz",
    name: "Biz",
    status: "soon",
    badge: "Coming soon",
    headline: <>Your business card. <em>Always</em> up to date.</>,
    lede: "An NFC business card that taps into a contact profile you can edit any time. Change your number, role or socials — every card you've ever handed out updates automatically.",
    bullets: [
      "Physical NFC card and shareable digital link in one.",
      "Edit your contact profile from a dashboard. Never reprint.",
      "Custom-printed with your shop's branding."
    ],
    primary: { label: "Notify me when it's live →", href: "#waitlist", waitlist: true, product: "Shmo Biz" },
    aside: "Pre-launch · email signup",
    bg: "shm-bg-graham",
    art: { kind: "mascot", src: "assets/mascot/holding-card.png" }
  },
  {
    id: "link",
    eyebrow: "Shmo Link",
    name: "Link",
    status: "soon",
    badge: "Coming soon",
    headline: <>One link. <em>All</em> the things you do.</>,
    lede: "A branded link-in-bio for local shops. Booking, menu, location, hiring, current promotion — every important link a customer might need, on one tap-friendly page.",
    bullets: [
      "Hosts every link your shop needs in one branded page.",
      "Tap or scan to open. Drop the link anywhere.",
      "Reorder, swap and update from your dashboard."
    ],
    primary: { label: "Notify me when it's live →", href: "#waitlist", waitlist: true, product: "Shmo Link" },
    aside: "Pre-launch · email signup",
    bg: "shm-bg-marsh",
    art: { kind: "mascot", src: "assets/mascot/heart-hands.png" }
  },
  {
    id: "reputation",
    eyebrow: "Shmo Reputation",
    name: "Reputation",
    status: "soon",
    badge: "Coming soon",
    headline: <>Every review, <em>answered</em>.</>,
    lede: "Auto-respond to every Google review — positive and negative — in your shop's voice. Replying is a known ranking factor and a trust signal. Stop letting reviews sit.",
    bullets: [
      "AI replies in your voice, on every review.",
      "Approval mode for shops that want a final say.",
      "Subscription pricing. Billed monthly. Cancel any time."
    ],
    primary: { label: "Notify me when it's live →", href: "#waitlist", waitlist: true, product: "Shmo Reputation" },
    aside: "Pre-launch · email signup",
    bg: "shm-bg-cocoa",
    art: { kind: "mascot", src: "assets/mascot/megaphone.png" }
  }
];

const SHOPS = [
  { name: "The Pawn Shop", owner: "Chase", inc: "+43%" },
  { name: "Granters", owner: "Vito", inc: "+60%" },
  { name: "Axel's Pawn", owner: "Carly", inc: "+71%" },
  { name: "Buffalo Jewelry & Loan", owner: "Joey", inc: "+81%" },
  { name: "Smyrna", owner: "Jason", inc: "+41%" },
  { name: "CC Pawn", owner: "Claiborne", inc: "+71%" },
  { name: "Garden City", owner: "Thomas", inc: "+86%" },
  { name: "Cashco", owner: "Morris", inc: "+47%" }
];

const QUOTES = [
  {
    body: "We've gotten 5 Google Reviews just today now that our NFC cards are up and running. It makes it so much easier to get customers to follow through.",
    author: "Carli Karlson",
    shop: "Axel's Pawn",
    initials: "CK"
  },
  {
    body: "My ShmoCards are the best. They have boosted our Google reviews by giving my team the ability to ask for a review just at the right time during a transaction.",
    author: "Pawnbrokers Helping Pawnbrokers",
    shop: "Industry group",
    initials: "PH"
  }
];

const AUDIENCES = [
  "Barbers", "Pawn shops", "Auto shops", "Jewelers", "Roofers",
  "Salons", "Cafés", "Restaurants", "Mobile crews", "Independent retailers"
];

const HOW_STEPS = [
  { n: "01", title: "You order", body: "One card per crew member. Send us your Google review link at checkout." },
  { n: "02", title: "We program", body: "Every card ships pre-loaded with your link. Custom-printed with your shop's branding." },
  { n: "03", title: "Crew hands it over", body: "After every transaction, an employee hands the card to the customer." },
  { n: "04", title: "Customer taps", body: "The phone reads the card. Their browser opens your Google review page instantly." },
  { n: "05", title: "Five stars, one sentence", body: "They tap five and type. The whole thing takes seconds — no app, no login." },
  { n: "06", title: "QR fallback", body: "A QR code on the back covers any phone that can't tap. Same destination, same flow." }
];

const FAQ = [
  {
    q: "What is ShmoCard?",
    a: "ShmoCard is a family of NFC tools built for local shop crews — review cards, business cards, link hubs, and an AI review responder. One brand, one dashboard, one-time card purchase."
  },
  {
    q: "Does it work with every phone?",
    a: "iPhone XS and newer (2018+) and Android 5.0 and newer have NFC built in — customers tap and the page opens. A QR code on the back covers any phone that can't."
  },
  {
    q: "Can I change where the card sends people?",
    a: "Yes — every card is reprogrammable for life. Update the destination URL from the dashboard whenever you want."
  },
  {
    q: "How fast does it ship?",
    a: "Orders placed by Tuesday 5pm CT ship Friday. Standard shipping is 3 days; bulk orders (10+) ship free expedited."
  },
  {
    q: "What if my crew hates it?",
    a: "30-day no-questions returns. Box it back up and we'll refund the full amount."
  },
  {
    q: "Is the card printed with our brand?",
    a: "Yes — every order is custom-printed with your shop's logo, name, and color treatment. Send us your assets at checkout."
  }
];

Object.assign(window, { SUB_BRANDS, SHOPS, QUOTES, AUDIENCES, HOW_STEPS, FAQ });
