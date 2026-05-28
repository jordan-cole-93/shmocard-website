"use client";

// NavLoginLink — desktop ctaRow login link.
// Suppressed on /offer/* routes (conversion funnel, no escape hatches).

import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

export default function NavLoginLink() {
  const pathname = usePathname();
  if (pathname.startsWith("/offer/")) return null;

  return (
    <a
      href="https://app.shmocard.com/auth/login"
      className={styles.loginLink}
      rel="noopener"
    >
      Log in
    </a>
  );
}
