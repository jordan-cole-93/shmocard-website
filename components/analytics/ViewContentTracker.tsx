"use client";

// ViewContent dual-fire tracker — mounted as a client child of PDP
// server components. Fires browser fbq + server CAPI on mount with
// a shared event_id (Meta's 48-hour dedup window matches by event_id
// + event_name + Pixel ID).
//
// Sources content_ids from product GID (Best practice consensus per
// RESEARCH.md A2 — may revise to variant GID if Shopify channel app's
// Purchase payload uses variant GIDs).
//
// fbp / fbc cookies read from document.cookie (non-httpOnly — written
// by fbevents.js). May be empty on first PDP visit (Pitfall 7) — that's
// acceptable; persist across navigation for second-visit Match Quality.

import { useEffect, useRef } from "react";

import { trackViewContent } from "@/components/analytics/actions";
import { generateEventId } from "@/lib/analytics/event-id";
import { trackPixelEvent } from "@/lib/analytics/fbq";

type Props = {
  productId: string; // Shopify product GID
  defaultVariantId: string; // For Purchase-side alignment if we ever switch sources
  price: number; // Default variant price (number, not string)
  handle: string; // For event_source_url construction / debugging
};

export default function ViewContentTracker({
  productId,
  price,
  handle,
}: Props) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;

    const eventId = generateEventId();
    const params = {
      content_ids: [productId],
      content_type: "product" as const,
      value: price,
      currency: "USD" as const,
    };

    // Server fire — fire-and-forget. Independent of browser Pixel
    // load state; goes out immediately. Shared event_id dedupes against
    // the browser fire in Events Manager (48h window).
    trackViewContent({
      params,
      eventId,
      fbp: readCookie("_fbp") ?? undefined,
      fbc: readCookie("_fbc") ?? undefined,
      eventSourceUrl: window.location.href,
    }).catch(() => {
      // Server Action already swallows internally — extra catch is
      // defensive against React rejection-warning noise.
    });

    // Browser fire — fbq may not yet be defined on first effect tick
    // because `next/script strategy=afterInteractive` loads the Pixel
    // base AFTER hydration. Poll briefly until fbq is ready, then fire
    // with the shared eventId. Set firedRef only after the fbq attempt
    // so a transient script-load race doesn't permanently skip the fire.
    const start = Date.now();
    const tryFire = () => {
      if (typeof window.fbq === "function") {
        trackPixelEvent("ViewContent", params, eventId);
        firedRef.current = true;
        return;
      }
      if (Date.now() - start > 5000) {
        // 5s budget — accept that the browser fire missed (server fire
        // still landed; CAPI alone is acceptable for ad-blocked traffic).
        firedRef.current = true;
        return;
      }
      window.setTimeout(tryFire, 100);
    };
    tryFire();
  }, [productId, price, handle]);

  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
