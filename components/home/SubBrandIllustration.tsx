// components/home/SubBrandIllustration.tsx
// Server component. Renders an in-app phone-mockup illustration for each
// "Soon" sub-brand spotlight (Biz / Link / Reputation). Structure mirrors
// the canonical .phone-frame pattern from
// .claude/skills/shmocard-design-system/ui_kits/website/homepage-shmoreview/.
// Phone is upright; chunky cocoa outline + hard shadow keeps it on-system.
// Currently only `biz` is implemented; `link` and `reputation` fall through.

type Props = { illustrationKey: "biz" | "link" | "reputation" };

export default function SubBrandIllustration({ illustrationKey }: Props) {
  if (illustrationKey === "biz") {
    // Both render to the DOM; CSS swaps which is visible at the 720 breakpoint.
    return (
      <>
        <BizPhone />
        <BizPhoneMobile />
      </>
    );
  }
  if (illustrationKey === "link") {
    return (
      <>
        <LinkPhone />
        <LinkPhoneMobile />
      </>
    );
  }
  if (illustrationKey === "reputation") {
    return (
      <>
        <ReputationLaptop />
        <ReputationLaptopMobile />
      </>
    );
  }
  return null;
}

// Shared inner content — same card + phone DOM. Layout is decided by the
// parent's class (`--biz` for desktop, `--biz-mobile` for mobile).
function BizPhoneInner() {
  return (
    <>
      {/* Physical NFC business card — sits tilted, in front of the phone. */}
      <div className="biz-physical-card" aria-hidden="true">
        <div className="biz-physical-card__head">
          <span className="biz-physical-card__brand">Shmo<span className="biz-physical-card__brand-em">Biz</span></span>
          <span className="biz-physical-card__chip">
            <NfcArcIcon />
          </span>
        </div>
        <div className="biz-physical-card__body">
          <div className="biz-physical-card__name">John Doe</div>
          <div className="biz-physical-card__role">Owner · ShmoCard</div>
        </div>
      </div>

      {/* Recipient's phone — shows the contact preview that pops up after the tap. */}
      <div className="phone-frame">
        <span className="phone-frame__notch" />
        <div className="phone-frame__screen">
          <div className="biz-screen">
            <div className="biz-contact-preview">
              <img
                className="biz-contact-preview__avatar"
                src="/other/john-doe.jpg"
                alt=""
                aria-hidden="true"
              />
              <div className="biz-contact-preview__name">John Doe</div>
              <div className="biz-contact-preview__role">Owner · ShmoCard</div>
              <div className="biz-contact-preview__divider" />
              <ul className="biz-contact-preview__rows">
                <li>
                  <PhoneIcon /> <span>+1 555 010 0123</span>
                </li>
                <li>
                  <MailIcon /> <span>john@shmocard.com</span>
                </li>
                <li>
                  <GlobeIcon /> <span>shmocard.com</span>
                </li>
              </ul>
              <div className="biz-contact-preview__save">Save to Contacts</div>
            </div>
            <div className="biz-screen__caption">TAP TO SAVE CONTACT</div>
          </div>
        </div>
        <span className="phone-frame__home" />
      </div>
    </>
  );
}

function BizPhone() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--biz"
      role="img"
      aria-label="Shmo Biz scene: a physical NFC business card with John Doe's branding tilted next to an iPhone whose screen shows the contact preview that just appeared after tapping."
    >
      <BizPhoneInner />
    </div>
  );
}

function BizPhoneMobile() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--biz-mobile"
      role="img"
      aria-label="Shmo Biz scene: a physical NFC business card with John Doe's branding above an iPhone whose screen shows the contact preview that just appeared after tapping."
    >
      <BizPhoneInner />
    </div>
  );
}

// Canonical NFC arc icon from the reference homepage-shmoreview/review-parts.jsx.
function NfcArcIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12c2.5-2.5 5-2.5 7.5 0M5 16c1-1 2-1 3 0M2 8c4-4 8-4 12 0M5 4c2-2 4-2 6 0" />
    </svg>
  );
}

