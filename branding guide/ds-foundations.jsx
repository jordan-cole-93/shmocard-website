/* =========================================================
   Foundations — voice, principles, mascot library
   ========================================================= */

function Foundations() {
  return (
    <section className="ds-section" id="Foundations">
      <SectionHead
        num="01 · Foundations"
        title="A {em} system for local business."
        em="warm, professional"
        desc="Shmocard sells a physical product to busy small-business owners. The system has to read as friendly enough to be human, and credible enough to be trusted with their reputation. Sans-serif as the dominant voice, serif italic as accent, warm palette used sparingly."
      />

      <div className="grid-3">
        <PrincipleCard
          n="01"
          title="Warm, not cute"
          desc="Friendly and human, but never childish. We want a salon owner to recognize a real tool, not a toy."
        />
        <PrincipleCard
          n="02"
          title="Clear over clever"
          desc="Plain language, real numbers, real timestamps. Microcopy explains; it doesn't perform."
        />
        <PrincipleCard
          n="03"
          title="Mascot as accent"
          desc="Shmo lives in marketing moments — heroes, mailers, packaging. Never in the product chrome."
        />
        <PrincipleCard
          n="04"
          title="Hairlines &amp; soft shadows"
          desc="Refined chrome over chunky outlines. The product looks like Linear or Stripe, not Gumroad."
        />
        <PrincipleCard
          n="05"
          title="Sans dominant"
          desc="Inter Tight carries the weight. Fraunces italic appears once or twice per scene as editorial accent."
        />
        <PrincipleCard
          n="06"
          title="Color with restraint"
          desc="Warm palette stays. Cream and white as primary surfaces. Tomato and honey as accents, not floods."
        />
      </div>

      {/* Voice section */}
      <div className="mt-48 grid-2" style={{gap: 32}}>
        <div className="card card--lg">
          <div className="card__kicker">Voice — yes</div>
          <h3 className="card__title" style={{fontSize: 20, marginBottom: 16}}>Confident, calm, on your side.</h3>
          <ul style={{margin: 0, paddingLeft: 18, color: "var(--ink-3)", fontSize: 14, lineHeight: 1.7}}>
            <li>"Turn happy customers into <span className="ds-italic">five-star</span> reviews."</li>
            <li>"One tap. No app. No typing."</li>
            <li>"You're at <strong>4.9 stars</strong> — up 0.2 this month."</li>
            <li>"We caught a 3-star review. Want to respond?"</li>
          </ul>
        </div>
        <div className="card card--lg">
          <div className="card__kicker" style={{color: "var(--warn)"}}>Voice — no</div>
          <h3 className="card__title" style={{fontSize: 20, marginBottom: 16}}>Avoid hype, jargon, and shouting.</h3>
          <ul style={{margin: 0, paddingLeft: 18, color: "var(--ink-3)", fontSize: 14, lineHeight: 1.7, textDecoration: "line-through", textDecorationColor: "var(--hair-3)"}}>
            <li>"TAP. REVIEW. GET FOUND."</li>
            <li>"Revolutionary AI-powered reputation orchestration."</li>
            <li>"🔥 Crush your competitors with 5-star firepower 🔥"</li>
            <li>"Synergize your review velocity."</li>
          </ul>
        </div>
      </div>

      {/* Mascot library */}
      <div className="mt-48">
        <div className="ds-eyebrow" style={{marginBottom: 12}}>Mascot · Shmo</div>
        <h3 style={{fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", margin: "0 0 8px"}}>
          Meet Shmo — the friend behind the card.
        </h3>
        <p className="ds-lede" style={{maxWidth: "60ch", margin: "0 0 28px"}}>
          Shmo is the brand's warmth. Use him in marketing moments where a human face helps: hero illustrations, packaging, mailers, stickers, customer emails. <strong style={{color: "var(--ink)"}}>Don't use Shmo inside the product UI</strong> — the dashboard is a tool, and tools earn trust by getting out of the way.
        </p>

        <div className="grid-4">
          {[
            { src: "hero-charge",     name: "Charging",   use: "Bold hero, primary CTA"},
            { src: "hero-welcoming",  name: "Welcoming",  use: "Onboarding, intro"},
            { src: "hero-solo",       name: "Solo wave",  use: "Avatar, profile"},
            { src: "hero-toolkit",    name: "Toolkit",    use: "Product overview"},
            { src: "hero-crew",       name: "Crew",       use: "Team, community"},
            { src: "celebrating",     name: "Celebrating",use: "Milestones, success"},
            { src: "pointing",        name: "Pointing",   use: "Feature callout"},
            { src: "confused",        name: "Confused",   use: "Empty state, errors"},
          ].map(m => (
            <div key={m.src} className="card" style={{padding: 0, overflow: "hidden"}}>
              <div style={{aspectRatio: "1", background: "var(--snow)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16}}>
                <img src={`assets/mascot/${m.src}.png`} alt="" style={{width: "100%", height: "100%", objectFit: "contain"}}/>
              </div>
              <div style={{padding: "12px 14px", borderTop: "1px solid var(--hair)"}}>
                <div style={{fontSize: 13, fontWeight: 600}}>{m.name}</div>
                <div style={{fontSize: 12, color: "var(--muted)", marginTop: 2}}>{m.use}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({ n, title, desc }) {
  return (
    <div className="card card--lg">
      <div style={{fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--tomato)", fontSize: 13, marginBottom: 8}}>{n}</div>
      <h3 className="card__title" style={{fontSize: 18, marginBottom: 8}} dangerouslySetInnerHTML={{__html: title}}/>
      <p className="card__desc">{desc}</p>
    </div>
  );
}

Object.assign(window, { Foundations });
