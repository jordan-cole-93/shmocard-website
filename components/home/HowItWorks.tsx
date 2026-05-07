// components/home/HowItWorks.tsx
// Server component. 3-column grid, 6 steps locked per CONTEXT.md B4.

import "./home.css";
import Section from "@/components/layout/Section";
import { HOW_STEPS } from "./home-data";

export default function HowItWorks() {
  return (
    <Section bg="marsh" nextBg="marsh" id="how" ariaLabel="How it works">
      <div className="shm-section-head" style={{ textAlign: "center" }}>
        <span className="shm-eyebrow">How it works</span>
        <h2 className="shm-h2">Six steps. No app. No login.</h2>
        <p className="shm-lede" style={{ maxWidth: "56ch", margin: "0 auto" }}>
          Every card ships pre-programmed. Customers tap, the review page opens, they leave a review.
        </p>
      </div>
      <ol className="how-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {HOW_STEPS.map((s) => (
          <li key={s.n} className="shm-card how-step">
            <div className="how-step__num">{s.n}</div>
            <div className="how-step__title">{s.title}</div>
            <p className="how-step__body">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
