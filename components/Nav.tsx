// Nav — server component shell.
//
// The cart icon is a client component (`NavCartIcon`) that subscribes
// to the Zustand `useCart` store for the line count and opens the
// drawer on click. Keeping Nav itself server-side avoids shipping the
// nav links + logo as JS.

import Link from "next/link";

import NavCartIcon from "./cart/NavCartIcon";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <header className="shm-nav" id="top">
      <div className={`shm-container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="ShmoCard home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/Logo-Mascot.png" alt="" width={32} height={32} />
          <span className={styles.mark}>
            <span className={styles.markShmo}>Shmo</span>
            <span className={styles.markCard}>Card</span>
          </span>
        </Link>

        {/* Primary nav. At <=880px the four sub-brand links live inside a
            native <details> menu that hangs below the nav (no JS state needed).
            At >880px the desktop CSS unhides the panel inline and hides the
            hamburger trigger. */}
        <details className={styles.menu}>
          <summary
            className={styles.menuTrigger}
            aria-label="Open primary navigation"
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav className={styles.links} aria-label="Primary">
            <Link href="/shmo-review" className={styles.link}>
              Shmo Review
              <span
                className={`shm-badge shm-badge--status shm-badge--status-clover ${styles.linkStatus}`}
              >
                Live
              </span>
            </Link>
            <a href="#shmo-biz" className={styles.link}>
              Shmo Biz
              <span
                className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
              >
                Soon
              </span>
            </a>
            <a href="#shmo-link" className={styles.link}>
              Shmo Link
              <span
                className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
              >
                Soon
              </span>
            </a>
            <a href="#shmo-reputation" className={styles.link}>
              Shmo Reputation
              <span
                className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}
              >
                Soon
              </span>
            </a>
          </nav>
        </details>

        <div className={styles.ctaRow}>
          {/* useCart-backed cart trigger — opens CartDrawer */}
          <NavCartIcon />
          <Link href="/shmo-review" className="shm-btn shm-btn--primary shm-btn--sm">
            Shop →
          </Link>
        </div>
      </div>
    </header>
  );
}
