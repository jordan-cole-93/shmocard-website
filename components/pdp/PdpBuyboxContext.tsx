"use client";

// components/pdp/PdpBuyboxContext.tsx
// Shared client state for the PDP buybox column.
//
// Lifts:
//   - selectedVariantId  (PdpPackSelector writes; PdpAddToCart + PdpStickyBar read)
//   - qty                (PdpQtyStepper writes; PdpAddToCart reads)
//   - googleUrl          (PdpGoogleInput writes; PdpAddToCart reads → cart line attribute)
//
// Why a context (not zustand): scope is a single PDP page tree; cart store
// is global and must not be polluted with PDP-form state. The default
// values come from the PdpBuyboxProvider's `defaultVariantId`.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PdpBuyboxState = {
  selectedVariantId: string | null;
  qty: number;
  googleUrl: string;
  setSelectedVariantId: (id: string) => void;
  setQty: (qty: number) => void;
  setGoogleUrl: (url: string) => void;
};

const PdpBuyboxCtx = createContext<PdpBuyboxState | null>(null);

const VARIANT_GID_PREFIX = "gid://shopify/ProductVariant/";

export function PdpBuyboxProvider({
  defaultVariantId,
  children,
}: {
  defaultVariantId: string | null;
  children: ReactNode;
}) {
  const [selectedVariantId, setSelectedVariantIdState] = useState<string | null>(
    defaultVariantId,
  );
  const [qty, setQtyState] = useState(1);
  const [googleUrl, setGoogleUrlState] = useState("");

  const setSelectedVariantId = useCallback((id: string) => {
    if (!id || !id.startsWith(VARIANT_GID_PREFIX)) return;
    setSelectedVariantIdState(id);
  }, []);

  const setQty = useCallback((next: number) => {
    if (!Number.isFinite(next)) return;
    const clamped = Math.max(1, Math.min(99, Math.round(next)));
    setQtyState(clamped);
  }, []);

  const setGoogleUrl = useCallback((url: string) => {
    // Trim only — leave the user's text alone otherwise. The Server
    // Action sanitizes before forwarding to Shopify.
    setGoogleUrlState(url);
  }, []);

  const value = useMemo<PdpBuyboxState>(
    () => ({
      selectedVariantId,
      qty,
      googleUrl,
      setSelectedVariantId,
      setQty,
      setGoogleUrl,
    }),
    [selectedVariantId, qty, googleUrl, setSelectedVariantId, setQty, setGoogleUrl],
  );

  return <PdpBuyboxCtx.Provider value={value}>{children}</PdpBuyboxCtx.Provider>;
}

export function usePdpBuybox(): PdpBuyboxState {
  const ctx = useContext(PdpBuyboxCtx);
  if (!ctx) {
    throw new Error("usePdpBuybox must be used inside <PdpBuyboxProvider />");
  }
  return ctx;
}
