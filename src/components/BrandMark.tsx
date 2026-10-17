/** Air Jordan 1 high-top, drawn as a single-weight line icon. */
export function Jordan({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* upper: ankle collar down to the toe */}
      <path d="M3.2 17.2h16.2a1.6 1.6 0 0 0 .3-3.2l-5.4-1.4-3-3.6V5.3a.9.9 0 0 0-.9-.9H8.2a.9.9 0 0 0-.9.9V10l-3.5 2.6a2.3 2.3 0 0 0-.9 1.8z" />
      {/* sole line */}
      <path d="M3.2 17.2c.4 1.3 1.3 1.9 2.6 1.9h12.4c.9 0 1.5-.4 1.9-1.1" />
      {/* swoosh */}
      <path d="M8.6 13.6c2.4 1.2 5.2 1.3 8.6.2" />
      {/* laces */}
      <path d="M8.6 7.2h2.2M8.6 9.2h2.2M8.6 11.2h2.2" />
    </svg>
  );
}

/**
 * Brand mark: hi, man, shoe as three coins on neutral tones.
 * The hand waves and the coins fan apart on hover (styles in index.css).
 */
export function BrandMark() {
  return (
    <span className="brand-stack" aria-hidden>
      <span className="brand-coin brand-coin--a">
        <span className="brand-wave">👋</span>
      </span>
      <span className="brand-coin brand-coin--b">🧑</span>
      <span className="brand-coin brand-coin--c">👟</span>
    </span>
  );
}
