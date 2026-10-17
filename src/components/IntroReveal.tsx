import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Landing intro, modelled on zero.university:
 *   1. solid ember sheet
 *   2. the wordmark is drawn as thin construction lines
 *   3. letters fill from left to right
 *   4. the camera zooms through the last "o" and the page shows through the
 *      letters until it fills the screen
 *
 * The letters are cut out of the ember sheet (an SVG mask), so what shows
 * "inside" them is the real page underneath.
 */

export const INTRO_TOTAL_MS = 2950;
/** The hero starts only once the sheet has fully faded, so nothing leaks through the letters. */
export const INTRO_HERO_START_MS = INTRO_TOTAL_MS;

const WORD = 'himanshoe';
const VIEW_W = 1600;
const VIEW_H = 900;
const FONT_SIZE = 230;
const BASELINE = 540;

interface Guide {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

export function IntroReveal({ onDone }: { onDone: () => void }) {
  const measureRef = useRef<SVGTextElement>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [origin, setOrigin] = useState<string>(`${VIEW_W / 2 + FONT_SIZE * 1.95}px ${BASELINE - FONT_SIZE * 0.26}px`);
  const [phase, setPhase] = useState<'wait' | 'draw' | 'fill' | 'zoom'>('wait');

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const start = () => {
      if (cancelled) return;
      const t = measureRef.current;
      if (t) {
        const box = t.getBBox();
        const pad = 140;
        const xh = BASELINE - FONT_SIZE * 0.52;
        const asc = BASELINE - FONT_SIZE * 0.72;
        const desc = BASELINE + FONT_SIZE * 0.2;
        const g: Guide[] = [
          { x1: box.x - pad, y1: BASELINE, x2: box.x + box.width + pad, y2: BASELINE, delay: 0 },
          { x1: box.x - pad * 0.6, y1: xh, x2: box.x + box.width + pad * 0.6, y2: xh, delay: 120 },
          { x1: box.x - pad * 0.3, y1: asc, x2: box.x + box.width * 0.55, y2: asc, delay: 240 },
          { x1: box.x + box.width * 0.4, y1: desc, x2: box.x + box.width + pad * 0.3, y2: desc, delay: 300 },
        ];
        [0, 2, 5, WORD.length - 1].forEach((i, k) => {
          try {
            const ext = t.getExtentOfChar(i);
            g.push({ x1: ext.x, y1: asc - 90, x2: ext.x, y2: desc + 70, delay: 160 + k * 90 });
          } catch {
            /* ignore */
          }
        });
        g.push({ x1: box.x - 60, y1: desc + 40, x2: box.x + 260, y2: asc - 120, delay: 420 });
        setGuides(g);

        try {
          const o = t.getExtentOfChar(WORD.length - 1);
          setOrigin(`${o.x + o.width / 2}px ${BASELINE - FONT_SIZE * 0.26}px`);
        } catch {
          /* keep estimate */
        }
      }

      setPhase('draw');
      timers.push(window.setTimeout(() => setPhase('fill'), 1150));
      timers.push(window.setTimeout(() => setPhase('zoom'), 1950));
      timers.push(window.setTimeout(onDone, INTRO_TOTAL_MS));
    };

    const ready = document.fonts?.load(`800 ${FONT_SIZE}px "Bricolage Grotesque"`) ?? Promise.resolve();
    Promise.race([ready, new Promise((r) => setTimeout(r, 900))]).then(() => requestAnimationFrame(start));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  const textProps = {
    x: VIEW_W / 2,
    y: BASELINE,
    textAnchor: 'middle' as const,
    fontFamily: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
    fontWeight: 800,
    fontSize: FONT_SIZE,
    letterSpacing: -FONT_SIZE * 0.04,
    style: { fontVariationSettings: '"opsz" 96, "wdth" 92' } as React.CSSProperties,
  };

  return createPortal(
    <div className={`intro intro-${phase}`} aria-hidden>
      <svg className="intro__svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="intro-hole" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
            <rect width={VIEW_W} height={VIEW_H} fill="white" />
            <text {...textProps} fill="black" className="intro__hole" style={{ ...textProps.style, transformOrigin: origin }}>
              {WORD}
            </text>
          </mask>
        </defs>

        {/* Ember sheet with the wordmark cut out */}
        <rect width={VIEW_W} height={VIEW_H} fill="#E31E24" mask="url(#intro-hole)" />

        {/* Cover: ember letters over the holes, swept away left to right */}
        <text {...textProps} fill="#E31E24" className="intro__cover">
          {WORD}
        </text>

        {/* Blueprint outline */}
        <text {...textProps} fill="none" stroke="#FBFAF7" strokeWidth={1.4} className="intro__outline">
          {WORD}
        </text>

        <g className="intro__guides" stroke="#FBFAF7" strokeWidth={1} opacity={0.55}>
          {guides.map((g, i) => {
            const len = Math.hypot(g.x2 - g.x1, g.y2 - g.y1);
            return (
              <line
                key={i}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                className="intro__guide"
                style={{ '--len': len, '--d': `${g.delay}ms` } as React.CSSProperties}
              />
            );
          })}
        </g>

        {/* Hidden copy used only for measuring */}
        <text ref={measureRef} {...textProps} fill="none" stroke="none" style={{ ...textProps.style, visibility: 'hidden' }}>
          {WORD}
        </text>
      </svg>
    </div>,
    document.body,
  );
}
