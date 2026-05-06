// Combined homepage scripts

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


// home-parts.jsx — small reusable parts (Nav, Wave, Wordmark, Logo)

const { useState, useEffect } = React;

function Wordmark({ size = 26 }) {
  return (
    <span className="nav-mark" style={{ fontSize: size }}>
      <span className="wm-shmo">Shmo</span><span className="wm-card">Card</span>
    </span>
  );
}

function Logo({ size = 26 }) {
  return (
    <a className="nav-logo" href="#top" aria-label="ShmoCard home">
      <img src="assets/mascot/wordmark-smore.png" alt="" style={{ width: size * 1.25, height: size * 1.25 }} />
      <Wordmark size={size} />
    </a>
  );
}

function Wave({ to, flip = false }) {
  return <div className={`shm-wave shm-wave--${to}${flip ? ' flip' : ''}`} aria-hidden="true"></div>;
}

function Nav({ cartCount = 2 }) {
  return (
    <header className="shm-nav" id="top">
      <div className="shm-container nav-inner">
        <Logo size={26} />
        <nav className="nav-links" aria-label="Primary">
          <a className="nav-link" href="/shmo-review">
            Shmo Review
            <span className="shm-badge shm-badge--status shm-badge--status-clover nav-link-status">Live</span>
          </a>
          <a className="nav-link" href="#biz">
            Shmo Biz
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
          <a className="nav-link" href="#link">
            Shmo Link
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
          <a className="nav-link" href="#reputation">
            Shmo Reputation
            <span className="shm-badge shm-badge--status shm-badge--status-honey nav-link-status">Soon</span>
          </a>
        </nav>
        <div className="nav-cta-row">
          <button className="nav-cart" aria-label={`Cart, ${cartCount} items`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 7h14l-1.5 9.2a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z"/>
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
            </svg>
            {cartCount > 0 && <span className="nav-cart__count">{cartCount}</span>}
          </button>
          <a className="shm-btn shm-btn--primary shm-btn--sm" href="/shmo-review">Shop →</a>
        </div>
      </div>
    </header>
  );
}

function TypeCycle({ words = [], typeMs = 90, deleteMs = 50, holdMs = 1400, endHoldMs = 600 }) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | holding | deleting

  useEffect(() => {
    if (!words.length) return;
    const word = words[idx];
    let timer;
    if (phase === "typing") {
      if (shown.length < word.length) {
        timer = setTimeout(() => setShown(word.slice(0, shown.length + 1)), typeMs);
      } else {
        timer = setTimeout(() => setPhase("deleting"), holdMs);
      }
    } else if (phase === "deleting") {
      if (shown.length > 0) {
        timer = setTimeout(() => setShown(word.slice(0, shown.length - 1)), deleteMs);
      } else {
        timer = setTimeout(() => {
          setIdx((idx + 1) % words.length);
          setPhase("typing");
        }, endHoldMs);
      }
    }
    return () => clearTimeout(timer);
  }, [shown, phase, idx, words]);

  return (
    <span className="type-cycle">
      <span className="type-cycle__text">{shown || "\u00A0"}</span>
      <span className="type-cycle__caret" aria-hidden="true">|</span>
    </span>
  );
}

function HeroToolkitTile({ name, sub, status, art, color }) {
  return (
    <div className="hero-toolkit__tile" style={color ? { background: color } : null}>
      {status && (
        <span className={`shm-badge ${status === 'live' ? 'shm-badge--ember' : ''} hero-toolkit__status`}>
          {status === 'live' ? 'Live' : 'Soon'}
        </span>
      )}
      {art && (
        <div className={"hero-toolkit__art" + (art.includes("megaphone") ? " hero-toolkit__art--megaphone" : "")}>
          <img src={art} alt="" />
        </div>
      )}
      <h3 className="hero-toolkit__name">{name}</h3>
      <p className="hero-toolkit__sub">{sub}</p>
    </div>
  );
}

