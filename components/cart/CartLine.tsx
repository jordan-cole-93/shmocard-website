"use client";

import { useState, useTransition } from "react";

import CartQty from "./CartQty";
import { removeCartLine, updateCartLine } from "./actions";
import { mapShopifyCartLines } from "./useCartHydration";
import { useCartStore } from "./store";
import type { CartLine as CartLineType } from "./types";

type CartLineProps = {
  line: CartLineType;
};

export default function CartLine({ line }: CartLineProps) {
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setCart = useCartStore((s) => s.setCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const lineTotal = (Number(line.price) * line.quantity).toFixed(2);

  const onQty = (next: number) => {
    setError(null);
    // Optimistic local update.
    updateQuantity(line.id, next);

    startTransition(async () => {
      try {
        const cart = await updateCartLine(line.id, next);
        setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed");
        // Rollback by re-syncing from local store on next mutation; we
        // leave the optimistic state for now to avoid flicker.
      }
    });
  };

  const onRemove = () => {
    setError(null);
    removeLine(line.id);

    startTransition(async () => {
      try {
        const cart = await removeCartLine(line.id);
        setCart(cart.id, cart.checkoutUrl, mapShopifyCartLines(cart));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Remove failed");
      }
    });
  };

  return (
    <article
      className={"shm-cart-item" + (busy ? " is-loading" : "")}
      data-line-id={line.id}
    >
      <div className="shm-cart-item__thumb">
        {line.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={line.imageUrl} alt={line.imageAlt} />
        ) : null}
      </div>
      <div className="shm-cart-item__main">
        <h3 className="shm-cart-item__name">{line.title}</h3>
        <span className="shm-cart-item__price">${lineTotal}</span>
        {line.variantTitle ? (
          <p className="shm-cart-item__meta">
            <span>
              <b>Option:</b> {line.variantTitle}
            </span>
          </p>
        ) : null}
        <div className="shm-cart-item__row">
          <CartQty value={line.quantity} onChange={onQty} busy={busy} />
          <button
            type="button"
            className="shm-cart-item__remove"
            onClick={onRemove}
            disabled={busy}
          >
            Remove
          </button>
        </div>
        {error ? (
          <p className="shm-cart-item__meta" role="alert">
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}
