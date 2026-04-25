/* home-previews.jsx — alternating rows for Shmo Biz / Link / Reputation */

function NotifyForm({ placeholder = "you@crew.com", cta = "Notify me" }) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const onSubmit = (e) => { e.preventDefault(); if (email) setSubmitted(true); };
  if (submitted) {
    return (
      <div className="preview__form" style={{alignItems:"center"}}>
        <div className="pill pill--success">
          <Icon.Check style={{width:13, height:13}}/> You're on the list — {email}
        </div>
      </div>
    );
  }
  return (
    <form className="preview__form" onSubmit={onSubmit}>
      <input
        className="input"
        type="email" required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn--primary" type="submit">{cta}</button>
    </form>
  );
}

/* --- Stylized mockup art for each sub-brand's stage --- */

function BizMock() {
  return (
    <svg viewBox="0 0 400 320" width="80%" height="80%" role="img" aria-label="Shmo Biz product mock">
      {/* phone card */}
      <g transform="translate(70 46)">
        <rect x="0" y="0" width="260" height="200" rx="16" fill="#FFFFFF" stroke="rgba(26,26,26,0.12)"/>
        <rect x="18" y="20" width="40" height="40" rx="12" fill="#1E2A78"/>
        <text x="38" y="46" textAnchor="middle" fontFamily="Inter Tight" fontWeight="700" fontSize="18" fill="#FFFFFF">B</text>
        <rect x="72" y="24" width="120" height="10" rx="3" fill="#1A1A1A"/>
        <rect x="72" y="40" width="80"  height="8"  rx="3" fill="rgba(26,26,26,0.25)"/>
        <line x1="18" y1="80" x2="242" y2="80" stroke="rgba(26,26,26,0.08)"/>
        <rect x="18" y="96"  width="224" height="10" rx="3" fill="rgba(26,26,26,0.2)"/>
        <rect x="18" y="114" width="180" height="10" rx="3" fill="rgba(26,26,26,0.15)"/>
        <rect x="18" y="138" width="90" height="28" rx="6" fill="#1A1A1A"/>
        <rect x="116" y="138" width="90" height="28" rx="6" fill="rgba(26,26,26,0.08)"/>
      </g>
      {/* tap ripple */}
      <g transform="translate(200 30)" stroke="#1E2A78" fill="none" strokeWidth="1.4" strokeLinecap="round" opacity="0.5">
        <path d="M-10 6 a10 10 0 0 1 20 0"/>
        <path d="M-16 6 a16 16 0 0 1 32 0"/>
      </g>
    </svg>
  );
}

function LinkMock() {
  return (
    <svg viewBox="0 0 400 320" width="78%" height="78%" role="img" aria-label="Shmo Link product mock">
      <g transform="translate(110 44)">
        <rect x="0" y="0" width="180" height="232" rx="22" fill="#FFFFFF" stroke="rgba(26,26,26,0.12)"/>
        <rect x="14" y="18" width="152" height="36" rx="10" fill="#F5B83D"/>
        <text x="90" y="42" textAnchor="middle" fontFamily="Inter Tight" fontWeight="600" fontSize="13" fill="#1A1A1A">Menu</text>
        <rect x="14" y="64" width="152" height="36" rx="10" fill="rgba(26,26,26,0.06)"/>
        <text x="90" y="88" textAnchor="middle" fontFamily="Inter Tight" fontWeight="500" fontSize="12" fill="#1A1A1A">Book a table</text>
        <rect x="14" y="110" width="152" height="36" rx="10" fill="rgba(26,26,26,0.06)"/>
        <text x="90" y="134" textAnchor="middle" fontFamily="Inter Tight" fontWeight="500" fontSize="12" fill="#1A1A1A">Today's specials</text>
        <rect x="14" y="156" width="152" height="36" rx="10" fill="rgba(26,26,26,0.06)"/>
        <text x="90" y="180" textAnchor="middle" fontFamily="Inter Tight" fontWeight="500" fontSize="12" fill="#1A1A1A">Instagram</text>
        <text x="90" y="216" textAnchor="middle" fontFamily="Fraunces" fontStyle="italic" fontSize="11" fill="rgba(26,26,26,0.5)">tap to view</text>
      </g>
    </svg>
  );
}

