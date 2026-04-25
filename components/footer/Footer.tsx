import Link from "next/link";
import { Icon } from "@/lib/icons";

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer__grid">
        <div>
          <Link href="/" className="nav__brand" aria-label="Shmocard home">
            <span className="nav__mark">S</span>
            <span className="nav__wordmark" style={{ fontSize: 18 }}>
              Shmo<em>card</em>
            </span>
          </Link>
          <p className="home-footer__tagline">
            Made for Main Street by Shmocard.
          </p>
          <div className="home-footer__social">
            <a href="#" aria-label="Twitter">
              <Icon.Twitter size={15} />
            </a>
            <a href="#" aria-label="Instagram">
              <Icon.Instagram size={15} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Icon.LinkedIn size={15} />
            </a>
            <a href="#" aria-label="YouTube">
              <Icon.YouTube size={15} />
            </a>
          </div>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Software</div>
          <a href="#family">Shmo Biz <span className="home-footer__soon">soon</span></a>
          <a href="#family">Shmo Link <span className="home-footer__soon">soon</span></a>
          <a href="#family">Shmo Reputation <span className="home-footer__soon">soon</span></a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Shop</div>
          <a href="#">CR-80 cards</a>
          <a href="#">L-Signs</a>
          <a href="#">Square cards</a>
          <a href="#">Bulk orders</a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Company</div>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Contact</a>
          <a href="#">Affiliate</a>
        </div>

        <div className="home-footer__col">
          <div className="home-footer__col-title">Support</div>
          <a href="#">How it works</a>
          <a href="#">Activation guide</a>
          <a href="#">Returns &amp; warranty</a>
          <a href="#">Help center</a>
          <a href="#">Status</a>
        </div>
      </div>

      <div className="home-footer__legal">
        <span>© {new Date().getFullYear()} Shmocard, Inc. All rights reserved.</span>
        <span>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
