// components/shmo-review/HowItWorks.tsx — four-step flow, one Section per step.
//
// Each step lives in its own <Section> with alternating cream / marsh backgrounds,
// separated by wave dividers (rendered as siblings via the Section primitive).
// No framer-motion, no sticky stacking, no .shm-card wrapper.

import Section from "@/components/layout/Section";

const STARS = [0, 1, 2, 3, 4];

type Screen = "handoff" | "tap" | "review" | "submitted";

const REVIEW_HOW_STEPS: Array<{
  n: string;
  title: string;
  body: string;
  screen: Screen;
  details: string[];
}> = [
  {
    n: "01",
    title: "Crew hands the card",
    body: "After every transaction, an employee hands the customer the card. The ask happens at the right moment — when the customer is happy.",
    screen: "handoff",
    details: ["Best after checkout", "Lives with the crew", "No counter card"],
  },
  {
    n: "02",
    title: "Customer taps the back of their phone",
    body: "iPhone XS+ and Android 5+ have NFC built in. The card sends a signed URL straight to their browser — no app, no login.",
    screen: "tap",
    details: ["No app", "No login", "NFC plus QR fallback"],
  },
  {
    n: "03",
    title: "Your Google review page opens",
    body: "Their browser jumps straight to your review form. They see your shop name, your photos, your star rating.",
    screen: "review",
    details: ["Direct Google link", "Shop context visible", "Fewer taps"],
  },
  {
    n: "04",
    title: "Five stars, one sentence",
    body: "They tap five and type. The whole thing takes seconds. You get a verified Google review, by the next time you check.",
    screen: "submitted",
    details: ["Posted in seconds", "Verified review", "Fresh local proof"],
  },
];

function PhoneScreen({ which }: { which: Screen }) {
  if (which === "handoff") {
    return (
      <div className="phone-screen phone-screen--handoff">
        <div className="phone-screen__hand">
          <div className="phone-screen__card">
            <div className="phone-screen__card-logo">SHOP</div>
            <div className="phone-screen__card-name">Tap to leave a review</div>
            <div className="phone-screen__card-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12c2.5-2.5 5-2.5 7.5 0M5 16c1-1 2-1 3 0M2 8c4-4 8-4 12 0M5 4c2-2 4-2 6 0" />
              </svg>
            </div>
          </div>
        </div>
        <div className="phone-screen__caption">Handing over the card</div>
      </div>
    );
  }

  if (which === "tap") {
    return (
      <div className="phone-screen phone-screen--tap">
        <div className="phone-tap-indicator">
          <span className="phone-tap-indicator__dot" />
          <span className="phone-tap-indicator__ring" />
          <span className="phone-tap-indicator__ring phone-tap-indicator__ring--2" />
        </div>
        <div className="phone-screen__notif">
          <div className="phone-screen__notif-bar">
            <span className="phone-screen__notif-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 4v16M4 12h16" />
              </svg>
            </span>
            <div>
              <div className="phone-screen__notif-title">Open in Safari</div>
              <div className="phone-screen__notif-sub">g.page/shop-name/review</div>
            </div>
          </div>
        </div>
        <div className="phone-screen__caption">Tap detected · opening</div>
      </div>
    );
  }

  if (which === "review") {
    return (
      <div className="phone-screen phone-screen--review">
        <div className="phone-review-card">
          <div className="phone-review-card__head">
            <div className="phone-review-card__shop">Your Shop</div>
            <div className="phone-review-card__addr">123 Main St · Open now</div>
          </div>
          <div className="phone-review-card__rate">
            <div className="phone-review-card__label">Rate your experience</div>
            <div className="phone-review-card__stars">
              {STARS.map((i) => (
                <svg key={i} viewBox="0 0 24 24" className="phone-review-card__star" aria-hidden="true">
                  <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="phone-review-card__textbox">
            <span className="phone-review-card__placeholder">Tell others what you liked…</span>
          </div>
          <div className="phone-review-card__post">Post review</div>
        </div>
        <div className="phone-screen__caption">Google review form</div>
      </div>
    );
  }

  // submitted
  return (
    <div className="phone-screen phone-screen--submitted">
      <div className="phone-submitted">
        <div className="phone-submitted__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="phone-submitted__title">Posted</div>
        <div className="phone-submitted__sub">Thanks for the 5-star review</div>
        <div className="phone-submitted__stars">
          {STARS.map((i) => (
            <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="phone-screen__caption">Five stars · one sentence</div>
    </div>
  );
}

export default function HowItWorks() {
  const bgs: Array<"cream" | "marsh"> = ["cream", "marsh", "cream", "marsh"];
  const nextBgs: Array<"marsh" | "cream"> = ["marsh", "cream", "marsh", "cream"];

  return (
    <>
      {REVIEW_HOW_STEPS.map((step, i) => (
        <Section
          key={step.n}
          bg={bgs[i]}
          nextBg={nextBgs[i]}
          id={i === 0 ? "how" : undefined}
          ariaLabel={i === 0 ? "How Shmo Review works" : undefined}
          className="how-step-section"
        >
          {i === 0 && (
            <div className="shm-section-head how-step-head">
              <span className="shm-eyebrow">How it works · 4 steps · ~12 seconds</span>
              <h2 className="shm-h2">
                From handoff to <em>five stars</em>, in one tap.
              </h2>
            </div>
          )}

          <article className={`how-warm-step${i % 2 ? " is-reverse" : ""}`}>
            <div className="how-warm-step__copy">
              <span className="shm-badge shm-badge--sm shm-badge--ember how-warm-step__num">
                {step.n}
              </span>
              <h3 className="how-warm-step__title">{step.title}</h3>
              <p className="how-warm-step__body">{step.body}</p>
              <ul className="how-warm-step__details" aria-label={`${step.title} details`}>
                {step.details.map((detail) => (
                  <li key={detail} className="shm-badge shm-badge--honey">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="how-warm-step__visual" aria-hidden="true">
              <div className="phone-frame phone-frame--mini">
                <div className="phone-frame__notch" />
                <div className="phone-frame__screen">
                  <PhoneScreen which={step.screen} />
                </div>
                <div className="phone-frame__home" />
              </div>
            </div>
          </article>
        </Section>
      ))}
    </>
  );
}
