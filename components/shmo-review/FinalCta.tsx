// components/shmo-review/FinalCta.tsx
// Ember-section close-out CTA. Server component.
// Text colors flip automatically via .shm-bg-ember cascade in
// colors_and_type.css — no explicit color rules needed.
// `.shm-btn--cream` lives in components.css; `.shm-btn--ghost` auto-flips
// to on-dark inside .shm-bg-ember.

export default function FinalCta() {
  return (
    <div className="rev-final-cta">
      <span className="shm-eyebrow">Ready to ship</span>
      <h2 className="shm-h1">
        Pick a format. <em>Add to cart.</em>
        <br />
        Tap for stars next Monday.
      </h2>
      <p className="rev-final-cta__lede">
        Orders by Tuesday 5pm CT ship Friday. Bulk packs (10+) ship free
        expedited. 60-day returns, no questions.
      </p>
      <div className="rev-final-cta__row">
        <a className="shm-btn shm-btn--cream shm-btn--lg" href="#buybox">
          Shop the cards →
        </a>
        <a className="shm-btn shm-btn--ghost shm-btn--lg" href="#formats">
          Compare formats
        </a>
      </div>
    </div>
  );
}
