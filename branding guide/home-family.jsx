/* home-family.jsx — "Meet the family" 4-up tiles */

const FAMILY = [
  {
    key: "review",
    name: "Shmo Review",
    italic: "Review",
    desc: "Tap-to-review cards, L-signs and counter discs. Send happy customers straight to your Google profile.",
    status: "live",
    cta: "Shop now",
    glyph: "R",
  },
  {
    key: "biz",
    name: "Shmo Biz",
    italic: "Biz",
    desc: "One card replaces everyone's business card, LinkedIn, and vCard. Updates with a dashboard, not a reprint.",
    status: "soon",
    cta: "Notify me",
    glyph: "B",
  },
  {
    key: "link",
    name: "Shmo Link",
    italic: "Link",
    desc: "A tap sends customers to your menu, booking page, Linktree — whatever matters right now. Rotate the destination without reprinting.",
    status: "soon",
    cta: "Notify me",
    glyph: "L",
  },
  {
    key: "rep",
    name: "Shmo Reputation",
    italic: "Reputation",
    desc: "Dashboard to manage reviews across Google, Yelp, Facebook. Respond, monitor, rescue near-miss reviews.",
    status: "soon",
    cta: "Notify me",
    glyph: "M",
  },
];

function FamilyTile({ item }) {
  const live = item.status === "live";
  return (
    <article className={`family__tile ${live ? "family__tile--live" : "family__tile--soon"}`}>
      <span className={`family__status ${live ? "family__status--live" : "family__status--soon"}`}>
        {live ? "Available now" : "Coming soon"}
      </span>
      <div className={`family__glyph family__glyph--${item.key}`}>{item.glyph}</div>
      <h3 className="family__name">
        Shmo <em>{item.italic}</em>
      </h3>
      <p className="family__desc">{item.desc}</p>
      <div className="family__foot">
        {item.cta} <Icon.Arrow/>
      </div>
    </article>
  );
}

function FamilySection() {
  return (
    <section id="family" className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Meet the family</div>
          <h2 className="hsection__title">
            One set of tools for every time a customer <em>meets</em> your crew.
          </h2>
        </div>
        <p className="hsection__lede">
          Four sub-brands, one shared platform. Shmo Review is shipping today;
          the rest roll out over the next few quarters. Get on the list and
          we'll tell you the moment they're ready.
        </p>
      </div>
      <div className="hsection__body">
        <div className="family">
          {FAMILY.map(item => <FamilyTile key={item.key} item={item}/>)}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { FamilySection });
