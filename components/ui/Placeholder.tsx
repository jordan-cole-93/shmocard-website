import { ImageIcon } from "lucide-react";

interface PlaceholderProps {
  /** Short label for what will live here (e.g. "Hero mascot · toolkit"). */
  label: string;
  /** CSS aspect-ratio string (e.g. "1 / 1", "4 / 3"). Default: "1 / 1". */
  aspect?: string;
  /** Optional className for the wrapper. */
  className?: string;
}

/**
 * On-brand placeholder for mascot and product images during the build.
 * Real images swap in later — never use raw PNGs in components.
 */
export function Placeholder({
  label,
  aspect = "1 / 1",
  className = "",
}: PlaceholderProps) {
  return (
    <div
      className={`placeholder ${className}`}
      style={{ aspectRatio: aspect }}
      aria-hidden="true"
    >
      <ImageIcon className="placeholder__icon" />
      <span className="placeholder__label">{label}</span>
    </div>
  );
}
