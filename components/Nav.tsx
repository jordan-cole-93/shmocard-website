// Nav — server component shell.
//
// The cart icon is a client component (`NavCartIcon`) that subscribes
// to the Zustand `useCart` store for the line count and opens the
// drawer on click. Keeping Nav itself server-side avoids shipping the
// nav links + logo as JS.

import Link from "next/link";

import NavCartIcon from "./cart/NavCartIcon";
import NavMenu from "./NavMenu";
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

        <NavMenu />

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
