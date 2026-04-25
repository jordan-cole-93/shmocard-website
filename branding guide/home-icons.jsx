/* home-icons.jsx — thin line icons used across the home page.
   All icons render at 1em; pass width/height via style or className. */

const Icon = {
  Arrow: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 10h12M11 5l5 5-5 5"/>
    </svg>
  ),
  Cart: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2.5 3h2l1.2 10.2a1.5 1.5 0 0 0 1.5 1.3h7.1a1.5 1.5 0 0 0 1.5-1.2l1-5.3H5.3"/>
      <circle cx="8" cy="17.5" r="1"/>
      <circle cx="15" cy="17.5" r="1"/>
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="9" r="5.5"/><path d="m13 13 3.5 3.5"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 5.5v13a1 1 0 0 0 1.55.83l10.5-6.5a1 1 0 0 0 0-1.66L8.55 4.67A1 1 0 0 0 7 5.5Z"/></svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m4 10.5 4 4 8-9"/>
    </svg>
  ),
  Tap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 10a4 4 0 0 1 8 0"/>
      <path d="M5 10a7 7 0 0 1 14 0"/>
      <path d="M11 14v5"/>
      <path d="M9 17h4"/>
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M10 1.5 12.5 7 18 7.8l-4 4L15 18l-5-3-5 3 1-6.2-4-4L7.5 7 10 1.5Z"/>
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 8 5 5 5-5"/>
    </svg>
  ),
  Twitter: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M15.5 3h2.3l-5 5.7L19 17h-4.6l-3.6-4.7L6.6 17H4.3l5.4-6.2L4 3h4.7l3.3 4.3L15.5 3Zm-.8 12.6h1.3L7.4 4.3H6l8.7 11.3Z"/>
    </svg>
  ),
  Instagram: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="3" width="14" height="14" rx="4"/>
      <circle cx="10" cy="10" r="3.2"/>
      <circle cx="14.4" cy="5.6" r="0.9" fill="currentColor"/>
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M4 3h3v3H4zM4 7.5h3V17H4zM9 7.5h3v1.4c.5-.9 1.6-1.7 3.1-1.7 2.5 0 3.4 1.6 3.4 3.9V17h-3v-5.1c0-1.2-.4-2-1.5-2s-1.7.8-1.7 2V17H9V7.5Z"/>
    </svg>
  ),
  YouTube: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M17.6 5.8c-.2-.9-.9-1.6-1.8-1.8C14.3 3.5 10 3.5 10 3.5s-4.3 0-5.8.4c-.9.2-1.6.9-1.8 1.9C2 7.3 2 10 2 10s0 2.7.4 4.2c.2.9.9 1.6 1.8 1.9 1.5.4 5.8.4 5.8.4s4.3 0 5.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.3.4-4.3s0-2.7-.4-4.2ZM8.5 12.8V7.2l4.8 2.8-4.8 2.8Z"/>
    </svg>
  ),
  Truck: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 5h9v9H2z"/><path d="M11 8h4l2 2.5V14h-6"/>
      <circle cx="6" cy="15.5" r="1.5"/><circle cx="14" cy="15.5" r="1.5"/>
    </svg>
  ),
  Refresh: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 10a7 7 0 0 1 12.5-4.5"/><path d="M16 3v3.5h-3.5"/>
      <path d="M17 10a7 7 0 0 1-12.5 4.5"/><path d="M4 17v-3.5h3.5"/>
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M10 17S3 12.5 3 7.8C3 5.3 5 3.5 7.3 3.5c1.5 0 2.4.8 2.7 1.4.3-.6 1.2-1.4 2.7-1.4C15 3.5 17 5.3 17 7.8 17 12.5 10 17 10 17Z"/>
    </svg>
  ),
  Camera: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2.5" y="5.5" width="15" height="11" rx="2"/>
      <path d="M7 5.5l1-2h4l1 2"/>
      <circle cx="10" cy="11" r="3"/>
    </svg>
  ),
};

Object.assign(window, { Icon });
