// components/layout/Container.tsx
// Reusable .shm-container wrapper. Pure server component.
// Source-of-truth for the design system's `.shm-container` (max-width 1200,
// 28px gutter — see .claude/skills/shmocard-design-system/colors_and_type.css line 271).
//
// Polymorphic: render as 'div' (default), 'section', 'header', 'footer',
// or 'main' via the `as` prop. This stays minimal — it's the bare wrapper.

import type { ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main";
};

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  const cls = `shm-container ${className ?? ""}`.trim();
  return <Tag className={cls}>{children}</Tag>;
}

export default Container;
