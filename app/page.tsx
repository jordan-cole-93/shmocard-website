// Homepage placeholder.
// Real homepage gets built in Phase 3 stage 3-Homepage following the section
// map in .planning/phases/02-design-system-review/TRANSLATION.md.

export default function HomePage() {
  return (
    <main className="shm-section shm-bg-marsh">
      <div className="shm-container">
        <span className="shm-eyebrow">Phase 3 — Foundations</span>
        <h1 className="shm-display">
          The toolkit your crew&apos;s been <em>missing</em>.
        </h1>
        <p className="shm-lede">
          Project shell is alive. Asset pipeline online — the mascot below loads
          from <code>public/mascot/</code>. <em>3-A2</em> migration complete.
        </p>

        {/* Mascot smoke test — confirms public/ → URL routing works. */}
        <img
          src="/mascot/mascot-holding-card.png"
          alt="Shmocard mascot holding a card"
          className="shm-mascot shm-mascot--supporting"
        />
      </div>
    </main>
  );
}
