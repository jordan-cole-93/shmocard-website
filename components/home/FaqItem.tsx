"use client";

// components/home/FaqItem.tsx
// Single accordion row. Composes the .shm-faq-* primitive — no restyles.

import { useState } from "react";

type Props = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export default function FaqItem({ question, answer, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <li className={`shm-faq-item ${open ? "shm-faq-item--open" : ""}`}>
      <button
        type="button"
        className="shm-faq-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="shm-faq-question">{question}</span>
        <span className="shm-faq-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      {open && <div className="shm-faq-answer">{answer}</div>}
    </li>
  );
}
