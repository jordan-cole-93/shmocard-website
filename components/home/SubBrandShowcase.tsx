"use client";

import { useEffect, useState, Fragment, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Placeholder } from "@/components/ui/Placeholder";

const ROADMAP_NODES: Array<{ label: string; sublabel: string; status: "completed" | "upcoming" }> = [
  { label: "Live", sublabel: "Shmo Review", status: "completed" },
  { label: "Next", sublabel: "Shmo Biz", status: "upcoming" },
  { label: "After", sublabel: "Shmo Link", status: "upcoming" },
  { label: "Later", sublabel: "Shmo Reputation", status: "upcoming" },
];

interface Brand {
  id: string;
  name: string;
  role: string;
  status: "live" | "soon";
  headline: ReactNode;
  lede: string;
  cta: { label: string; href: string };
  visualLabel: string;
}

const BRANDS: Brand[] = [
  {
    id: "review",
    name: "Shmo Review",
    role: "NFC review cards",
    status: "live",
    headline: (
      <>
        One tap. One <em>five-star</em> review.
      </>
    ),
    lede:
      "NFC review cards, signs and discs that send happy customers straight to your Google profile. No app, no login, no QR-code gymnastics.",
    cta: { label: "Shop now", href: "/shmo-review" },
    visualLabel: "Shmo Review · CR-80 card photo",
  },
  {
    id: "biz",
    name: "Shmo Biz",
    role: "NFC business card",
    status: "soon",
    headline: (
      <>
        Your business card. <em>Finally</em> worth handing out.
      </>
    ),
    lede:
      "Paper cards get lost. Shmo Biz lives on the customer's phone the moment you tap. Name, title, phone, website — always up to date.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Biz · phone + business card mock",
  },
  {
    id: "link",
    name: "Shmo Link",
    role: "Link in bio for Main Street",
    status: "soon",
    headline: (
      <>
        One link. <em>Every</em> destination.
      </>
    ),
    lede:
      "Send customers to your Google page, your booking, your menu, your socials — all from one branded hub built for local businesses.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Link · phone showing link hub",
  },
  {
    id: "reputation",
    name: "Shmo Reputation",
    role: "AI review responder",
    status: "soon",
    headline: (
      <>
        Every review, <em>answered</em>.
      </>
    ),
    lede:
      "Responding to reviews builds trust and improves local ranking. Shmo Reputation answers every review automatically, in your brand's voice.",
    cta: { label: "Get notified", href: "#" },
    visualLabel: "Shmo Reputation · review + auto-reply mock",
  },
];

export function SubBrandShowcase() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedFor, setSubmittedFor] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % BRANDS.length), 5000);
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  // Pause auto-cycle when the user starts interacting with the email field
  // so they don't lose what they typed mid-cycle.
  const handleNotifySubmit = (e: FormEvent<HTMLFormElement>, brandId: string) => {
    e.preventDefault();
    if (!email) return;
    setSubmittedFor((prev) => new Set(prev).add(brandId));
    setEmail("");
  };

  const brand = BRANDS[active];
  const isSubmitted = submittedFor.has(brand.id);

  const animProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.32, ease: "easeOut" as const },
      };
  const visualAnim = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
        transition: { duration: 0.32, ease: "easeOut" as const },
      };

  return (
    <section className="showcase" id="family">
      <div className="showcase__inner">
        <div className="showcase__head">
          <span className="showcase__eyebrow">The Shmocard family</span>
          <h2 className="showcase__title">
            Four tools. <em>One</em> toolkit.
          </h2>
          <p className="showcase__lede">
            Shmo Review is shipping. Three more sub-brands roll out through next year — same cards, same dashboard, more jobs they can do.
          </p>
        </div>

        {/* Release roadmap — 1 of 4 shipping milestone indicator */}
        <div className="rr" aria-label="1 of 4 sub-brands shipping">
          <div className="rr__rail">
            {ROADMAP_NODES.map((node, index) => (
              <Fragment key={node.sublabel}>
                {index > 0 && <div className="rr__line" aria-hidden="true" />}
                <div className="rr__step">
                  <div
                    className={`rr__node ${
                      node.status === "completed" ? "rr__node--done" : "rr__node--upcoming"
                    }`}
                    aria-hidden="true"
                  >
                    {node.status === "completed" && (
                      <Check style={{ width: 8, height: 8 }} strokeWidth={3} />
                    )}
                  </div>
                  <div className="rr__step-text">
                    <span
                      className={`rr__label ${
                        node.status === "completed" ? "rr__label--done" : ""
                      }`}
                    >
                      {node.status === "completed" && node.label === "Live" ? (
                        <em>{node.label}</em>
                      ) : (
                        node.label
                      )}
                    </span>
                    <span className="rr__sublabel">{node.sublabel}</span>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div className="rr__current">
            <span className="rr__current-label">Currently Shipping</span>
            <span className="rr__current-name">SHMO REVIEW</span>
          </div>
        </div>

        <div
          className="showcase__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
        >
          <div className="showcase__grid">
            <AnimatePresence mode="wait">
              <motion.div key={brand.id} className="showcase__copy" {...animProps}>
                <span
                  className={`showcase__status ${
                    brand.status === "live"
                      ? "showcase__status--live"
                      : "showcase__status--soon"
                  }`}
                >
                  {brand.status === "live" ? "Live now" : "Coming soon"}
                </span>
                <h3 className="showcase__slide-title">{brand.headline}</h3>
                <p className="showcase__slide-lede">{brand.lede}</p>

                <div className="showcase__cta-row">
                  {brand.status === "live" ? (
                    <Link className="btn btn--primary btn--lg" href={brand.cta.href}>
                      {brand.cta.label} <Icon.Arrow style={{ width: 16, height: 16 }} />
                    </Link>
                  ) : isSubmitted ? (
                    <div className="showcase__notify-success" role="status">
                      <Check style={{ width: 16, height: 16 }} />
                      <span>You&apos;re on the list — we&apos;ll email when {brand.name} drops.</span>
                    </div>
                  ) : (
                    <form
                      className="showcase__notify"
                      onSubmit={(e) => handleNotifySubmit(e, brand.id)}
                    >
                      <input
                        type="email"
                        className="showcase__notify-input"
                        placeholder="you@yourshop.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label={`Email to get notified about ${brand.name}`}
                        required
                      />
                      <button type="submit" className="btn btn--primary showcase__notify-submit">
                        Notify me <Icon.Arrow style={{ width: 14, height: 14 }} />
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${brand.id}-vis`}
                className="showcase__visual"
                {...visualAnim}
              >
                <Placeholder label={brand.visualLabel} aspect="4 / 3" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="showcase__tabs" role="tablist">
          {BRANDS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`showcase__tab showcase__tab--${b.id} ${i === active ? "showcase__tab--active" : ""}`}
            >
              <Placeholder
                className="showcase__tab-mascot"
                label={`${b.name} mascot`}
                aspect="1 / 1"
              />
              <span className="showcase__tab-text">
                <span className="showcase__tab-name">{b.name}</span>
                <span className="showcase__tab-role">{b.role}</span>
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