// ---------- Shmo Link scene ----------
// Shared phone core — Cindy Doe link-in-bio with four destination buttons.
// Used by both desktop (LinkPhone) and mobile (LinkPhoneMobile) variants.
function LinkPhoneCore() {
  return (
    <div className="phone-frame">
      <span className="phone-frame__notch" />
      <div className="phone-frame__screen">
        <div className="link-screen">
          <div className="link-screen__head">
            <img
              className="link-screen__avatar"
              src="/other/cindy-doe.jpg"
              alt=""
              aria-hidden="true"
            />
            <div className="link-screen__name">Cindy Doe</div>
            <div className="link-screen__bio">Local diner since 1962</div>
            <span className="link-screen__status">
              <span className="link-screen__status-dot" /> Open now
            </span>
          </div>
          <div className="link-screen__divider" />
          <ul className="link-screen__buttons">
            <li className="link-btn">
              <FacebookIcon />
              <span>Facebook profile</span>
              <ChevronIcon />
            </li>
            <li className="link-btn">
              <YoutubeIcon />
              <span>YouTube channel</span>
              <ChevronIcon />
            </li>
            <li className="link-btn">
              <HeartIcon />
              <span>Donate</span>
              <ChevronIcon />
            </li>
            <li className="link-btn">
              <GlobeIcon />
              <span>Website</span>
              <ChevronIcon />
            </li>
          </ul>
        </div>
      </div>
      <span className="phone-frame__home" />
    </div>
  );
}

function LinkPhone() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--link"
      role="img"
      aria-label="Shmo Link scene: a phone showing a link-in-bio page with four destination buttons (Facebook profile, YouTube profile, Donate, Website), with hand-drawn callouts pointing to each button explaining what it does."
    >
      <LinkPhoneCore />

      {/* Callouts alternate close/far positions next to their phone buttons
          (close → far → close → far). Each connector is a straight dashed
          horizontal line in cocoa-deep, with ember endpoint dots. */}
      <svg
        className="link-connectors"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Facebook: button @ (42,52) → close callout left-edge @ (54,52) */}
        <path d="M 42 52 L 54 52" fill="none" />
        <circle cx="42" cy="52" r="0.9" />
        <circle cx="54" cy="52" r="0.9" />
        {/* YouTube: button @ (42,62) → far callout left-edge @ (76,62) */}
        <path d="M 42 62 L 76 62" fill="none" />
        <circle cx="42" cy="62" r="0.9" />
        <circle cx="76" cy="62" r="0.9" />
        {/* Donate: button @ (42,72) → close callout left-edge @ (54,72) */}
        <path d="M 42 72 L 54 72" fill="none" />
        <circle cx="42" cy="72" r="0.9" />
        <circle cx="54" cy="72" r="0.9" />
        {/* Website: button @ (42,82) → far callout left-edge @ (76,82) */}
        <path d="M 42 82 L 76 82" fill="none" />
        <circle cx="42" cy="82" r="0.9" />
        <circle cx="76" cy="82" r="0.9" />
      </svg>

      <ul className="link-callouts" aria-hidden="true">
        <li className="link-callout link-callout--facebook">
          <FacebookCallout />
        </li>
        <li className="link-callout link-callout--youtube">
          <YoutubeCallout />
        </li>
        <li className="link-callout link-callout--donate">
          <DonateCallout />
        </li>
        <li className="link-callout link-callout--website">
          <WebsiteCallout />
        </li>
      </ul>
    </div>
  );
}

// Mobile variant — phone only. Callouts dropped because they crowd at
// portrait widths even when arranged as a side column; the phone alone
// communicates "branded link-in-bio with destination buttons".
function LinkPhoneMobile() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--link-mobile"
      role="img"
      aria-label="Shmo Link scene: a phone showing a link-in-bio page with four destination buttons (Facebook profile, YouTube profile, Donate, Website)."
    >
      <LinkPhoneCore />
    </div>
  );
}

