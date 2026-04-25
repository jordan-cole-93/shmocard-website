/* home-bundles.jsx — bundle / starter-kit cards (ecom shelf) */

const BUNDLES = [
  {
    key: "starter",
    feature: true,
    badge: "Save 18%",
    kicker: "Most popular",
    titleBefore: "The ",
    titleEm: "Starter",
    titleAfter: " Kit",
    desc: "Everything a small crew needs to start collecting reviews this week. One L-Sign for the counter, five cards for the team.",
    contents: ["1 × L-Sign for the counter", "5 × CR-80 cards (named on request)", "1 × dashboard seat included"],
    price: 89,
    was: 108,
    save: "save $19",
    images: [window.__resources.cardCr80, window.__resources.cardLsign],
  },
  {
    key: "crew",
    feature: false,
    badge: "Crew pack",
    kicker: "5-pack",
    titleBefore: "The ",
    titleEm: "Crew",
    titleAfter: " Pack",
    desc: "Five CR-80 cards for crews that ship without an L-Sign. Free shipping included.",
    contents: ["5 × CR-80 cards", "Free expedited shipping", "Reprogrammable, forever"],
    price: 60,
    was: 70,
    save: "save $10",
  },
  {
    key: "shop",
    feature: false,
    badge: "Shop pack",
    kicker: "15-pack",
    titleBefore: "The ",
    titleEm: "Shop",
    titleAfter: " Pack",
    desc: "Mixed cards + signs for owner-operators kitting out a whole location.",
    contents: ["10 × CR-80 cards", "2 × L-Signs", "3 × Square discs"],
    price: 165,
    was: 198,
    save: "save $33",
  },
];

function FeatureBundleStack({ images }) {
  return (
    <div className="bundle__stack">
      <div className="bundle__stack-item"><img src={images[0]} alt=""/></div>
      <div className="bundle__stack-item"><img src={images[1]} alt=""/></div>
    </div>
  );
}

function BundleCard({ b }) {
  return (
    <article className={`bundle ${b.feature ? "bundle--feature" : ""}`}>
      {b.badge && <span className="bundle__badge">{b.badge}</span>}
      {b.feature && b.images && <FeatureBundleStack images={b.images}/>}
      <span className="bundle__kicker">{b.kicker}</span>
      <h3 className="bundle__title">
        {b.titleBefore}<em>{b.titleEm}</em>{b.titleAfter}
      </h3>
      <p className="bundle__desc">{b.desc}</p>
      <ul className="bundle__contents">
        {b.contents.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      <div className="bundle__foot">
        <div className="bundle__price">
          <span className="bundle__price-num">${b.price}</span>
          {b.was && <span className="bundle__price-was">${b.was}</span>}
          {b.save && <span className="bundle__save">{b.save}</span>}
        </div>
        <a className={`btn ${b.feature ? "btn--accent" : "btn--soft"} btn--sm`} href={`#bundle-${b.key}`}>
          Add to cart <Icon.Arrow style={{width:13, height:13}}/>
        </a>
      </div>
    </article>
  );
}

function Bundles() {
  return (
    <section id="bundles" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Bundles · Save when you equip the crew</div>
          <h2 className="hsection__title">
            Shop the whole <em>set</em>.
          </h2>
        </div>
        <p className="hsection__lede">
          Pre-built crew kits for the most common shop sizes. Mix and match
          if you'd rather build your own — bulk pricing kicks in at five cards.
        </p>
      </div>
      <div className="hsection__body">
        <div className="bundles">
          {BUNDLES.map(b => <BundleCard key={b.key} b={b}/>)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Bundles });
