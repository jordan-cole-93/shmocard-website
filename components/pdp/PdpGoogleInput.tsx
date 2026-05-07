"use client";

// components/pdp/PdpGoogleInput.tsx
// Captures the buyer's Google review URL. Client component.
//
// The value is held in PdpBuyboxContext so PdpAddToCart can attach it
// as a Storefront cart-line attribute (key: 'google_review_url').
// We never render the value as HTML — it's plain text only, surfaced
// to fulfillment via the Shopify Admin order detail.

import { usePdpBuybox } from "./PdpBuyboxContext";

export default function PdpGoogleInput() {
  const { googleUrl, setGoogleUrl } = usePdpBuybox();

  return (
    <div className="pdp-config">
      <span className="pdp-config__label">Configure (optional)</span>
      <div className="shm-google">
        <span className="shm-google__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path
              d="M21.35 11.1H12v3.83h5.51c-.25 1.37-1.5 4-5.51 4-3.31 0-6.01-2.74-6.01-6.12 0-3.38 2.7-6.13 6.01-6.13 1.88 0 3.14.8 3.86 1.49l2.63-2.55C16.85 4.06 14.65 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.78 0-.59-.06-1.04-.13-1.5z"
              fill="#EA4335"
            />
            <path
              d="M21.35 11.1H12v3.83h5.51a5.61 5.61 0 0 1-2.4 3.66l3.86 2.99c2.25-2.08 3.55-5.13 3.55-8.98 0-.59-.06-1.04-.13-1.5z"
              fill="#4285F4"
            />
            <path
              d="M5.99 14.32a5.99 5.99 0 0 1 0-4.64L2.13 6.69a9 9 0 0 0 0 10.62l3.86-2.99z"
              fill="#FBBC05"
            />
            <path
              d="M12 21c2.65 0 4.85-.87 6.47-2.42l-3.86-2.99c-1.05.7-2.42 1.18-3.61 1.18-2.78 0-5.13-1.84-5.97-4.45L2.13 14.3C3.92 18.27 7.65 21 12 21z"
              fill="#34A853"
            />
          </svg>
        </span>
        <input
          type="url"
          className="shm-google__input"
          placeholder="Paste your Google review link"
          value={googleUrl}
          onChange={(e) => setGoogleUrl(e.target.value)}
          maxLength={512}
          autoComplete="off"
          spellCheck={false}
          inputMode="url"
        />
      </div>
      <div className="pdp-config__hint">
        Paste your link and we&apos;ll pre-program every card before it ships. Skip
        and configure after delivery.
      </div>
    </div>
  );
}
