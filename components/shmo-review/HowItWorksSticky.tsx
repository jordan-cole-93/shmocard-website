"use client";

// components/shmo-review/HowItWorksSticky.tsx
// Scroll-driven 4-step explainer with a sticky phone column on the left
// and steps scrolling on the right. IntersectionObserver advances the
// active step (and therefore the active phone screen).
//
// Design-system note: the Claude Design output used CSS linear-gradients
// + hex color literals on the phone-screen mocks. Both violate the
// design system (no gradients; tokens not hex). The phone screens have
// been rewritten with solid tokens (cream / cocoa-deep / marshmallow /
// clover). Animations are kept (card-tilt, tap-ring, star-pop, check-pop)
// — animations don't violate the soft-neobrutalism aesthetic.

import { useEffect, useRef, useState } from "react";
import { REVIEW_HOW_STEPS, type ReviewHowStep } from "./data";

function PhoneScreen({ which }: { which: ReviewHowStep["screen"] }) {
  if (which === "handoff") {
    return (
      <div className="rev-phone-screen rev-phone-screen--handoff">
        <div className="rev-phone-screen__card">
          <div className="rev-phone-screen__card-logo">SHOP</div>
          <div className="rev-phone-screen__card-name">Tap to leave a review</div>
        </div>
        <div className="rev-phone-screen__caption">Handing over the card</div>
      </div>
    );
  }
  if (which === "tap") {
    return (
      <div className="rev-phone-screen rev-phone-screen--tap">
        <div className="rev-phone-tap-indicator">
          <span className="rev-phone-tap-indicator__dot" />
          <span className="rev-phone-tap-indicator__ring" />
          <span className="rev-phone-tap-indicator__ring rev-phone-tap-indicator__ring--2" />
        </div>
        <div className="rev-phone-screen__notif">
          <div className="rev-phone-screen__notif-title">Open in browser</div>
          <div className="rev-phone-screen__notif-sub">g.page/your-shop/review</div>
        </div>
        <div className="rev-phone-screen__caption">Tap detected · opening</div>
      </div>
    );
  }
  if (which === "review") {
    return (
      <div className="rev-phone-screen rev-phone-screen--review">
        <div className="rev-phone-review-card">
          <div className="rev-phone-review-card__head">
            <div className="rev-phone-review-card__shop">Your Shop</div>
            <div className="rev-phone-review-card__addr">123 Main St · Open now</div>
          </div>
          <div className="rev-phone-review-card__label">Rate your experience</div>
          <div className="rev-phone-review-card__stars" key={which}>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className="rev-phone-review-card__star"
                aria-hidden="true"
              >
                <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
              </svg>
            ))}
          </div>
          <div className="rev-phone-review-card__textbox">
            Tell others what you liked…
          </div>
          <div className="rev-phone-review-card__post">Post review</div>
        </div>
        <div className="rev-phone-screen__caption">Google review form</div>
      </div>
    );
  }
  // submitted
  return (
    <div className="rev-phone-screen rev-phone-screen--submitted">
      <div className="rev-phone-submitted">
        <div className="rev-phone-submitted__check" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="rev-phone-submitted__title">Posted</div>
        <div className="rev-phone-submitted__sub">Thanks for the 5-star review</div>
        <div className="rev-phone-submitted__stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <svg key={i} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="rev-phone-screen__caption">Five stars · one sentence</div>
    </div>
  );
}

export default function HowItWorksSticky() {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(
              (e.target as HTMLElement).dataset.idx ?? "0",
            );
            setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = REVIEW_HOW_STEPS[activeIdx] ?? REVIEW_HOW_STEPS[0];

  return (
    <>
      <div className="shm-section-head">
        <span className="shm-eyebrow">How it works · 4 steps · ~12 seconds</span>
        <h2 className="shm-h2">
          From handoff to <em>five stars</em>, in one tap.
        </h2>
      </div>

      <div className="rev-how-stage">
        <div className="rev-how-stage__phone-col">
          <div className="rev-how-stage__phone-sticky">
            <div className="rev-phone-frame">
              <div className="rev-phone-frame__notch" aria-hidden="true" />
              <div className="rev-phone-frame__screen">
                <PhoneScreen which={active.screen} />
              </div>
              <div className="rev-phone-frame__home" aria-hidden="true" />
            </div>
            <div className="rev-how-stage__progress" aria-hidden="true">
              {REVIEW_HOW_STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className={`rev-how-stage__pip${i === activeIdx ? " is-active" : ""}`}
                >
                  {s.n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ol className="rev-how-stage__steps">
          {REVIEW_HOW_STEPS.map((step, i) => (
            <li
              key={step.n}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-idx={i}
              className={`rev-how-stage__step${i === activeIdx ? " is-active" : ""}`}
            >
              <div className="rev-how-stage__step-num">{step.n}</div>
              <h3 className="rev-how-stage__step-title">{step.title}</h3>
              <p className="rev-how-stage__step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
