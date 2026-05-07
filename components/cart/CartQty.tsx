"use client";

type CartQtyProps = {
  value: number;
  onChange: (next: number) => void;
  busy?: boolean;
  /** Hard min/max — server also clamps 1..99. */
  min?: number;
  max?: number;
};

export default function CartQty({
  value,
  onChange,
  busy = false,
  min = 1,
  max = 99,
}: CartQtyProps) {
  const dec = () => {
    if (busy) return;
    const next = Math.max(min, value - 1);
    if (next !== value) onChange(next);
  };
  const inc = () => {
    if (busy) return;
    const next = Math.min(max, value + 1);
    if (next !== value) onChange(next);
  };

  return (
    <div className="shm-qty" aria-busy={busy ? "true" : "false"}>
      <button
        type="button"
        className="shm-qty__btn"
        disabled={value <= min || busy}
        onClick={dec}
        aria-label="Decrease quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span className="shm-qty__val">{value}</span>
      <button
        type="button"
        className="shm-qty__btn"
        disabled={value >= max || busy}
        onClick={inc}
        aria-label="Increase quantity"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M6 2v8M2 6h8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
