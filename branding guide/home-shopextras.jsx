/* home-shopextras.jsx — TrustBar, UGC strip, MascotMoment, Software strip */

/* ---------- Trust bar (under hero) ---------- */
function TrustBar() {
  const items = [
    { icon: <Icon.Truck/>,   title: "Free shipping",      sub: "On orders of 10+" },
    { icon: <Icon.Refresh/>, title: "Reprogrammable",     sub: "Update destination anytime" },
    { icon: <Icon.Tap/>,     title: "Works on any phone", sub: "iOS 14+ · Android 5+" },
    { icon: <Icon.Heart/>,   title: "30-day returns",     sub: "If your crew doesn't love it" },
  ];
  return (
    <section className="trustbar" aria-label="Why crews shop with us">
      <div className="trustbar__inner">
        {items.map((item, i) => (
          <div key={i} className="trustbar__item">
            <span className="trustbar__icon">{item.icon}</span>
            <span>
              <span className="trustbar__title">{item.title}</span><br/>
              <span className="trustbar__sub">{item.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Mascot moment — small s'more breaks between sections ---------- */
function MascotMoment({ pose, copy }) {
  return (
    <div className="mascot-moment" role="presentation">
      <div className="mascot-moment__art">
        <img src={`assets/mascot/${pose}.png`} alt=""/>
      </div>
      <p className="mascot-moment__copy">"{copy}"</p>
    </div>
  );
}

/* ---------- UGC strip (customer photos) ---------- */
const UGC_TILES = [
  { handle: "@cortado.coffee",  hue: 38 },
  { handle: "@apex.detail",     hue: 28 },
  { handle: "@lashroom.mpls",   hue: 22 },
  { handle: "@pinpoint.barber", hue: 32 },
  { handle: "@goldenpaw.k9",    hue: 42 },
  { handle: "@tanglewood.bnb",  hue: 18 },
];

function UGCTile({ tile }) {
  // No real photos yet — render a warm gradient + camera glyph + handle pill.
  return (
    <div className="ugc__tile">
      <div
        className="ugc__tile-fallback"
        style={{
          background: `linear-gradient(165deg,
            hsl(${tile.hue}, 60%, 78%) 0%,
            hsl(${tile.hue + 8}, 50%, 62%) 100%)`
        }}
      >
        <Icon.Camera/>
      </div>
      <span className="ugc__handle">{tile.handle}</span>
    </div>
  );
}

function UGCStrip() {
  return (
    <section className="hsection hsection--alt">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">From the crew · #shmocard</div>
          <h2 className="hsection__title">
            Real shops, real <em>tap</em> moments.
          </h2>
        </div>
        <p className="hsection__lede">
          Tag <strong>#shmocard</strong> on Instagram and we'll feature your shop.
          The best photos earn a free L-Sign for the counter.
        </p>
      </div>
      <div className="hsection__body">
        <div className="ugc">
          {UGC_TILES.map((t, i) => <UGCTile key={i} tile={t}/>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Software strip — collapsed coming-soon row ---------- */

function NotifyMini({ id }) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const onSubmit = (e) => { e.preventDefault(); if (email) setSubmitted(true); };
  if (submitted) {
    return (
      <span className="pill pill--success">
        <Icon.Check style={{width:12, height:12}}/> You're on the list
      </span>
    );
  }
  return (
    <form className="softstrip__notify" onSubmit={onSubmit}>
      <input
        className="input"
        type="email" required
        placeholder="you@crew.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn--soft" type="submit">Notify me</button>
    </form>
  );
}

const SOFT = [
  {
    key: "biz",
    glyph: "B",
    nameBefore: "Shmo ",
    nameEm: "Biz",
    when: "Coming Q2",
    desc: "One business card for the whole crew. Update the title once, it updates everywhere.",
  },
  {
    key: "link",
    glyph: "L",
    nameBefore: "Shmo ",
    nameEm: "Link",
    when: "Coming Q3",
    desc: "Rotate the destination of any card from the dashboard. Menu Mondays, specials Fridays.",
  },
  {
    key: "rep",
    glyph: "M",
    nameBefore: "Shmo ",
    nameEm: "Reputation",
    when: "Coming Q4",
    desc: "Single inbox for Google, Yelp, Facebook reviews. Respond on purpose, not at random.",
  },
];

function SoftStrip() {
  return (
    <section id="software" className="hsection">
      <div className="hsection__body">
        <div className="softstrip">
          <div className="softstrip__head">
            <h3>
              Beyond reviews — three more <em>tools</em> are baking.
            </h3>
            <p>
              Same cards, more jobs they can do. Drop your email under any
              of these and we'll let you know the moment they ship.
            </p>
          </div>
          <div className="softstrip__grid">
            {SOFT.map(s => (
              <div key={s.key} className="softstrip__card">
                <div className="softstrip__card-head">
                  <span className={`softstrip__glyph softstrip__glyph--${s.key}`}>{s.glyph}</span>
                  <div>
                    <div className="softstrip__name">
                      {s.nameBefore}<em>{s.nameEm}</em>
                    </div>
                    <div className="softstrip__when">{s.when}</div>
                  </div>
                </div>
                <p className="softstrip__desc">{s.desc}</p>
                <NotifyMini id={s.key}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TrustBar, MascotMoment, UGCStrip, SoftStrip });
