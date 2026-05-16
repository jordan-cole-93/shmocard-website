"use client";

// CartMilestones — 4-dot progress ladder replacing CartFreeShipBand.
// Thresholds are hardcoded merchandising copy (not product attributes).
// Icons copied verbatim from the canonical Cart Drawer.html reference.

type CartMilestonesProps = {
  subtotal: number;
};

const IconApp = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="3" y="2" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
  </svg>
);

const IconGuide = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M3 3h7l3 3v7H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconShip = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="5" width="8" height="6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9.5 7h3l2 2v2h-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="5" cy="12" r="1.3" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="11.5" cy="12" r="1.3" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconGift = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="2" y="6" width="12" height="8" stroke="currentColor" strokeWidth="1.6" />
    <path d="M2 9h12M8 6v8" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M5 6c0-1.5 1-2.5 2-2.5s1 1 1 2.5M11 6c0-1.5-1-2.5-2-2.5s-1 1-1 2.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const MILESTONES = [
  { key: "app",   label: "Shmocard app",  at: 0,   icon: <IconApp /> },
  { key: "guide", label: "Free ebook",    at: 25,  icon: <IconGuide /> },
  { key: "ship",  label: "Free shipping", at: 75,  icon: <IconShip /> },
  { key: "gift",  label: "Mystery gift",  at: 120, icon: <IconGift /> },
] as const;

export default function CartMilestones({ subtotal }: CartMilestonesProps) {
  const fillTarget = MILESTONES.findIndex((m) => subtotal < m.at);
  const filledCount = fillTarget === -1 ? MILESTONES.length : fillTarget;
  const fillPct = ((filledCount - 1) / (MILESTONES.length - 1)) * 100;

  const nextMs = MILESTONES.find((m) => subtotal < m.at);
  const copy = nextMs ? (
    <>
      Spend <b>${(nextMs.at - subtotal).toFixed(2)}</b> more to unlock{" "}
      {nextMs.label.toLowerCase()}.
    </>
  ) : (
    <>
      You unlocked <b>everything</b>. Nice crew, nice work.
    </>
  );

  return (
    <div className="shm-cart-milestones">
      <p className="shm-cart-milestones__copy">{copy}</p>
      <div className="shm-cart-milestones__track">
        <div className="shm-cart-milestones__line">
          <div
            className="shm-cart-milestones__line-fill"
            style={{ width: Math.max(0, fillPct) + "%" }}
          />
        </div>
        {MILESTONES.map((m, i) => (
          <div
            key={m.key}
            className={"shm-cart-ms" + (i < filledCount ? " is-active" : "")}
          >
            <div className="shm-cart-ms__dot">{m.icon}</div>
            <div className="shm-cart-ms__label">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
