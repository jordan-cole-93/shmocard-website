// components/shmo-review/cr-80/SetupSteps.tsx
// "How it works" — 3-step numbered setup for the CR-80 PDP.
// Composes .shm-step family from components.css. Server component.

import { Section } from "@/components/layout/Section";

const steps = [
  {
    num: 1,
    title: "You send your Google review link at checkout",
    body: "We burn your Google review URL into the chip at print time. Every card ships pre-programmed to your shop — no app, no setup, no QR sticker to apply.",
  },
  {
    num: 2,
    title: "Hand a card after every transaction",
    body: "One card per crew member, kept in the back pocket. After a sale, the cashier offers the card with the receipt. The whole crew is in the review pipeline — not just whoever's near the counter sign.",
  },
  {
    num: 3,
    title: "Customer taps. Review page opens. Five stars.",
    body: "iPhone XS and newer plus most Android phones tap straight into the Google review page. Older phones use the QR code printed on the back. Either path, the customer lands on your review form in under two seconds.",
  },
];

export default function SetupSteps() {
  return (
    <Section bg="graham" nextBg="marsh">
      <div className="setup-steps__head">
        <span className="shm-eyebrow">How it works</span>
        <h2 className="shm-h2">
          Three taps from the box to a <em>five-star</em> review.
        </h2>
      </div>
      <div className="setup-steps__grid">
        {steps.map((step) => (
          <div key={step.num} className="shm-step">
            <div className="shm-step__num">{step.num}</div>
            <p className="shm-step__title">{step.title}</p>
            <p className="shm-step__body">{step.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
