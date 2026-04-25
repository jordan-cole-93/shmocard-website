/* home-products.jsx — Shmo Review spotlight: 3 products with star ratings */

const PRODUCTS = [
  {
    sku: "cr80",
    tag: "Best seller",
    name: "CR-80 Card",
    kicker: "Credit-card size · PVC",
    pitch: "The classic. Slips in a wallet, clips to a lanyard, lives in a back pocket. One per crew member.",
    price: 12,
    img: window.__resources.cardCr80,
    rating: 4.9, reviews: 412,
  },
  {
    sku: "lsign",
    tag: "For the counter",
    name: "L-Sign",
    kicker: "Tabletop stand · 4×6",
    pitch: "Lives next to the register. Guests tap on their way out — no staff prompt needed.",
    price: 28,
    img: window.__resources.cardLsign,
    rating: 4.8, reviews: 186,
  },
  {
    sku: "square",
    tag: "Window cling",
    name: "Square Disc",
    kicker: "Puck · 2.25 inch",
    pitch: "Sticks to anything — door, window, dashboard. Ideal for mobile crews and service vans.",
    price: 9,
    img: window.__resources.cardSquare,
    rating: 4.9, reviews: 273,
  },
];

function StarRow({ rating = 5, count }) {
  const full = Math.round(rating);
  return (
    <span className="stars">
      <span className="stars__row" aria-label={`${rating} out of 5`}>
        {Array.from({length: 5}).map((_, i) => (
          <Icon.Star key={i} style={{opacity: i < full ? 1 : 0.25}}/>
        ))}
      </span>
      <span className="stars__count">{rating.toFixed(1)} · {count} reviews</span>
    </span>
  );
}

function ProductCard({ p }) {
  return (
    <article className="product">
      <div className="product__media">
        <span className="product__tag">{p.tag}</span>
        <img src={p.img} alt={`Shmo Review ${p.name}`} loading="lazy"/>
      </div>
      <div className="product__body">
        <span className="product__kicker">{p.kicker}</span>
        <h3 className="product__title">{p.name}</h3>
        <div className="product__stars">
          <StarRow rating={p.rating} count={p.reviews}/>
        </div>
        <p className="product__pitch">{p.pitch}</p>
        <div className="product__foot">
          <div className="product__price">
            <span className="product__price-from">from</span>
            <span className="product__price-num">${p.price}</span>
          </div>
          <a className="btn btn--accent btn--sm" href={`#shop-${p.sku}`}>
            Add to cart <Icon.Arrow style={{width:13, height:13}}/>
          </a>
        </div>
      </div>
    </article>
  );
}

function ReviewSpotlight() {
  return (
    <section id="shop" className="hsection hsection--alt">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Shop · Shmo Review</div>
          <h2 className="hsection__title">
            Three ways to catch a <em>five-star</em> moment.
          </h2>
        </div>
        <p className="hsection__lede">
          Every product ships pre-programmed to your Google review link
          and works straight out of the box. No app, no QR-code gymnastics —
          customer taps, star rating opens, done.
        </p>
      </div>
      <div className="hsection__body">
        <div className="products">
          {PRODUCTS.map(p => <ProductCard key={p.sku} p={p}/>)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ReviewSpotlight, StarRow });
