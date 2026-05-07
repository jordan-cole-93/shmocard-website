"use client";

// Hardened checkout-trigger button (Plan 03-09).
//
// Flow:
//   1. Click → setIsNavigating(true) → useTransition starts.
//   2. Server Action `assertCheckoutUrl` validates host against the
//      allowlist (https only, no embedded creds, *.myshopify.com or
//      configured store domain). Throws on rejection.
//   3. On success → window.location.href = safeUrl (full navigation
//      to Shopify-hosted checkout).
//   4. On failure → setIsError(true), button copy switches to
//      "Checkout unavailable — please refresh"; underlying error is
//      console.error'd server-side via the Server Action throw, and
//      the rejected URL is NOT rendered in user UI (no leak).
//
// Mitigations:
//   - T-03-09-01 open-redirect: assertCheckoutUrl allowlist
//   - T-03-09-02 phishing: WHATWG URL parsing + hostname check
//   - T-03-09-03 double-click double-navigation: isNavigating guard

import { useState, useTransition } from "react";

import { assertCheckoutUrl } from "./actions";

type CartCheckoutButtonProps = {
  checkoutUrl: string | null;
  /** Disable when there are no lines. */
  disabled?: boolean;
  /** Optional total to show in the CTA copy. */
  totalLabel?: string;
};

const ERROR_COPY = "Checkout unavailable — please refresh";

export default function CartCheckoutButton({
  checkoutUrl,
  disabled = false,
  totalLabel,
}: CartCheckoutButtonProps) {
  const [busy, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = () => {
    // Guard against double-fire while a previous click is in flight or
    // the button is in an error state. (T-03-09-03)
    if (isNavigating || isError) return;
    if (!checkoutUrl) return;

    setIsNavigating(true);

    startTransition(async () => {
      try {
        // Open-redirect guard (T-03-09-01) — runs server-side.
        // Throws if the URL fails the allowlist; the thrown Error
        // surfaces here in the catch.
        const safeUrl = await assertCheckoutUrl(checkoutUrl);

        if (typeof window !== "undefined") {
          // Full navigation to Shopify-hosted checkout. We do NOT
          // reset isNavigating here — the page is unloading; leaving
          // the button locked prevents any re-fire on slow networks.
          window.location.href = safeUrl;
        }
      } catch (e) {
        // Log server-side via the thrown Error stack already; here we
        // only flip the UI to a non-leaky "unavailable" state. Do not
        // render the raw error message — it can include the rejected
        // host, which we don't want surfaced to end users.
        if (typeof console !== "undefined") {
          // eslint-disable-next-line no-console
          console.error("[checkout] guard rejected redirect", e);
        }
        setIsError(true);
        setIsNavigating(false);
      }
    });
  };

  const isDisabled =
    disabled || busy || isNavigating || isError || !checkoutUrl;

  let label: string;
  if (isError) {
    label = ERROR_COPY;
  } else if (isNavigating || busy) {
    label = "Redirecting…";
  } else if (totalLabel) {
    label = `Tap to checkout — ${totalLabel}`;
  } else {
    label = "Tap to checkout";
  }

  return (
    <>
      <button
        type="button"
        className="shm-cart-cta"
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-testid="cart-checkout-button"
      >
        {label}
      </button>
      {isError ? (
        <p className="shm-cart-summary__row" role="alert">
          <span>{ERROR_COPY}</span>
        </p>
      ) : null}
    </>
  );
}
