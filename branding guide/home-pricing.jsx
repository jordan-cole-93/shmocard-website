/* home-pricing.jsx — 4 bulk tiers (Solo / Crew / Shop / Fleet) */

const TIERS = [
  {
    name: "Solo",
    qty: "1 card",
    per: 18,
    total: "$18 total",
    cta: "Buy one",
    features: [
      "CR-80, L-Sign, or Disc",
      "Pre-programmed to your Google profile",
      "Free shipping in 5–7 days",
    ],
    feature: false,
  },
  {
    name: "Crew",
    qty: "5 cards",
    per: 14,
    total: "$70 total",
    cta: "Equip the crew",
    features: [
      "Mix any products",
      "Free expedited shipping",
      "Name-printed option (+$0)",
      "Reprogrammable, forever",
    ],
    feature: false,
  },
  {
    name: "Shop",
    qty: "15 cards",
    per: 11,
    total: "$165 total",
    cta: "Outfit the shop",
    features: [
      "All of Crew, plus:",
      "Mixed product order (cards + L-sign)",
      "Dedicated onboarding call",
      "Priority support",
    ],
    feature: true,
    badge: "Most popular",
  },
  {
    name: "Fleet",
    qty: "50+ cards",
    per: 8,
    total: "from $400",
    cta: "Talk to sales",
    features: [
      "All of Shop, plus:",
      "Custom printing & colors",
      "Bulk dashboard seats",
      "Net-30 terms for qualified buyers",
    ],
    feature: false,
  },
];

function TierCard({ t }) {
  return (
    <article className={`tier ${t.feature ? "tier--feature" : ""}`}>
      {t.badge && <span className="tier__badge">{t.badge}</span>}
      <h3 className="tier__name">{t.name}</h3>
      <div className="tier__quantity">{t.qty}</div>
      <div className="tier__price">
        <span className="tier__price-num">${t.per}</span>
        <span className="tier__price-unit">per card</span>
      </div>
      <div className="tier__total">{t.total}</div>
      <ul className="tier__features">
        {t.features.map((f, i) => (
          <li key={i}><Icon.Check/> {f}</li>
        ))}
      </ul>
      <a href="#" className={`btn ${t.feature ? "btn--accent" : "btn--soft"} tier__cta`}>
        {t.cta} <Icon.Arrow style={{width:14, height:14}}/>
      </a>
    </article>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Priced for bulk</div>
          <h2 className="hsection__title">
            The more you equip, the less each one <em>costs</em>.
          </h2>
        </div>
        <p className="hsection__lede">
          Pricing for Shmo Review. Every tier includes reprogrammable NFC,
          free shipping, and a dashboard seat.
          Fleet orders get custom colors and Net-30 terms.
        </p>
      </div>
      <div className="hsection__body">
        <div className="pricing">
          {TIERS.map((t, i) => <TierCard key={i} t={t}/>)}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="hsection hsection--tight">
      <div className="finalcta">
        <div className="finalcta__card">
          <img
            src="assets/mascot/celebrating.png"
            alt=""
            className="finalcta__mascot"
            aria-hidden="true"
          />
          <div className="finalcta__copy">
            <span className="finalcta__eyebrow">Ready to ship</span>
            <h2 className="finalcta__title">
              Equip your crew this <em>week</em>.
            </h2>
            <p className="finalcta__lede">
              Pick a card, pick a kit, or build your own. Orders placed by Tuesday
              ship Friday — your crew taps for five-stars by next Monday.
            </p>
          </div>
          <div className="finalcta__actions">
            <a className="btn btn--accent btn--lg" href="#shop">
              Shop the cards <Icon.Arrow style={{width:16, height:16}}/>
            </a>
            <a className="btn btn--soft btn--lg" href="#bundles">
              Browse bundles
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Pricing, FinalCTA });
