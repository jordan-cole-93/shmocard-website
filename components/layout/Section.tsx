// components/layout/Section.tsx
// Reusable section wrapper enforcing the 4-color rotation rule (REQ-09)
// at the type level. Pure server component.
//
// Visual classes (.shm-bg-{bg}, .shm-wave, .shm-wave--{color}) live in
// context/design-system/colors_and_type.css. This component composes
// them — it does not restyle them.
//
// Wave size note: the design system ships only `.shm-wave--lg` (64px) and
// `.shm-wave--xl` (80px) modifiers; the default (no modifier) is the
// thin 18px wave. The `waveSize` prop accepts 'sm' | 'md' | 'lg' | 'xl'
// for future-proofing — 'sm' and 'md' both render the default thin wave
// (no extra class emitted), 'lg' and 'xl' emit their respective modifier.

import type { ReactNode } from "react";
import { Container } from "./Container";

export type SectionBg = "marsh" | "graham" | "ember" | "cocoa";
export type SectionWaveSize = "sm" | "md" | "lg" | "xl";

export type SectionProps = {
  bg: SectionBg;
  nextBg?: SectionBg;
  waveSize?: SectionWaveSize;
  containerClassName?: string;
  children: ReactNode;
  id?: string;
  ariaLabel?: string;
};

function waveSizeClass(size: SectionWaveSize): string {
  // Only 'lg' and 'xl' have CSS modifiers. 'sm' / 'md' use the default
  // thin wave (no extra class emitted).
  if (size === "lg") return "shm-wave--lg";
  if (size === "xl") return "shm-wave--xl";
  return "";
}

export function Section({
  bg,
  nextBg,
  waveSize = "md",
  containerClassName,
  children,
  id,
  ariaLabel,
}: SectionProps) {
  const sectionCls = `shm-bg-${bg}`;
  const containerCls = `shm-container ${containerClassName ?? ""}`.trim();
  const sizeCls = waveSizeClass(waveSize);
  const waveCls = `shm-wave shm-wave--${nextBg}${sizeCls ? ` ${sizeCls}` : ""}`;

  return (
    <section className={sectionCls} id={id} aria-label={ariaLabel}>
      <div className={containerCls}>{children}</div>
      {nextBg ? <div className={waveCls} aria-hidden="true" /> : null}
    </section>
  );
}

export default Section;
