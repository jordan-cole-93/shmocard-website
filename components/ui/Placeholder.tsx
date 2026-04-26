type PlaceholderProps = {
  label: string;
  aspectRatio?: string;
  className?: string;
};

export default function Placeholder({
  label,
  aspectRatio = "16/9",
  className = "",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`w-full rounded-xl bg-cream-soft border border-dashed border-hair-2 flex flex-col items-center justify-center text-center px-6 py-8 ${className}`}
      style={{ aspectRatio }}
    >
      <span className="t-eyebrow text-muted">Placeholder</span>
      <span className="t-body mt-2 text-ink-3 max-w-[28ch]">{label}</span>
    </div>
  );
}
