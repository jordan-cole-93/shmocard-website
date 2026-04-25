"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

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
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link href="/" className="nav__brand" aria-label="Shmocard home">
          <span className="nav__mark">S</span>
          <span className="nav__wordmark">
            Shmo<em>card</em>
          </span>
        </Link>

        <nav className="nav__menu nav__menu--desktop" aria-label="Sub-brands">
          <a className="nav__link" href="#family">
            Shmo Review <span className="pill">Live</span>
          </a>
          <a className="nav__link" href="#family">Shmo Biz</a>
          <a className="nav__link" href="#family">Shmo Link</a>
          <a className="nav__link" href="#family">Shmo Reputation</a>
        </nav>

        <span className="nav__spacer" />

        <nav className="nav__menu nav__menu--desktop" aria-label="Company">
          <a className="nav__link" href="#family">How it works</a>
          <a className="nav__link" href="#family">Pricing</a>
          <a className="nav__link" href="#family">About</a>
        </nav>

        <div className="nav__right">
          <button type="button" className="nav__icon-btn nav__icon-btn--desktop" aria-label="Search">
            <Icon.Search style={{ width: 16, height: 16 }} />
          </button>
          <button type="button" className="nav__icon-btn" aria-label="Cart">
            <Icon.Cart style={{ width: 16, height: 16 }} />
          </button>
          <Link className="btn btn--primary btn--sm nav__shop-cta" href="/shmo-review">
            Shop <Icon.Arrow style={{ width: 14, height: 14 }} />
          </Link>
          <button
            type="button"
            className="nav__icon-btn nav__hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Icon.Close style={{ width: 18, height: 18 }} /> : <Icon.Menu style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="nav__scrim" onClick={close} aria-hidden="true" />
          <div className="nav__drawer" role="dialog" aria-label="Site menu">
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Products</div>
              <a className="nav__drawer-link" href="#family" onClick={close}>
                Shmo Review <span className="pill">Live</span>
              </a>
              <a className="nav__drawer-link" href="#family" onClick={close}>Shmo Biz</a>
              <a className="nav__drawer-link" href="#family" onClick={close}>Shmo Link</a>
              <a className="nav__drawer-link" href="#family" onClick={close}>Shmo Reputation</a>
            </div>
            <div className="nav__drawer-section">
              <div className="nav__drawer-eyebrow">Company</div>
              <a className="nav__drawer-link" href="#family" onClick={close}>How it works</a>
              <a className="nav__drawer-link" href="#family" onClick={close}>Pricing</a>
              <a className="nav__drawer-link" href="#family" onClick={close}>About</a>
            </div>
            <div className="nav__drawer-cta">
              <Link className="btn btn--primary" href="/shmo-review" onClick={close} style={{ justifyContent: "center" }}>
                Shop the cards <Icon.Arrow style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
