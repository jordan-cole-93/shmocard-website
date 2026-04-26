"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Camera, Check } from "lucide-react";
import { Section, Eyebrow, H2, Lede, I } from "@/components/shm/Shm";

type Brand = {
  id: string;
  name: string;
  role: string;
  status: "live" | "soon";
  headlinePre: string;
  headlineEm: string;
  headlinePost: string;
  lede: string;
  ctaLabel: string;
  ctaHref: string;
  glyph: string;
  glyphClass: string;
  visualLabel: string;
};

const BRANDS: Brand[] = [
  {
    id: "review",
    name: "Shmo Review",
    role: "NFC review cards",
    status: "live",
    headlinePre: "One tap. One ",
    headlineEm: "five-star",
    headlinePost: " review.",
    lede: "NFC review cards, signs and discs that send happy customers straight to your Google profile. No app, no login, no QR-code gymnastics.",
    ctaLabel: "Shop now",
    ctaHref: "#review",
    glyph: "R",
    glyphClass: "shm-family-glyph--review",
    visualLabel: "Shmo Review · CR-80 card visual",
  },
  {
    id: "biz",
    name: "Shmo Biz",
    role: "NFC business card",
    status: "soon",
    headlinePre: "Your business card. ",
    headlineEm: "Finally",
    headlinePost: " worth handing out.",
    lede: "Paper cards get lost. Shmo Biz lives on the customer's phone the moment you tap. Name, title, phone, website — always up to date.",
    ctaLabel: "Get notified",
    ctaHref: "#",
    glyph: "B",
    glyphClass: "shm-family-glyph--biz",
    visualLabel: "Shmo Biz · phone + business card mock",
  },
  {
    id: "link",
    name: "Shmo Link",
    role: "Link in bio for local shops",
    status: "soon",
    headlinePre: "One link. ",
    headlineEm: "Every",
    headlinePost: " destination.",
    lede: "Send customers to your Google page, your booking, your menu, your socials — all from one branded hub built for local businesses.",
    ctaLabel: "Get notified",
    ctaHref: "#",
    glyph: "L",
    glyphClass: "shm-family-glyph--link",
    visualLabel: "Shmo Link · phone showing link hub",
  },
  {
    id: "reputation",
    name: "Shmo Reputation",
    role: "AI review responder",
    status: "soon",
    headlinePre: "Every review, ",
    headlineEm: "answered",
    headlinePost: ".",
    lede: "Responding to reviews builds trust and improves local ranking. Shmo Reputation answers every review automatically, in your brand's voice.",
    ctaLabel: "Get notified",
    ctaHref: "#",
    glyph: "M",
    glyphClass: "shm-family-glyph--rep",
    visualLabel: "Shmo Reputation · review + auto-reply mock",
  },
];

const ROADMAP = [
  { label: "Live", sublabel: "Shmo Review", done: true },
  { label: "Next", sublabel: "Shmo Biz", done: false },
  { label: "After", sublabel: "Shmo Link", done: false },
  { label: "Later", sublabel: "Shmo Reputation", done: false },
];

