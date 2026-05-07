"use client";

// components/modals/WaitlistModal.tsx
//
// Waitlist capture modal for Shmo Biz / Link / Reputation (the three coming-soon
// sub-brands). Shmo Review never opens this modal — it routes to /shmo-review.
//
// REQ-08 — server action posts FormData to GHL webhook. Honeypot + email regex
// + product allowlist all live in the Server Action (lib/waitlist.ts).
//
// React 19 useActionState pattern — replaces `useFormState`. The action result
// drives the success-state replace.
//
// Threat mitigations (display side):
//   T-03-10-01: honeypot 'company_website' field present + visually hidden
//   T-03-10-04: never echo error text that exposes env var status

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useModalStore, type ModalProduct } from "./modal-store";
import { submitWaitlist, type WaitlistResult } from "@/lib/waitlist";

const PRODUCT_LABEL: Record<ModalProduct, string> = {
  biz: "Shmo Biz",
  link: "Shmo Link",
  reputation: "Shmo Reputation",
};

const ERROR_COPY: Record<
  Exclude<WaitlistResult, { ok: true }>["error"],
  string
> = {
  "invalid-email": "That email address doesn't look right. Try again?",
  "invalid-product": "Something went wrong. Refresh and try again.",
  "webhook-failed": "We couldn't reach our list right now. Try again in a sec?",
  "webhook-unreachable": "We couldn't reach our list right now. Try again in a sec?",
};

const INITIAL: WaitlistResult = { ok: false, error: "invalid-email" };

type Props = {
  product: ModalProduct;
  onClose: () => void;
};

async function action(_prev: WaitlistResult, formData: FormData): Promise<WaitlistResult> {
  return submitWaitlist(formData);
}

export default function WaitlistModal({ product, onClose }: Props) {
  const [state, formAction, isPending] = useActionState(action, INITIAL);
  // Track whether the user has actually attempted a submit — INITIAL is
  // structurally `{ ok: false }` but should NOT render an error before submit.
  const [submitted, setSubmitted] = useState(false);
  const headingId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus first input on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showSuccess = submitted && state.ok;
  const showError = submitted && !isPending && !state.ok;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      className="shm-modal shm-card shm-card--hard"
    >
      <button
        type="button"
        aria-label="Close"
        className="shm-modal__close"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 18 18 M18 6 6 18" />
        </svg>
      </button>

      {showSuccess ? (
        <div className="shm-modal__success">
          <span className="shm-eyebrow shm-modal__eyebrow">{PRODUCT_LABEL[product]}</span>
          <h2 id={headingId} className="shm-h3 shm-modal__h">
            Thanks — you're on the list.
          </h2>
          <p className="shm-lede shm-modal__lede">
            We'll let you know the moment {PRODUCT_LABEL[product]} ships. No spam, no extra
            mail — one note when it's live.
          </p>
          <button type="button" className="shm-btn shm-btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <>
          <div className="shm-modal__head">
            <span className="shm-eyebrow shm-modal__eyebrow">{PRODUCT_LABEL[product]}</span>
            <h2 id={headingId} className="shm-h3 shm-modal__h">
              Notify me when it's live.
            </h2>
            <p className="shm-lede shm-modal__lede">
              Pre-launch list. Drop your email — we'll let you know the day it ships, and
              that's it.
            </p>
          </div>

          <form
            action={(fd: FormData) => {
              setSubmitted(true);
              return formAction(fd);
            }}
            className="shm-modal__form"
            noValidate
          >
            {/* Hidden product slug — server-validates against allowlist regardless. */}
            <input type="hidden" name="product" value={product} />

            {/* Honeypot — bots fill, humans never see it. */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="shm-modal__honeypot"
              defaultValue=""
            />

            <input
              ref={inputRef}
              type="email"
              name="email"
              required
              placeholder="you@yourshop.com"
              autoComplete="email"
              className="shm-input"
              aria-label="Email address"
            />

            {showError && state.ok === false && (
              <p role="alert" className="shm-modal__error">
                {ERROR_COPY[state.error]}
              </p>
            )}

            <button
              type="submit"
              className="shm-btn shm-btn--primary"
              disabled={isPending}
            >
              {isPending ? "Sending…" : "Notify me"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