// ---------- Shmo Reputation scene ----------
// Shared MacBook chassis + dashboard interior used by both desktop and mobile.
function RepLaptopCore() {
  return (
    <div className="rep-laptop">
      <div className="rep-laptop__lid">
        <span className="rep-laptop__notch" />
        <div className="rep-laptop__screen">
          <div className="rep-dashboard">
              {/* SIDEBAR */}
              <aside className="rep-dashboard__sidebar">
                <div className="rep-dashboard__brand">
                  <span className="rep-dashboard__brand-mark" />
                  <span className="rep-dashboard__brand-text">Reputation</span>
                </div>
                <ul className="rep-dashboard__nav">
                  <li className="rep-nav rep-nav--active">
                    <GridIcon /><span>Dashboard</span>
                  </li>
                  <li className="rep-nav">
                    <BubbleIcon /><span>Reviews</span><span className="rep-nav__pill">24</span>
                  </li>
                  <li className="rep-nav">
                    <ReplyIcon /><span>AI Replies</span>
                  </li>
                  <li className="rep-nav">
                    <ChartIcon /><span>Analytics</span>
                  </li>
                  <li className="rep-nav">
                    <GearIcon /><span>Settings</span>
                  </li>
                </ul>
                <div className="rep-dashboard__user">
                  <span className="rep-dashboard__user-avatar" />
                  <div className="rep-dashboard__user-meta">
                    <div className="rep-dashboard__user-name">John Doe</div>
                    <div className="rep-dashboard__user-shop">John&apos;s Diner</div>
                  </div>
                </div>
              </aside>

              {/* MAIN CONTENT */}
              <main className="rep-dashboard__main">
                <div className="rep-dashboard__topbar">
                  <div>
                    <div className="rep-dashboard__title">Reviews</div>
                    <div className="rep-dashboard__crumb">Last 30 days</div>
                  </div>
                  <div className="rep-dashboard__topbar-actions">
                    <span className="rep-dashboard__search" />
                    <span className="rep-dashboard__bell" />
                  </div>
                </div>

                <div className="rep-dashboard__stats">
                  <div className="rep-stat">
                    <div className="rep-stat__label">Total reviews</div>
                    <div className="rep-stat__value">142</div>
                    <div className="rep-stat__delta rep-stat__delta--up">↑ 12%</div>
                  </div>
                  <div className="rep-stat">
                    <div className="rep-stat__label">This week</div>
                    <div className="rep-stat__value rep-stat__value--ember">+18</div>
                    <div className="rep-stat__delta rep-stat__delta--up">↑ 4</div>
                  </div>
                  <div className="rep-stat">
                    <div className="rep-stat__label">Avg rating</div>
                    <div className="rep-stat__value">
                      4.8<span className="rep-stat__star"><StarIcon /></span>
                    </div>
                    <div className="rep-stat__delta rep-stat__delta--flat">— stable</div>
                  </div>
                  <div className="rep-stat">
                    <div className="rep-stat__label">Reply rate</div>
                    <div className="rep-stat__value">96%</div>
                    <div className="rep-stat__delta rep-stat__delta--up">↑ AI</div>
                  </div>
                </div>

                <div className="rep-chart">
                  <div className="rep-chart__head">
                    <div className="rep-chart__title">Review volume</div>
                    <div className="rep-chart__legend">
                      <span className="rep-chart__legend-dot" /> Daily
                    </div>
                  </div>
                  <div className="rep-chart__bars">
                    {[55, 35, 70, 50, 90, 65, 80].map((h, i) => (
                      <span
                        key={i}
                        className="rep-chart__bar"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rep-feed">
                  <div className="rep-feed__head">
                    <span className="rep-feed__title">Recent activity</span>
                    <span className="rep-feed__link">View all</span>
                  </div>
                  <div className="rep-review">
                    <div className="rep-review__head">
                      <span className="rep-review__avatar" />
                      <div className="rep-review__person">
                        <div className="rep-review__name">Sarah K.</div>
                        <div className="rep-review__time">2h ago</div>
                      </div>
                      <div className="rep-review__stars">
                        <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      </div>
                    </div>
                    <div className="rep-review__lines">
                      <div className="rep-review__line" />
                      <div className="rep-review__line rep-review__line--short" />
                    </div>
                    <div className="rep-review__reply">
                      <span className="rep-review__bot"><SparkleIcon /></span>
                      <div className="rep-review__reply-body">
                        <div className="rep-review__reply-line" />
                        <div className="rep-review__reply-line rep-review__reply-line--short" />
                      </div>
                      <span className="rep-review__sent">Sent</span>
                    </div>
                  </div>
                  <div className="rep-review">
                    <div className="rep-review__head">
                      <span className="rep-review__avatar" />
                      <div className="rep-review__person">
                        <div className="rep-review__name">Marcus T.</div>
                        <div className="rep-review__time">5h ago</div>
                      </div>
                      <div className="rep-review__stars">
                        <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                      </div>
                    </div>
                    <div className="rep-review__lines">
                      <div className="rep-review__line" />
                      <div className="rep-review__line rep-review__line--short" />
                    </div>
                    <div className="rep-review__reply">
                      <span className="rep-review__bot"><SparkleIcon /></span>
                      <div className="rep-review__reply-body">
                        <div className="rep-review__reply-line" />
                      </div>
                      <span className="rep-review__sent">Sent</span>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
      </div>
      <div className="rep-laptop__base" aria-hidden="true">
        <span className="rep-laptop__hinge" />
      </div>
    </div>
  );
}

function ReputationLaptop() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--reputation"
      role="img"
      aria-label="Shmo Reputation scene: a MacBook showing a reviews dashboard with stat cards and AI-replied reviews."
    >
      <RepLaptopCore />
    </div>
  );
}

function ReputationLaptopMobile() {
  return (
    <div
      className="spotlight__illustration spotlight__illustration--reputation-mobile"
      role="img"
      aria-label="Shmo Reputation scene: a MacBook showing a reviews dashboard with stat cards and AI-replied reviews, sized for mobile."
    >
      <RepLaptopCore />
    </div>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3 7h7l-5.6 4.2L18 21l-6-4-6 4 1.6-7.8L2 9h7z" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
      <path d="M19 14l0.7 2.3L22 17l-2.3 0.7L19 20l-0.7-2.3L16 17l2.3-0.7z" opacity="0.7" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function BubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z" />
    </svg>
  );
}
function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v18h18" />
      <rect x="7" y="13" width="3" height="6" />
      <rect x="12" y="9" width="3" height="10" />
      <rect x="17" y="6" width="3" height="13" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </svg>
  );
}

