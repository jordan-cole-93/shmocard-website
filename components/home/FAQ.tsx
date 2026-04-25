"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

interface QA {
  id: string;
  q: string;
  a: ReactNode;
}

const QUESTIONS: QA[] = [
  {
    id: "what",
    q: "What is Shmocard?",
    a: (
      <>
        Shmocard is a family of four tools built for Main Street crews. Each one
        solves a different customer-facing moment — reviews, contacts, links,
        reputation. One dashboard, one brand, more jobs your crew can do.
      </>
    ),
  },
  {
    id: "live",
    q: "How many tools are live right now?",
    a: (
      <>
        One. Shmo Review ships today. Shmo Biz, Shmo Link, and Shmo Reputation
        roll out across next year — same cards, same dashboard.
      </>
    ),
  },
  {
    id: "subscription",
    q: "Do I need a subscription?",
    a: (
      <>
        No. The cards are a one-time purchase — yours forever. The only future
        subscription is Shmo Reputation, the AI review responder, since it&apos;s a
        software product. Cards never have a monthly fee.
      </>
    ),
  },
  {
    id: "right",
    q: "Which tool is right for me?",
    a: (
      <>
        If you want more Google reviews, start with Shmo Review. The other three
        solve different moments — sharing your contact (Biz), pointing customers
        to all your links (Link), and responding to reviews automatically
        (Reputation). Most crews start with Review and add the others as they
        ship.
      </>
    ),
  },
  {
    id: "phones",
    q: "Does Shmo Review work on all phones?",
    a: (
      <>
        Yes — iPhone XS and newer (2018+) and Android 5.0 and newer. The cards
        use NFC, the same chip that powers Apple Pay and Google Pay. If a
        customer can tap their phone to pay, they can tap a Shmocard. A QR code
        on the back covers any phone that can&apos;t.
      </>
    ),
  },
  {
    id: "google-link",
    q: "How do I get my Google review link?",
    a: (
      <>
        Easy. Search your business in Google Maps, click &ldquo;Ask for reviews,&rdquo;
        and copy the short link. Send it to us when you order, and every card
        ships pre-programmed. No setup on your end.
      </>
    ),
  },
  {
    id: "bulk",
    q: "Can I order cards in bulk for my whole team?",
    a: (
      <>
        Yes — Shmo Review cards have bulk pricing for crews. The math gets
        better as you scale: one card behind the counter captures about two
        reviews a week, one per employee captures about fifteen. See live
        pricing on the Shmo Review page.
      </>
    ),
  },
  {
    id: "launch",
    q: "What happens when new tools launch?",
    a: (
      <>
        You&apos;ll be the first to know. Anyone on the waitlist (or with an
        account) gets an email the day each new tool drops. Each one is sold
        separately, so you buy what fits when you need it.
      </>
    ),
  },
];

export function FAQ() {
  const reduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(QUESTIONS[0].id);

  return (
    <section id="faq" className="faq">
      <div className="faq__inner">
        <div className="faq__head">
          <span className="faq__eyebrow">Common questions</span>
          <h2 className="faq__title">
            Common questions, <em>honest</em> answers.
          </h2>
        </div>

        <ul className="faq__list">
          {QUESTIONS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id} className="faq__item">
                <button
                  type="button"
                  className={`faq__trigger ${isOpen ? "faq__trigger--open" : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span className="faq__question">{item.q}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <Plus
                      style={{
                        width: 18,
                        height: 18,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.22s ease",
                      }}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${item.id}`}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="faq__answer">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
