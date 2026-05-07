// components/pdp/PdpChecklist.tsx
// Value-prop bullet list. Server component. Composes .shm-checklist--featured.

type Props = {
  items: string[];
};

export default function PdpChecklist({ items }: Props) {
  return (
    <ul className="shm-checklist shm-checklist--featured">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