function RepMock() {
  return (
    <svg viewBox="0 0 400 320" width="86%" height="86%" role="img" aria-label="Shmo Reputation dashboard mock">
      <g transform="translate(28 28)">
        <rect x="0" y="0" width="344" height="264" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
        {/* header */}
        <rect x="18" y="18" width="110" height="12" rx="3" fill="rgba(255,255,255,0.7)"/>
        <rect x="18" y="36" width="70"  height="8"  rx="3" fill="rgba(255,255,255,0.3)"/>
        {/* metric cards */}
        {[0,1,2].map(i => (
          <g key={i} transform={`translate(${18 + i*108} 64)`}>
            <rect x="0" y="0" width="96" height="72" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)"/>
            <rect x="12" y="12" width="36" height="8" rx="3" fill="rgba(255,255,255,0.4)"/>
            <text x="12" y="52" fontFamily="Inter Tight" fontWeight="600" fontSize="22" fill="#FFFFFF">{["4.8","312","+27"][i]}</text>
          </g>
        ))}
        {/* review rows */}
        {[0,1,2].map(i => (
          <g key={i} transform={`translate(18 ${156 + i*30})`}>
            <circle cx="10" cy="10" r="8" fill={["#F5B83D","#267D3D","#E74C2E"][i]}/>
            <rect x="26" y="4" width="180" height="6" rx="3" fill="rgba(255,255,255,0.7)"/>
            <rect x="26" y="14" width="120" height="5" rx="2" fill="rgba(255,255,255,0.3)"/>
            <rect x="240" y="4" width="60" height="16" rx="8" fill="rgba(245,184,61,0.2)" stroke="#F5B83D" strokeOpacity="0.6"/>
          </g>
        ))}
      </g>
    </svg>
  );
}

const PREVIEWS = [
  {
    key: "biz",
    eyebrow: "Sub-brand · Coming Q2",
    titleBefore: "One business card for the whole ",
    titleEm: "crew",
    titleAfter: ".",
    body: "Stop reprinting cards every time someone changes roles. Shmo Biz gives every team member an NFC business card that lives in your dashboard — update the title once, it updates everywhere. LinkedIn, vCard, email signature, all in one tap.",
    stageClass: "preview__stage--biz",
    right: false,
    Mock: BizMock,
  },
  {
    key: "link",
    eyebrow: "Sub-brand · Coming Q3",
    titleBefore: "One tap, any ",
    titleEm: "destination",
    titleAfter: ".",
    body: "Menu on Mondays, specials on Fridays, a booking page for the weekend. Shmo Link cards rotate their destination from the dashboard — no reprinting, no QR gymnastics. Perfect for restaurants, salons, and any crew that changes what they're promoting week to week.",
    stageClass: "preview__stage--link",
    right: true,
    Mock: LinkMock,
  },
  {
    key: "rep",
    eyebrow: "Sub-brand · Coming Q4",
    titleBefore: "See every review. Respond ",
    titleEm: "on purpose",
    titleAfter: ".",
    body: "A single inbox for Google, Yelp, Facebook and more. Sentiment flags, response templates, near-miss rescues. Built for owner-operators who can't spend Saturday morning copy-pasting thank-yous.",
    stageClass: "preview__stage--rep",
    right: false,
    Mock: RepMock,
  },
];

function PreviewRow({ item }) {
  const Mock = item.Mock;
  return (
    <article className={`preview ${item.right ? "preview--right" : ""}`}>
      <div className="preview__copy">
        <div className="preview__eyebrow">
          <span className="dot"/> {item.eyebrow}
        </div>
        <h3 className="preview__title">
          {item.titleBefore}<em>{item.titleEm}</em>{item.titleAfter}
        </h3>
        <p className="preview__body">{item.body}</p>
        <NotifyForm/>
        <p className="preview__note">No spam. One email when it's ready, that's it.</p>
      </div>
      <div className={`preview__stage ${item.stageClass}`}>
        <Mock/>
      </div>
    </article>
  );
}

function PreviewsSection() {
  return (
    <section className="hsection">
      <div className="hsection__head">
        <div>
          <div className="hsection__eyebrow">Coming next</div>
          <h2 className="hsection__title">
            Three more sub-brands, rolling out through <em>next year</em>.
          </h2>
        </div>
        <p className="hsection__lede">
          Each one solves a different customer-facing moment for crews.
          Same cards, same dashboard, just more jobs they can do.
        </p>
      </div>
      <div className="hsection__body" id="biz">
        {PREVIEWS.map((p, i) => (
          <React.Fragment key={p.key}>
            <PreviewRow item={p}/>
            {i < PREVIEWS.length - 1 && <hr style={{border:0, borderTop:"1px solid var(--hair)", margin:"16px 0"}}/>}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { PreviewsSection });
