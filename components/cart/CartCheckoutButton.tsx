"use client";

import { useState, useTransition } from "react";

import { assertCheckoutUrl } from "./actions";

type CartCheckoutButtonProps = {
  checkoutUrl: string | null;
  /** Disable when there are no lines. */
  disabled?: boolean;
  /** Optional total to show in the CTA copy. */
  totalLabel?: string;
};

export default function CartCheckoutButton({
  checkoutUrl,
  disabled = false,
  totalLabel,
}: CartCheckoutButtonProps) {
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!checkoutUrl) return;
    setError(null);

    startTransition(async () => {
      try {
        // Open-redirect guard (T-03-08-01) — runs server-side.
        const safeUrl = await assertCheckoutUrl(checkoutUrl);
        if (typeof window !== "undefined") {
          window.location.href = safeUrl;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout unavailable");
      }
    });
  };

  const isDisabled = disabled || busy || !checkoutUrl;

  return (
    <>
      <button
        type="button"
        className="shm-cart-cta"
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {busy ? "Redirecting…" : totalLabel ? `Tap to checkout — ${totalLabel}` : "Tap to checkout"}
      </button>
      {error ? (
        <p className="shm-cart-summary__row" role="alert">
          <span>{error}</span>
        </p>
      ) : null}
    </>
  );
}