function AudienceStrip() {
  const items = [...AUDIENCES, ...AUDIENCES]; // duplicate for seamless scroll
  return (
    <div className="audience-strip" aria-hidden="true">
      <div className="audience-strip__track">
        {items.map((a, i) => (
          <React.Fragment key={i}>
            <span>{a}</span>
            <span className="dot"></span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ProofShop({ shop }) {
  return (
    <div className="shm-card proof-shop">
      <div className="proof-shop__name">{shop.name}</div>
      <div className="proof-shop__owner">{shop.owner}</div>
      <div className="proof-shop__inc">{shop.inc}</div>
    </div>
  );
}

function ProofQuote({ quote }) {
  return (
    <figure className="shm-card proof-quote">
      <blockquote className="proof-quote__body">"{quote.body}"</blockquote>
      <figcaption className="proof-quote__attr">
        <span className="proof-quote__avatar">{quote.initials}</span>
        <span>
          <b>{quote.author}</b>
          {quote.shop}
        </span>
      </figcaption>
    </figure>
  );
}

function HowStep({ step }) {
  return (
    <div className="shm-card how-step">
      <div className="how-step__num">{step.n}</div>
      <div className="how-step__title">{step.title}</div>
      <p className="how-step__body">{step.body}</p>
    </div>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <li className="shm-faq-item">
      <button className="shm-faq-trigger" aria-expanded={open} onClick={onToggle}>
        <span className="shm-faq-question">{item.q}</span>
        <span className="shm-faq-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </span>
      </button>
      {open && <div className="shm-faq-answer">{item.a}</div>}
    </li>
  );
}

function Faq({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="faq-wrap">
      <ul className="shm-faq-list">
        {items.map((it, i) => (
          <FaqItem
            key={i}
            item={it}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </ul>
    </div>
  );
}

function Compatibility() {
  return (
    <div className="shm-container compat">
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        Works on <b>iPhone XS+</b> (2018 and newer)
      </span>
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        And <b>Android 5+</b> (Lollipop and up)
      </span>
      <span className="compat-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><path d="M14 14h3v3h-3z M20 14h1v3M14 20h3v1M20 20h1v1"/></svg>
        QR code on every card for older phones
      </span>
    </div>
  );
}

Object.assign(window, { Nav, Wave, Wordmark, Logo, HeroToolkitTile, AudienceStrip, ProofShop, ProofQuote, HowStep, FaqItem, Faq, Compatibility });


// home-modals.jsx — waitlist modal + spotlight section

const { useState: useStateM, useEffect: useEffectM } = React;

function WaitlistModal({ open, product, onClose }) {
  const [email, setEmail] = useStateM("");
  const [submitted, setSubmitted] = useStateM(false);

  useEffectM(() => {
    if (!open) {
      setSubmitted(false);
      setEmail("");
    }
  }, [open]);

  useEffectM(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(e) {
    e.preventDefault();
    // Webhook stub — would POST to backend
    if (email && email.includes("@")) setSubmitted(true);
  }

  return (
    <div className={`modal-scrim${open ? ' is-open' : ''}`} onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {!submitted ? (
          <>
            <span className="modal-product-pill">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="4"/></svg>
              <em>{product || "Coming soon"}</em>
            </span>
            <h3 id="modal-title">Get on the <em>list</em>.</h3>
            <p>We'll email you the moment {product} is ready to ship. No spam, no drip campaign — one note when it's live.</p>
            <form className="modal-form" onSubmit={submit}>
              <div className="shm-field">
                <label className="shm-field__label" htmlFor="wl-email">Your email</label>
                <input
                  id="wl-email"
                  className="shm-input"
                  type="email"
                  placeholder="you@yourshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <p className="shm-field__hint">We'll only use this to send you the launch note.</p>
              </div>
              <button type="submit" className="shm-btn shm-btn--primary shm-btn--lg">
                Notify me →
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="modal-success__check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>You're on the <em>list</em>.</h3>
            <p>We'll email <b style={{color:"var(--color-cocoa-deep)"}}>{email}</b> the moment {product} is ready.</p>
            <button className="shm-btn shm-btn--cocoa" onClick={onClose}>Back to the toolkit</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubBrandSpotlight({ data, idx, openModal }) {
  const reverse = idx % 2 === 1;
  const onCta = (e, ctaInfo) => {
    if (ctaInfo && ctaInfo.waitlist) {
      e.preventDefault();
      openModal(ctaInfo.product);
    }
  };
  return (
    <section className={`shm-section ${data.bg}`} id={data.id} data-screen-label={`Sub-brand · ${data.name}`}>
      <div className="shm-container">
        <div className={`spotlight${reverse ? ' spotlight--reverse' : ''}`}>
          <div className="spotlight-copy">
            <div className="spotlight-meta">
              <span className="spotlight-num">{String(idx + 1).padStart(2, "0")}/04</span>
              <span className="shm-eyebrow">{data.eyebrow}</span>
              {data.status === "live" ? (
                <span className="shm-badge shm-badge--status shm-badge--status-clover">Available now</span>
              ) : (
                <span className="shm-badge shm-badge--status shm-badge--status-honey">{data.badge}</span>
              )}
            </div>
            <h2 className="shm-h1 spotlight-h">{data.headline}</h2>
            <p className="shm-lede spotlight-lede">{data.lede}</p>
            <ul className="spotlight-bullets">
              {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {data.formats && (
              <div className="formats-row">
                {data.formats.map((f, i) => (
                  <div className="shm-card format-mini" key={i}>
                    <div className="format-mini__title">{f.title}</div>
                    <div className="format-mini__sub">{f.sub}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="spotlight-cta-row">
              <a
                className={`shm-btn ${data.status === "live" ? "shm-btn--primary" : (data.bg === "bg-cocoa" ? "shm-btn--honey" : "shm-btn--cocoa")} shm-btn--lg`}
                href={data.primary.href}
                onClick={(e) => onCta(e, data.primary)}
              >
                {data.primary.label}
              </a>
              {data.secondary && (
                <a className="shm-btn shm-btn--ghost" href={data.secondary.href}>
                  {data.secondary.label}
                </a>
              )}
            </div>
            {data.aside && <div className="spotlight-aside">{data.aside}</div>}
          </div>
          <div className={`spotlight-art spotlight-art--${data.art.kind}`}>
            <image-slot
              id={`spotlight-${data.id}`}
              shape="rounded"
              radius="20"
              placeholder={`Drop ${data.eyebrow} image`}
              style={{width: "100%", height: "100%", display: "block"}}
            ></image-slot>
            {data.art.chip && <div className="spotlight-art__chip">{data.art.chip}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function CrewStrip() {
  const tiles = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <section className="shm-section shm-bg-marsh" data-screen-label="05 Crew UGC">
      <div className="crew-strip">
        <div className="crew-strip__head">
          <img className="crew-strip__sticker shm-tilt-l" src="assets/mascot/wordmark-smore.png" alt="" />
          <span className="crew-strip__hash">From the crew · #shmocard</span>
          <h2 className="shm-h2">Real shops, real <em>tap</em> moments.</h2>
          <p className="crew-strip__lede">
            Tag <b>#shmocard</b> on Instagram and we'll feature your shop. The best photos earn a free L-Sign for the counter.
          </p>
        </div>
        <div className="crew-grid">
          {tiles.map((n) => (
            <div className="crew-tile" key={n}>
              <span className="crew-tile__chip">Crew photo · TBD</span>
              <image-slot
                id={`crew-${n}`}
                shape="rounded"
                radius="16"
                placeholder=""
              ></image-slot>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoTestimonials() {
  const cards = [
    {
      tone: "ember",
      duration: "1:42",
      quote: "Got 14 in the first week. Marshall's already gotten five today and we've been open for an hour and a half.",
      person: "Carly",
      role: "Owner, Axel's Pawn",
      shop: "Axel's"
    },
    {
      tone: "cocoa",
      duration: "0:58",
      quote: "He got five Google reviews in less than two hours of being open.",
      person: "Carly",
      role: "Owner, Axel's Pawn",
      shop: "Axel's"
    },
    {
      tone: "honey",
      duration: "—",
      coming: true,
      quote: "Transcription pending — we'll add this story when it's ready.",
      person: "Joey",
      role: "Coming soon",
      shop: "—"
    }
  ];
  return (
    <section className="shm-section shm-bg-marsh" data-screen-label="09 Video testimonials">
      <div className="shm-container video-testimonials">
        <div className="video-testimonials__head">
          <span className="video-testimonials__eyebrow">What crews say</span>
          <h2 className="shm-h2">Real crews, real <em>five-star</em> moments.</h2>
          <p className="video-testimonials__lede">
            Short stories from owner-operators who put Shmocards on their teams. No script, no vague metrics — just what changed.
          </p>
        </div>
        <div className="video-grid">
          {cards.map((c, i) => (
            <article className={`shm-card video-card${c.coming ? ' video-card--coming' : ''}`} key={i}>
              <div className="video-card__media">
                <div className={`video-card__media-bg video-card__media-bg--${c.tone}`}></div>
                <button className="video-card__play" aria-label="Play video">
                  <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="3 1 14 8 3 15"/></svg>
                </button>
                <span className="video-card__duration">{c.duration}</span>
                <div className={`video-card__quote${c.coming ? ' video-card__pending' : ''}`}>
                  <p className="video-card__quote-text">"{c.quote}"</p>
                </div>
              </div>
              <div className="video-card__attr">
                <div className="video-card__person">
                  <b>{c.person}</b>
                  <span>{c.role}</span>
                </div>
                <div className="video-card__shop">{c.shop}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WaitlistModal, SubBrandSpotlight, CrewStrip, VideoTestimonials });


// home-app.jsx — orchestrator

const { useState: useStateA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroPrimaryCta": "Shop Shmo Review →",
  "heroSecondaryCta": "Browse the toolkit",
  "showHandNote": true,
  "subBrandOrder": "default"
}/*EDITMODE-END*/;

function HomeApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modalProduct, setModalProduct] = useStateA(null);
  const openModal = (product) => setModalProduct(product);
  const closeModal = () => setModalProduct(null);

  const order = t.subBrandOrder === "review-last"
    ? [SUB_BRANDS[1], SUB_BRANDS[2], SUB_BRANDS[3], SUB_BRANDS[0]]
    : SUB_BRANDS;

  return (
    <>
      <Nav cartCount={2} />

      {/* HERO — marshmallow */}
      <section className="shm-section shm-bg-marsh hero" data-screen-label="01 Hero">
        <div className="shm-container hero__inner">
          <span className="shm-eyebrow hero-eyebrow">A toolkit for local crews</span>
          <h1 className="shm-display">The toolkit your crew's been<br /><em><TypeCycle words={["missing", "asking for"]} typeMs={140} deleteMs={80} holdMs={2200} endHoldMs={900} /></em>.</h1>
          <p className="shm-lede hero-lede">
            Four NFC tools, one brand, one dashboard. Tap a card, post a review, share a contact, jump to a link hub, or auto-respond to every Google review. No app. No login. No friction for your customers.
          </p>
          <div className="hero-cta-row">
            <a className="shm-btn shm-btn--primary shm-btn--lg" href="/shmo-review">{t.heroPrimaryCta}</a>
            <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#review">{t.heroSecondaryCta}</a>
          </div>
          {t.showHandNote && (
            <div className="hero-meta">
              <span className="hand-note">
                <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 12 Q 8 4, 16 12 T 30 8" /><path d="M26 4 L30 8 L26 12" /></svg>
                Live now — Shmo Review
              </span>
              <span className="dot"></span>
              <span>3 more tools coming this year</span>
            </div>
          )}
        </div>

        <div className="hero-stage" aria-hidden="false">
          <div className="hero-toolkit">
            <HeroToolkitTile
              name={<>Shmo <em>Review</em></>}
              sub="Tap-to-review NFC card"
              status="live"
              art="assets/mascot/review-phone.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Biz</em></>}
              sub="NFC business card"
              status="soon"
              art="assets/mascot/holding-card.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Link</em></>}
              sub="Link-in-bio for shops"
              status="soon"
              art="assets/mascot/heart-hands.png"
            />
            <HeroToolkitTile
              name={<>Shmo <em>Reputation</em></>}
              sub="AI review responder"
              status="soon"
              art="assets/mascot/megaphone.png"
            />
          </div>
        </div>
      </section>
      <Wave to="graham" />

      {/* AUDIENCE STRIP — graham */}
      <section className="shm-bg-graham" data-screen-label="02 Audience">
        <AudienceStrip />
      </section>
      <Wave to="marsh" />

      {/* PROOF — marshmallow */}
      <section className="shm-section shm-bg-marsh" data-screen-label="03 Proof">
        <div className="shm-container">
          <div className="shm-section-head">
            <span className="shm-eyebrow">Real shops · real numbers</span>
            <h2 className="shm-h2">Crews using ShmoCard. <em>Right now.</em></h2>
          </div>
          <div className="proof-grid">
            <div className="proof-quotes">
              {QUOTES.map((q, i) => <ProofQuote key={i} quote={q} />)}
            </div>
            <div className="proof-shops">
              {SHOPS.map((s, i) => <ProofShop key={i} shop={s} />)}
            </div>
          </div>
          <p className="proof-foot">Verified review-volume increases reported by Shmo Review customers.</p>
        </div>
      </section>
      <Wave to={order[0].bg === "shm-bg-graham" ? "graham" : (order[0].bg === "shm-bg-cocoa" ? "cocoa" : "marsh")} />

      {/* SUB-BRAND SEQUENCE */}
      {order.map((data, i) => {
        const next = order[i + 1];
        // Wave color = current (outgoing) section bg, flipped so it peeks up from below
        const curBg = data.bg === "shm-bg-graham" ? "graham" :
                      data.bg === "shm-bg-cocoa" ? "cocoa" : "marsh";
        const nextBg = next ? (
          next.bg === "shm-bg-graham" ? "graham" :
          next.bg === "shm-bg-cocoa" ? "cocoa" : "marsh"
        ) : "marsh";
        // Pick whichever side is more saturated for visible contrast
        const waveTo = (curBg === "marsh" && nextBg === "marsh") ? "graham" :
                       (curBg === "graham" && nextBg === "marsh") ? "graham" :
                       nextBg;
        // After Shmo Review (the first live product, id="review"), insert the crew UGC strip
        const insertCrewAfter = data.id === "review";
        return (
          <React.Fragment key={data.id}>
            <SubBrandSpotlight data={data} idx={i} openModal={openModal} />
            {insertCrewAfter && <CrewStrip />}
            <Wave to={waveTo} flip={curBg === "graham" && nextBg === "marsh"} />
          </React.Fragment>
        );
      })}

      {/* HOW IT WORKS — marshmallow */}
      <section className="shm-section shm-bg-marsh" id="how" data-screen-label="08 How it works">
        <div className="shm-container">
          <div className="shm-section-head">
            <span className="shm-eyebrow">How it works</span>
            <h2 className="shm-h2">Right tool. Right hand. <em>Right moment.</em></h2>
            <p className="shm-lede">The bet is simple: every problem of asking is a hardware problem. Give the crew something to hand over, and the ask happens.</p>
          </div>
          <div className="how-grid">
            {HOW_STEPS.map((s, i) => <HowStep key={i} step={s} />)}
          </div>
        </div>
      </section>

      <VideoTestimonials />
      <Wave to="graham" />

      {/* COMPAT BAND — graham */}
      <section className="shm-bg-graham" data-screen-label="09 Compatibility">
        <Compatibility />
      </section>
      <Wave to="marsh" />

      {/* FAQ — marshmallow */}
      <section className="shm-section shm-bg-marsh" data-screen-label="10 FAQ">
        <div className="shm-container">
          <div className="shm-section-head faq-head">
            <img className="faq-sticker shm-tilt-r" src="assets/mascot/charge.png" alt="" />
            <span className="shm-eyebrow">Frequently asked</span>
            <h2 className="shm-h2">Questions, answered <em>plainly</em>.</h2>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>
      <Wave to="ember" />

      {/* FINAL CTA — ember */}
      <section className="shm-section shm-bg-ember" data-screen-label="11 Final CTA">
        <div className="shm-container final-cta">
          <span className="shm-eyebrow">Ready to ship</span>
          <h2 className="shm-h1">Pick a card. Pick a kit. <em>Or build your own.</em></h2>
          <p className="final-cta-lede">
            Orders placed by Tuesday ship Friday — your crew taps for five-stars by next Monday.
          </p>
          <div className="final-cta-row">
            <a className="shm-btn shm-btn--cream shm-btn--lg" href="/shmo-review">Shop the cards →</a>
            <a className="shm-btn shm-btn--ghost shm-btn--lg" href="/shmo-review#bundles">Browse bundles</a>
          </div>
        </div>
      </section>
      <Wave to="cocoa" />

      {/* FOOTER — cocoa */}
      <footer className="footer" data-screen-label="12 Footer">
        <div className="shm-container">
          <div className="footer-grid">
            <div className="footer-col">
              <span className="footer-mark">
                <img src="assets/mascot/wordmark-smore.png" alt="" />
                <span><span className="wm-shmo">Shmo</span><span className="wm-card">Card</span></span>
              </span>
              <p className="footer-tagline">A family of NFC tools built for local shop crews. One brand. One dashboard. One-time card purchase.</p>
              <div style={{display: "flex", gap: 10}}>
                <a href="#" aria-label="Instagram" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg>
                </a>
                <a href="#" aria-label="Facebook" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:999,border:"1px solid rgba(255,251,241,0.18)"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 8s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C16 4.5 12 4.5 12 4.5s-4 0-7.1.3c-.4.1-1.3.1-2.1 1C2.2 6.5 2 8 2 8s-.2 1.7-.2 3.4v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.3.3 7.3.3s4 0 7.1-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.7.2-3.4v-1.6C22.2 9.7 22 8 22 8z"/><polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Products</h4>
              <ul>
                <li><a href="/shmo-review">Shmo Review</a></li>
                <li><a href="#biz">Shmo Biz <span className="footer-soon">Soon</span></a></li>
                <li><a href="#link">Shmo Link <span className="footer-soon">Soon</span></a></li>
                <li><a href="#reputation">Shmo Reputation <span className="footer-soon">Soon</span></a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="/shmo-review/cr-80">CR-80 Card</a></li>
                <li><a href="/shmo-review/l-sign">L-Sign</a></li>
                <li><a href="/shmo-review/square-card">Square Card</a></li>
                <li><a href="/shmo-review#bundles">Bundles</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="#">Shipping &amp; returns</a></li>
                <li><a href="#">Contact support</a></li>
                <li><a href="#">hello@shmocard.com</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© ShmoCard 2026 · Built for crews. Priced for bulk.</span>
            <span><a href="#">Privacy</a> · <a href="#">Terms</a></span>
          </div>
        </div>
      </footer>

      <WaitlistModal open={!!modalProduct} product={modalProduct} onClose={closeModal} />

      <TweaksPanel>
        <TweakSection label="Hero CTAs" />
        <TweakText label="Primary CTA" value={t.heroPrimaryCta} onChange={(v) => setTweak('heroPrimaryCta', v)} />
        <TweakText label="Secondary CTA" value={t.heroSecondaryCta} onChange={(v) => setTweak('heroSecondaryCta', v)} />
        <TweakSection label="Hero accent" />
        <TweakToggle label="Show hand-note under hero" value={t.showHandNote} onChange={(v) => setTweak('showHandNote', v)} />
        <TweakSection label="Sub-brand order" />
        <TweakRadio
          label="Order"
          value={t.subBrandOrder}
          options={["default", "review-last"]}
          onChange={(v) => setTweak('subBrandOrder', v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<HomeApp />);