export default function Showcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedFor, setSubmittedFor] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % BRANDS.length),
      5000
    );
    return () => clearInterval(id);
  }, [paused]);

  const brand = BRANDS[active];
  const isSubmitted = !!submittedFor[brand.id];

  const handleNotify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to GoHighLevel webhook
    setSubmittedFor((prev) => ({ ...prev, [brand.id]: true }));
    setEmail("");
  };

  return (
    <Section recipe="cocoa-hot">
      <div className="text-center max-w-[720px] mx-auto">
        <Eyebrow>The Shmocard family</Eyebrow>
        <H2 className="mt-3">
          Four tools. <I>One</I> toolkit.
        </H2>
        <Lede className="mt-4">
          Shmo Review is shipping. Three more sub-brands roll out through next
          year — same cards, same dashboard, more jobs they can do.
        </Lede>
      </div>

      <div className="mt-8 flex justify-center">
        <ol className="inline-flex items-center gap-6 lg:gap-8 px-6 py-4 rounded-lg bg-[rgba(255,248,234,0.04)] border border-[rgba(255,235,210,0.14)] flex-wrap">
          {ROADMAP.map((node, i) => (
            <li
              key={node.sublabel}
              className="flex items-center gap-3 lg:gap-5"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:inline-block w-7 h-px bg-[rgba(255,235,210,0.25)]"
                />
              )}
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-full flex items-center justify-center ${
                    node.done
                      ? "bg-ember text-paper"
                      : "border border-[rgba(255,235,210,0.35)] bg-transparent"
                  }`}
                  style={{ width: "16px", height: "16px" }}
                >
                  {node.done && <Check size={9} strokeWidth={3} />}
                </span>
                <span className="flex flex-col leading-tight">
                  <span
                    className={`text-[10.5px] font-semibold tracking-[0.8px] uppercase ${
                      node.done ? "text-ember" : "text-[rgba(255,235,210,0.55)]"
                    }`}
                  >
                    {node.label}
                  </span>
                  <span className="text-[12px] text-[rgba(255,235,210,0.85)] mt-[2px]">
                    {node.sublabel}
                  </span>
                </span>
              </span>
            </li>
          ))}
          <li className="flex flex-col leading-tight pl-6 border-l border-[rgba(255,235,210,0.18)]">
            <span className="text-[10.5px] font-semibold tracking-[0.8px] uppercase text-honey mb-[2px]">
              Currently shipping
            </span>
            <span className="text-[14px] font-bold tracking-[0.04em] text-paper">
              SHMO REVIEW
            </span>
          </li>
        </ol>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mt-8 rounded-2xl border border-[rgba(255,235,210,0.14)] bg-[rgba(255,248,234,0.04)] p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div key={brand.id} className="flex flex-col items-start text-left">
            <span
              className={`inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.8px] uppercase rounded-full px-2.5 py-1 mb-4 ${
                brand.status === "live"
                  ? "bg-success/20 text-[#6EE3A1]"
                  : "bg-honey/20 text-honey"
              }`}
            >
              {brand.status === "live" ? "Live now" : "Coming soon"}
            </span>

            <h3
              className="font-sans font-semibold text-paper text-balance"
              style={{
                fontSize: "40px",
                lineHeight: 1.04,
                letterSpacing: "-0.025em",
              }}
            >
              {brand.headlinePre}
              <em className="font-serif italic font-normal text-honey">
                {brand.headlineEm}
              </em>
              {brand.headlinePost}
            </h3>

            <p className="mt-4 text-[16px] leading-[1.55] text-[rgba(255,235,210,0.8)] max-w-[48ch]">
              {brand.lede}
            </p>

            <div className="mt-6 w-full flex flex-wrap gap-2">
              {brand.status === "live" ? (
                <a
                  href={brand.ctaHref}
                  className="shm-btn shm-btn--primary shm-btn--lg"
                >
                  {brand.ctaLabel}
                  <ArrowRight size={16} strokeWidth={1.75} />
                </a>
              ) : isSubmitted ? (
                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-md bg-success/20 border border-[rgba(110,227,161,0.35)] text-[#B8F3CE] text-[13.5px]">
                  <Check size={16} strokeWidth={2} />
                  <span>
                    You&apos;re on the list — we&apos;ll email when{" "}
                    {brand.name} drops.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleNotify}
                  className="flex w-full max-w-[420px] gap-2"
                >
                  <label className="sr-only" htmlFor={`notify-${brand.id}`}>
                    Email address
                  </label>
                  <input
                    id={`notify-${brand.id}`}
                    type="email"
                    required
                    placeholder="you@yourshop.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-3 rounded-md bg-[rgba(255,248,234,0.08)] border border-[rgba(255,235,210,0.25)] text-paper placeholder:text-[rgba(255,235,210,0.45)] focus:outline-none focus:border-ember focus:ring-2 focus:ring-ember/25"
                  />
                  <button
                    type="submit"
                    className="shm-btn shm-btn--primary"
                  >
                    Notify
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:pl-2">
            <div
              key={`${brand.id}-vis`}
              role="img"
              aria-label={`Placeholder: ${brand.visualLabel}`}
              className="relative w-full max-w-[480px] mx-auto lg:ml-auto lg:mr-0 rounded-xl border border-[rgba(255,235,210,0.18)] bg-ember-soft overflow-hidden"
              style={{
                aspectRatio: "4/3",
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(59,31,20,0.08) 0, rgba(59,31,20,0.08) 1px, transparent 1px, transparent 10px)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center gap-3">
                <Camera
                  size={32}
                  strokeWidth={1.5}
                  className="text-ember-deep opacity-60"
                />
                <span className="text-[11px] font-semibold tracking-[1.4px] uppercase text-ember-deep">
                  {brand.visualLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {BRANDS.map((b, i) => {
          const isActive = i === active;
          return (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-ember border border-ember text-paper hover:bg-ember-deep"
                  : "bg-[rgba(255,248,234,0.04)] border border-[rgba(255,235,210,0.14)] text-[rgba(255,235,210,0.85)] hover:border-[rgba(255,235,210,0.24)]"
              }`}
            >
              <span
                className={`shrink-0 rounded-sm flex items-center justify-center font-bold text-[13px] text-paper ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.25)]"
                    : "bg-[rgba(255,235,210,0.18)]"
                }`}
                style={{ width: "32px", height: "32px" }}
              >
                {b.glyph}
              </span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-[13.5px] font-semibold text-paper truncate">
                  {b.name}
                </span>
                <span
                  className={`text-[11.5px] truncate ${
                    isActive
                      ? "text-[rgba(255,255,255,0.85)]"
                      : "text-[rgba(255,235,210,0.6)]"
                  }`}
                >
                  {b.role}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
