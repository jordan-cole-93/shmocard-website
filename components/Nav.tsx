import Link from "next/link";
import styles from "./Nav.module.css";

type NavProps = {
  cartCount?: number;
};

export default function Nav({ cartCount = 0 }: NavProps) {
  return (
    <header className="shm-nav" id="top">
      <div className={`shm-container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="ShmoCard home">
          <img src="/logo/Logo-Mascot.png" alt="" width={32} height={32} />
          <span className={styles.mark}>
            <span className={styles.markShmo}>Shmo</span>
            <span className={styles.markCard}>Card</span>
          </span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          <Link href="/shmo-review" className={styles.link}>
            Shmo Review
            <span className={`shm-badge shm-badge--status shm-badge--status-clover ${styles.linkStatus}`}>
              Live
            </span>
          </Link>
          <a href="#shmo-biz" className={styles.link}>
            Shmo Biz
            <span className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}>
              Soon
            </span>
          </a>
          <a href="#shmo-link" className={styles.link}>
            Shmo Link
            <span className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}>
              Soon
            </span>
          </a>
          <a href="#shmo-reputation" className={styles.link}>
            Shmo Reputation
            <span className={`shm-badge shm-badge--status shm-badge--status-honey ${styles.linkStatus}`}>
              Soon
            </span>
          </a>
        </nav>

        <div className={styles.ctaRow}>
          <button
            type="button"
            className={styles.cart}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
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
              <path d="M5 7h14l-1.5 9.2a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7Z" />
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
            </svg>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </button>
          <Link href="/shmo-review" className="shm-btn shm-btn--primary shm-btn--sm">
            Shop →
          </Link>
        </div>
      </div>
    </header>
  );
}
