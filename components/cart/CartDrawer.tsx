"use client";

// CartDrawer — top-level mounted-once cart UI.
//
// - Mounted globally via `app/layout.tsx`.
// - Portals to `document.body` so its stacking context is independent
//   of any ancestor transform / filter on `<main>`.
// - Reads UI state (`isOpen`) + cart data (lines / checkoutUrl) from
//   the Zustand store (`useCartStore`).
// - Calls `useCartHydration()` exactly once on mount to fetch the live
//   Storefront cart from the cookie (Cart Persistence Trap mitigation).
// - Slides in via framer-motion `motion.aside`. CSS keeps the static
//   `.shm-cart` class fallback for reduced-motion users.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./cart-drawer.css";

import CartCheckoutButton from "./CartCheckoutButton";
import CartEmpty from "./CartEmpty";
import CartFreeShipBand from "./CartFreeShipBand";
import CartHeader from "./CartHeader";
import CartLine from "./CartLine";
import CartPaymentsStrip from "./CartPaymentsStrip";
import CartScrim from "./CartScrim";
import CartSummary from "./CartSummary";
import CartTrustStrip from "./CartTrustStrip";
import { selectSubtotal, useCartStore } from "./store";
import { useCartHydration } from "./useCartHydration";

const DRAWER_TRANSITION = {
  duration: 0.32,
  ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
};

export default function CartDrawer() {
  // Runs once on first client mount — pulls live cart from cookie.
  useCartHydration();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);
  const subtotal = useCartStore(selectSubtotal);

  // Body-scroll lock while open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "shm-cart-locked";
    if (isOpen) {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
    } else {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    }
    return () => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    };
  }, [isOpen]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!mounted || typeof document === "undefined") return null;

  const totalLabel = `$${subtotal.toFixed(2)}`;
  const hasLines = lines.length > 0;

  return createPortal(
    <div className="shm-cart-portal">
      <AnimatePresence>
        {isOpen ? <CartScrim key="scrim" onClick={close} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            key="drawer"
            className="shm-cart is-open"
            aria-label="Shopping cart"
            aria-modal="true"
            role="dialog"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={DRAWER_TRANSITION}
          >
            <CartHeader />

            {hasLines ? (
              <>
                <CartFreeShipBand subtotal={subtotal} />
                <div className="shm-cart__body">
                  {lines.map((line) => (
                    <CartLine key={line.id} line={line} />
                  ))}
                </div>
                <footer className="shm-cart__foot">
                  <CartSummary subtotal={subtotal} />
                  <CartCheckoutButton
                    checkoutUrl={checkoutUrl}
                    disabled={!hasLines}
                    totalLabel={totalLabel}
                  />
                  <CartTrustStrip />
                  <CartPaymentsStrip />
                </footer>
              </>
            ) : (
              <div className="shm-cart__body">
                <CartEmpty />
              </div>
            )}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
