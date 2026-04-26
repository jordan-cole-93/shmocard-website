import Link from "next/link";

const COLS: Array<{ title: string; links: Array<{ label: string; href: string; soon?: boolean }> }> = [
  {
    title: "Software",
    links: [
      { label: "Shmo Biz", href: "#biz", soon: true },
      { label: "Shmo Link", href: "#link", soon: true },
      { label: "Shmo Reputation", href: "#reputation", soon: true },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "CR-80 cards", href: "#" },
      { label: "L-Signs", href: "#" },
      { label: "Square discs", href: "#" },
      { label: "Bulk orders", href: "#" },
      { label: "Gift cards", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Affiliate", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "How it works", href: "#" },
      { label: "Activation guide", href: "#" },
      { label: "Returns & warranty", href: "#" },
      { label: "Help center", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream-soft border-t border-hair">
      <div className="shm-container py-9">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="col-span-2">
            <Link
              href="/"
              aria-label="Shmocard home"
              className="inline-flex items-center gap-2"
            >
              <span
                className="rounded-md bg-ink text-paper font-semibold flex items-center justify-center"
                style={{ width: "36px", height: "36px", fontSize: "16px" }}
              >
                S
              </span>
              <span className="text-[18px] font-semibold tracking-[-0.015em] text-ink">
                Shmo
                <em className="font-serif italic font-normal text-ember">
                  card
                </em>
              </span>
            </Link>
            <p className="mt-4 text-[14px] leading-[1.55] text-ink-3 max-w-[36ch]">
              NFC tools for crews. Built in Minneapolis, shipped worldwide.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold tracking-[1.6px] uppercase text-muted mb-3">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[14px] text-ink-2 hover:text-ink transition-colors inline-flex items-center gap-2"
                    >
                      {l.label}
                      {l.soon && (
                        <span className="text-[10px] font-semibold tracking-[1.2px] uppercase rounded-full bg-ember-soft text-ember-deep px-2 py-[2px]">
                          soon
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-hair flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12.5px] text-muted">
          <span>
            © {new Date().getFullYear()} Shmocard, Inc. All rights reserved.
          </span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-ink transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Cookies
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
