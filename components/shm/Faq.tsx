"use client";
/* design-system/components/Faq.tsx
   Stateful FAQ accordion — single open at a time. */
import * as React from "react";

export type FaqItem = { id: string; q: string; a: string };

export function Faq({ items, defaultOpenId }: { items: FaqItem[]; defaultOpenId?: string }) {
  const [openId, setOpenId] = React.useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);
  return (
    <ul className="shm-faq-list">
      {items.map(item => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id} className="shm-faq-item">
            <button
              type="button"
              className="shm-faq-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="shm-faq-question">{item.q}</span>
              <span className="shm-faq-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round"
                     style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform .22s" }}>
                  <line x1="10" y1="4" x2="10" y2="16"/>
                  <line x1="4" y1="10" x2="16" y2="10"/>
                </svg>
              </span>
            </button>
            {isOpen && <p className="shm-faq-answer">{item.a}</p>}
          </li>
        );
      })}
    </ul>
  );
}
