"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NavLink from "./NavLink";
import styles from "./Nav.module.css";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isOfferRoute = pathname.startsWith("/offer/");

  return (
    <div className={styles.menu} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className={styles.menuTrigger}
        aria-label={open ? "Close primary navigation" : "Open primary navigation"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      <nav id="primary-navigation" className={styles.links} aria-label="Primary">
        <NavLink
          href="/shmo-review"
          className={styles.link}
          activeClassName={styles.linkActive}
          onClick={() => setOpen(false)}
        >
          Shmo Review
          <span
            className={`shm-badge shm-badge--status shm-badge--status-clover ${styles.linkStatus}`}
          >
            Live
          </span>
        </NavLink>
        <Link href="/shmo-biz" className={styles.link} onClick={() => setOpen(false)}>
          Shmo Biz
          <span
            className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
          >
            Soon
          </span>
        </Link>
        <Link href="/shmo-link" className={styles.link} onClick={() => setOpen(false)}>
          Shmo Link
          <span
            className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
          >
            Soon
          </span>
        </Link>
        <Link
          href="/shmo-reputation"
          className={styles.link}
          onClick={() => setOpen(false)}
        >
          Shmo Reputation
          <span
            className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
          >
            Soon
          </span>
        </Link>
        {!isOfferRoute && (
          <a
            href="https://app.shmocard.com/auth/login"
            className={styles.link}
            rel="noopener"
            onClick={() => setOpen(false)}
          >
            Log in
          </a>
        )}
      </nav>
    </div>
  );
}
