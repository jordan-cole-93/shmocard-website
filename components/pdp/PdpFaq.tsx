// components/pdp/PdpFaq.tsx
// PDP-level FAQ. Server component — composes the existing FaqItem
// (which is a client leaf for the open/close state). Prevents duplicate
// accordion code.

import FaqItem from "@/components/home/FaqItem";
import type { PdpFaqItem } from "./pdp-copy";

type Props = {
  items: PdpFaqItem[];
};

export default function PdpFaq({ items }: Props) {
  return (
    <ul className="shm-faq-list pdp-bb__faq" aria-label="Product FAQ">
      {items.map((it, i) => (
        <FaqItem key={i} question={it.q} answer={it.a} />
      ))}
    </ul>
  );
}
