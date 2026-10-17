import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/* ── Per-character reveal ─────────────────────────────────────────────── */

export function Chars({ text, start = 0, step = 26 }: { text: string; start?: number; step?: number }) {
  return (
    <span className="clip inline-block" aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="char inline-block"
          style={{ '--d': `${start + i * step}ms` } as React.CSSProperties}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

/** Words of a headline, each revealed character by character with a running delay. */
export function Headline({ words, start = 60, className = '' }: { words: string[]; start?: number; className?: string }) {
  let cursor = start;
  return (
    <span className={className}>
      {words.map((w, i) => {
        const s = cursor;
        cursor += w.length * 26 + 50;
        return (
          <span key={`${w}-${i}`} className="inline-block mr-[0.22em] last:mr-0">
            <Chars text={w} start={s} />
          </span>
        );
      })}
    </span>
  );
}

/** Standard page header: character-revealed title, rising intro line, optional aside. */
export function PageTitle({
  title,
  children,
  aside,
}: {
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const words = title.split(' ');
  const introDelay = title.length * 26 + 120;
  return (
    <header className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
      <div>
        <h1 className="display text-5xl md:text-7xl">
          <Headline words={words} />
        </h1>
        {children && (
          <p className="rise mt-5 text-lg sm:text-xl text-dim max-w-xl leading-snug" style={{ '--d': `${introDelay}ms` } as React.CSSProperties}>
            {children}
          </p>
        )}
      </div>
      {aside && (
        <div className="rise" style={{ '--d': `${introDelay + 120}ms` } as React.CSSProperties}>
          {aside}
        </div>
      )}
    </header>
  );
}

/* ── Tilt card ────────────────────────────────────────────────────────── */

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** entrance delay in ms */
  delay?: number;
  to?: string;
  href?: string;
}

/**
 * A card that tilts toward the pointer with a soft sheen. The spring entrance
 * lives on a wrapper so it never fights the tilt transform.
 */
export function TiltCard({ children, className = '', delay = 0, to, href }: TiltCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  const cls = `tile3d group relative flex flex-col h-full ${className}`;
  const body = (
    <>
      {children}
      <span className="tile3d__sheen" aria-hidden />
    </>
  );

  return (
    <div className="pop h-full" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {to ? (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} onPointerMove={onMove} onPointerLeave={onLeave} className={cls}>
          {body}
        </Link>
      ) : href ? (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className={cls}
        >
          {body}
        </a>
      ) : (
        <article ref={ref as React.Ref<HTMLElement>} onPointerMove={onMove} onPointerLeave={onLeave} className={cls}>
          {body}
        </article>
      )}
    </div>
  );
}

/* ── Count up ─────────────────────────────────────────────────────────── */

export function CountUp({ to, duration = 1100, delay = 0, format }: { to: number; duration?: number; delay?: number; format?: (n: number) => string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    let frame = 0;
    let startTs = 0;
    const timer = window.setTimeout(() => {
      const tick = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min(1, (ts - startTs) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [to, duration, delay]);
  return <>{format ? format(value) : value.toLocaleString()}</>;
}

/* ── Reveal on scroll ─────────────────────────────────────────────────── */


/**
 * Animates its children in when they enter the viewport (once).
 * Falls back to visible immediately when IntersectionObserver is missing
 * or the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    io.observe(el);
    // Safety net: never leave content hidden if the observer cannot fire (hidden tab, prerender)
    const fallback = window.setTimeout(() => setInView(true), 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const Comp = Tag as unknown as 'div';
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Comp>
  );
}
