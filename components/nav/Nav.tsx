"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, ArrowRight, Menu, X } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Shmo Review", href: "#review", live: true },
  { label: "Shmo Biz", href: "#biz", live: false },
  { label: "Shmo Link", href: "#link", live: false },
  { label: "Shmo Reputation", href: "#reputation", live: false },
];

const COMPANY_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur border-b border-hair-2">
      <div className="max-w-[1320px] mx-auto px-7 h-16 flex items-center gap-6">
        <Link
          href="/"
          aria-label="Shmocard home"
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-10 h-10 rounded-md bg-ink flex items-center justify-center">
            <Image
              src="/logos/logo-shmocard.png"
              alt="Shmocard logo"
              width={22}
              height={22}
              priority
            />
          </span>
          <span className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            Shmo
            <em className="font-serif italic font-normal text-ember text-[24px] leading-none">
              card
            </em>
          </span>
        </Link>

        <nav
          aria-label="Sub-brands"
          className="hidden lg:flex items-center gap-5"
        >
          {PRODUCT_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-ink-3 hover:text-ink transition-colors flex items-center gap-2"
            >
              {l.label}
              {l.live && (
                <span className="text-[10px] font-semibold uppercase rounded-full bg-success-soft text-success px-2 py-[2px] tracking-[1.2px]">
                  Live
                </span>
              )}
            </a>
          ))}
        </nav>

        <span className="flex-1" />

        <nav
          aria-label="Company"
          className="hidden xl:flex items-center gap-5"
        >
          {COMPANY_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-ink-3 hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden md:flex w-10 h-10 items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-cream-soft transition-colors"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-cream-soft transition-colors"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </button>
          <a
            href="#review"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-md bg-ember text-paper text-sm font-semibold hover:bg-ember-deep transition-colors"
          >
            Shop
            <ArrowRight size={14} strokeWidth={1.75} />
          </a>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-ink-3 hover:text-ink hover:bg-cream-soft transition-colors"
          >
            {open ? (
              <X size={20} strokeWidth={1.75} />
            ) : (
              <Menu size={20} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 bg-cocoa-deep/40 lg:hidden"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Site menu"
            className="lg:hidden fixed top-16 inset-x-0 bg-paper border-b border-hair-2 px-7 py-7"
          >
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-ink-3 mb-3">Products</div>
              <div className="flex flex-col gap-3">
                {PRODUCT_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="text-[17px] font-semibold text-ink flex items-center gap-3"
                  >
                    {l.label}
                    {l.live && (
                      <span className="text-[10px] font-semibold uppercase rounded-full bg-success-soft text-success px-2 py-[2px] tracking-[1.2px]">
                        Live
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="text-[11px] font-semibold uppercase tracking-[1.2px] text-ink-3 mb-3">Company</div>
              <div className="flex flex-col gap-3">
                {COMPANY_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="text-[14px] text-ink-2"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="#review"
              onClick={close}
              className="inline-flex w-full items-center justify-center gap-2 h-12 px-4 rounded-md bg-ember text-paper text-sm font-semibold hover:bg-ember-deep transition-colors"
            >
              Shop the cards
              <ArrowRight size={14} strokeWidth={1.75} />
            </a>
          </div>
        </>
      )}
    </header>
  );
}
