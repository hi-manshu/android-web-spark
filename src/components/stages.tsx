/**
 * Small motion stages: each loop tells one library's story.
 * Used on the home tiles and the docs landing cards.
 */

/** Krate: records flow into a store. A new row enters from the left, the stack shifts, the oldest leaves. */
export function KrateStage({ className = '' }: { className?: string }) {
  return (
    <div className={`stage stage-krate ${className}`} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="krate-row" style={{ '--i': i } as React.CSSProperties}>
          <span className="krate-row__key" />
          <span className="krate-row__val" />
        </span>
      ))}
    </div>
  );
}

/** Charty: bars spring up one by one, then a line is drawn across their tops. */
export function ChartyStage({ className = '' }: { className?: string }) {
  const bars = [34, 62, 46, 84, 58, 92, 70];
  const pts = bars.map((h, i) => `${(i / (bars.length - 1)) * 100},${100 - h}`).join(' ');
  return (
    <div className={`stage stage-charty ${className}`} aria-hidden>
      <div className="charty-bars">
        {bars.map((h, i) => (
          <span key={i} className="charty-bar" style={{ '--h': `${h}%`, '--i': i } as React.CSSProperties} />
        ))}
      </div>
      <svg className="charty-line" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={pts}
          fill="none"
          stroke="#111"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Kalendar: "today" hops across the month. */
export function KalendarStage({ className = '' }: { className?: string }) {
  return (
    <div className={`stage stage-kalendar ${className}`} aria-hidden>
      <div className="kal-grid">
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className="kal-day" />
        ))}
        <span className="kal-today" />
      </div>
    </div>
  );
}

/** Talks: a live equaliser. */
export function TalksStage({ className = '' }: { className?: string }) {
  return (
    <div className={`stage stage-talks ${className}`} aria-hidden>
      <span className="talks-live" />
      <div className="talks-eq">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <span key={i} className="talks-bar" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
