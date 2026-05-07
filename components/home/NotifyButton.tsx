"use client";

// components/home/NotifyButton.tsx
//
// Tiny client component for the SubBrandSpotlight 'Notify me' CTA.
// Keeps SubBrandSpotlight server-rendered — only this leaf is client.
// Triggers the waitlist modal via the modal store.
//
// Plan 03-10 task 2.

import { openWaitlist, type ModalProduct } from "@/components/modals/modal-store";

type Props = {
  product: ModalProduct;
  label: string;
  className?: string;
};

export default function NotifyButton({ product, label, className }: Props) {
  return (
    <button
      type="button"
      className={className ?? "shm-btn shm-btn--primary"}
      data-waitlist={product}
      onClick={() => openWaitlist(product)}
    >
      {label}
    </button>
  );
}
