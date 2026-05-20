// Phase 4: email input is intentionally disabled. Phase 9 (backend wiring) must server-side validate + escape input before submission.
import type { ReactNode } from "react";
import Section from "@/components/layout/Section";

type ComingSoonProps = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  mascotPose?: string;
};

export default function ComingSoon({ eyebrow, title, lede, mascotPose }: ComingSoonProps) {
  return (
    <Section bg="marsh">
      <div className="shm-section-head">
        <span className="shm-eyebrow">{eyebrow}</span>
        <h1 className="shm-h1">{title}</h1>
        <p className="shm-lede">{lede}</p>
      </div>

      {/* Mascot — sticker sized via .shm-mascot--supporting (140px cap per components.css), optional */}
      {mascotPose ? (
        <img
          src={`/mascot/mascot-${mascotPose}.png`}
          alt=""
          className="shm-mascot shm-mascot--supporting"
          style={{ display: 'block', margin: '0 auto' }}
        />
      ) : null}

      {/* Disabled email-capture stub — per Jordan's locked D-01 (visible-but-disabled) */}
      {/* max-width constrains form to focal card width on desktop; full-width on mobile via width:100% */}
      <div style={{ maxWidth: '520px', width: '100%', margin: '0 auto' }}>
        <div className="shm-field">
          <label className="shm-field__label" htmlFor="coming-soon-email">
            Get notified when it&apos;s live
          </label>
          <input
            id="coming-soon-email"
            className="shm-input"
            type="email"
            placeholder="your@email.com"
            disabled
          />
          <button
            className="shm-btn shm-btn--primary"
            disabled
            type="button"
          >
            We&apos;ll let you know
          </button>
          <span className="shm-field__hint">We&apos;ll email you when this launches.</span>
        </div>
      </div>
    </Section>
  );
}