// ---------- Square callout tiles — every callout is a browser window ----------
function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="callout-tile callout-tile--browser">
      <div className="callout-tile__urlbar">
        <span className="callout-tile__lights">
          <span /><span /><span />
        </span>
      </div>
      <div className="callout-tile__page">{children}</div>
    </div>
  );
}
function FacebookCallout() {
  return (
    <BrowserFrame>
      <div className="callout-page callout-page--facebook">
        <div className="callout-page__cover" />
        <div className="callout-page__profile-row">
          <span className="callout-page__avatar" />
          <div className="callout-page__name-stripe" />
        </div>
        <div className="callout-page__action-row">
          <span className="callout-page__pill">Follow</span>
        </div>
      </div>
    </BrowserFrame>
  );
}
function YoutubeCallout() {
  return (
    <BrowserFrame>
      <div className="callout-page callout-page--youtube">
        <div className="callout-page__cover">
          <span className="callout-page__play">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="callout-page__profile-row">
          <span className="callout-page__avatar" />
          <div className="callout-page__name-stripe" />
        </div>
        <div className="callout-page__action-row">
          <span className="callout-page__pill">Subscribe</span>
        </div>
      </div>
    </BrowserFrame>
  );
}
function DonateCallout() {
  return (
    <BrowserFrame>
      <div className="callout-page callout-page--donate">
        <div className="callout-page__heading">
          <span className="callout-page__heart-inline">
            <HeartIcon />
          </span>
          <div className="callout-page__name-stripe" />
        </div>
        <div className="callout-page__amounts">
          <span className="callout-page__chip">$5</span>
          <span className="callout-page__chip callout-page__chip--active">$25</span>
          <span className="callout-page__chip">$50</span>
        </div>
        <span className="callout-page__pill callout-page__pill--ember callout-page__pill--block">
          Donate
        </span>
      </div>
    </BrowserFrame>
  );
}
function WebsiteCallout() {
  return (
    <BrowserFrame>
      <div className="callout-page callout-page--website">
        <div className="callout-page__stripe callout-page__stripe--head" />
        <div className="callout-page__stripe" />
        <div className="callout-page__stripe callout-page__stripe--short" />
      </div>
    </BrowserFrame>
  );
}

// Hand-drawn-flavored line icons. Cocoa-deep stroke, round caps, ~2px relative
// to the small icon size — matches the design-system iconography rule.
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h-2a3 3 0 0 0-3 3v3H7v3h2v8h3v-8h2.5l.5-3H12V7a1 1 0 0 1 1-1h1V4z" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M11 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0 -18z" />
    </svg>
  );
}
