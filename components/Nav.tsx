// Nav — server component shell.
//
// The cart icon is a client component (`NavCartIcon`) that subscribes
// to the Zustand `useCart` store for the line count and opens the
// drawer on click. Keeping Nav itself server-side avoids shipping the
// nav links + logo as JS.

import Link from "next/link";

import NavCartIcon from "./cart/NavCartIcon";
import NavLink from "./NavLink";
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

        {/* Primary nav. Rendered with `open` so the panel is visible by
            default at every viewport — modern browsers hide non-summary
            children of a closed <details> via the UA slot mechanism, which
            CSS can't override. At >880px the hamburger summary is hidden
            via CSS and the panel renders inline. At <=880px the summary
            becomes the hamburger; the dropdown is shown by default on
            initial mobile load and users tap to close. */}
        <details className={styles.menu} open>
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
            <NavLink
              href="/shmo-review"
              className={styles.link}
              activeClassName={styles.linkActive}
            >
              Shmo Review
              <span
                className={`shm-badge shm-badge--status shm-badge--status-clover ${styles.linkStatus}`}
              >
                Live
              </span>
            </NavLink>
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
