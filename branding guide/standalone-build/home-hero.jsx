/* home-hero.jsx — hero with crew lineup + product mini-tiles above the fold.
   Three layout variants exposed via Tweaks. */

const HERO_PRODUCT_TILES = [
  { name: "CR-80 Card",  price: 12, img: window.__resources.cardCr80 },
  { name: "L-Sign",      price: 28, img: window.__resources.cardLsign },
  { name: "Square Disc", price: 9,  img: window.__resources.cardSquare },
];

function HeroProductTiles() {
  return (
    <div className="hero-tiles" role="list">
      {HERO_PRODUCT_TILES.map((p, i) => (
        <a key={i} href={`#shop-${p.name}`} className="hero-tile" role="listitem">
          <span className="hero-tile__media">
            <img src={p.img} alt={p.name}/>
          </span>
          <span className="hero-tile__meta">
            <span className="hero-tile__name">{p.name}</span>
            <span className="hero-tile__price">from ${p.price}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function HeroCopy() {
  return (
    <div className="home-hero__copy">
      <span className="home-hero__pill">
        <span className="home-hero__pill-dot">
          <Icon.Tap style={{width:12, height:12}}/>
        </span>
        New: bulk crew kits — ship Friday
      </span>
      <h1 className="home-hero__title">
        Built for crews.<br/>
        <em>Priced</em> for bulk.
      </h1>
      <p className="home-hero__lede">
        NFC review cards, signs and discs for teams that talk to customers
        all day. One card per crew member, not one card per shop —
        equip everyone and watch the five-stars roll in.
      </p>
      <div className="home-hero__ctas">
        <a className="btn btn--accent btn--lg" href="#shop">
          Shop the cards <Icon.Arrow style={{width:16, height:16}}/>
        </a>
        <a className="btn btn--ghost btn--lg" href="#bundles">See crew bundles</a>
      </div>
      <div className="home-hero__meta">
        <span className="home-hero__meta-item">
          <Icon.Check style={{width:13, height:13, color:"var(--success)"}}/>
          Free shipping over 10
        </span>
        <span className="home-hero__meta-sep"/>
        <span className="home-hero__meta-item">
          <Icon.Check style={{width:13, height:13, color:"var(--success)"}}/>
          Reprogrammable for life
        </span>
        <span className="home-hero__meta-sep"/>
        <span className="home-hero__meta-item">
          <Icon.Check style={{width:13, height:13, color:"var(--success)"}}/>
          Ships in 3 days
        </span>
      </div>
    </div>
  );
}

function HeroStage({ kind = "crew" }) {
  // The crew lineup mascot is the hero visual.
  return (
    <div className={`home-hero__stage home-hero__stage--${kind}`}>
      <img
        src={window.__resources.heroCrew}
        alt="Shmocard crew — four s'mores holding review tools"
        className="home-hero__mascot"
      />
      {/* floating sale chip */}
      <span className="home-hero__chip">
        <span className="home-hero__chip-num">−15%</span>
        <span className="home-hero__chip-label">Crew packs</span>
      </span>
    </div>
  );
}

function HomeHero({ layout = "split" }) {
  if (layout === "center") {
    return (
      <section className="home-hero home-hero--center">
        <div className="home-hero__inner">
          <div className="home-hero__grid">
            <HeroCopy/>
            <HeroStage kind="wide"/>
          </div>
          <HeroProductTiles/>
        </div>
      </section>
    );
  }
  if (layout === "collage") {
    return (
      <section className="home-hero home-hero--collage">
        <div className="home-hero__inner">
          <div className="home-hero__grid">
            <HeroCopy/>
            <div className="home-hero__stack">
              <HeroStage kind="portrait"/>
              <HeroProductTiles/>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // default: split — copy left, mascot right, product tiles below copy
  return (
    <section className="home-hero home-hero--split">
      <div className="home-hero__inner">
        <div className="home-hero__grid">
          <div>
            <HeroCopy/>
            <HeroProductTiles/>
          </div>
          <HeroStage kind="square"/>
        </div>
      </div>
    </section>
  );
}

function StatStrip() {
  return (
    <section className="statstrip" aria-label="Trust">
      <div className="statstrip__inner">
        <span className="statstrip__lead">Loved by crews who talk to customers all day</span>
        <div className="statstrip__items">
          <div className="statstrip__item">
            <span className="statstrip__num">1,200+</span>
            <span className="statstrip__label">crews equipped</span>
          </div>
          <div className="statstrip__item">
            <span className="statstrip__num">40k+</span>
            <span className="statstrip__label">cards shipped</span>
          </div>
          <div className="statstrip__item">
            <span className="statstrip__num">4.9<span className="statstrip__star">★</span></span>
            <span className="statstrip__label">customer rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomeHero, StatStrip });
