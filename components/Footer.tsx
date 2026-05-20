import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="shm-container">
        <div className={styles.grid}>
          <div className={styles.col}>
            <span className={styles.mark}>
              <img src="/logo/Logo-Mascot.png" alt="" width={30} height={30} />
              <span>
                <span className={styles.markShmo}>Shmo</span>
                <span className={styles.markCard}>Card</span>
              </span>
            </span>
            <p className={styles.tagline}>
              A family of NFC tools built for local shop crews. One brand. One
              dashboard. One-time card purchase.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className={styles.socialLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 8s-.2-1.5-.8-2.2c-.8-.9-1.7-.9-2.1-1C16 4.5 12 4.5 12 4.5s-4 0-7.1.3c-.4.1-1.3.1-2.1 1C2.2 6.5 2 8 2 8s-.2 1.7-.2 3.4v1.6c0 1.7.2 3.4.2 3.4s.2 1.5.8 2.2c.8.9 1.9.9 2.4 1 1.7.2 7.3.3 7.3.3s4 0 7.1-.3c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.2.8-2.2s.2-1.7.2-3.4v-1.6C22.2 9.7 22 8 22 8z" />
                  <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Products</h4>
            <ul className={styles.list}>
              <li><Link href="/shmo-review">Shmo Review</Link></li>
              <li><Link href="/shmo-biz">Shmo Biz <span className={styles.soon}>Soon</span></Link></li>
              <li><Link href="/shmo-link">Shmo Link <span className={styles.soon}>Soon</span></Link></li>
              <li><Link href="/shmo-reputation">Shmo Reputation <span className={styles.soon}>Soon</span></Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Shop</h4>
            <ul className={styles.list}>
              <li><Link href="/shmo-review#buybox">CR-80 Card</Link></li>
              <li><Link href="/shmo-review/l-sign">L-Sign</Link></li>
              <li><Link href="/shmo-review/square-card">Square Card</Link></li>
              <li><Link href="/shmo-review">All formats</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.heading}>Help</h4>
            <ul className={styles.list}>
              <li><a href="#how">How it works</a></li>
              <li><a href="#">Shipping &amp; returns</a></li>
              <li><a href="#">Contact support</a></li>
              <li><a href="mailto:hello@shmocard.com">hello@shmocard.com</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© ShmoCard 2026 · Built for crews. Priced for bulk.</span>
          <span>
            <a href="#">Privacy</a> · <a href="#">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
