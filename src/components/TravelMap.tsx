import { useMemo, useRef, useState } from 'react';
import land from '@/data/landDots.json';
import { CITY_COORDS, greatCircle, haversine, homeFor, type LatLon } from '@/data/geo';
import type { SpeakingEvent } from '@/data/talks';
import { CountUp } from '@/components/motion';

/**
 * Where the talks took me: great-circle routes from home (Bangalore until
 * 2020, Berlin from 2021) to every conference city, with a marker flying out
 * and back, and the kilometres covered each year.
 */

const W = 1000;
const box = land.box as { lonMin: number; lonMax: number; latMin: number; latMax: number };
const H = Math.round((W * (box.latMax - box.latMin)) / (box.lonMax - box.lonMin));

function project(p: LatLon): [number, number] {
  const x = ((p.lon - box.lonMin) / (box.lonMax - box.lonMin)) * W;
  const y = ((box.latMax - p.lat) / (box.latMax - box.latMin)) * H;
  return [x, y];
}

function pathFor(a: LatLon, b: LatLon): string {
  return greatCircle(a, b)
    .map((p, i) => {
      const [x, y] = project(p);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

interface Trip {
  key: string;
  year: number;
  city: string;
  event: SpeakingEvent;
  home: ReturnType<typeof homeFor>;
  to: LatLon;
  km: number;
  d: string;
}

export { haversine, homeFor, CITY_COORDS };

export function TravelMap({
  events,
  active: controlled,
  onActiveChange,
  dark = false,
  ledger = true,
  className = '',
  focus = null,
}: {
  events: SpeakingEvent[];
  active?: number | null;
  onActiveChange?: (year: number | null) => void;
  dark?: boolean;
  ledger?: boolean;
  className?: string;
  /** trip key to zoom into (name-date); other routes fade out */
  focus?: string | null;
}) {
  const [internal, setInternal] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tilt = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 3).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 3).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const untilt = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };
  const active = controlled !== undefined ? controlled : internal;
  const setActive = (y: number | null) => {
    setInternal(y);
    onActiveChange?.(y);
  };

  const { trips, years, total, cities, cityYears } = useMemo(() => {
    const trips: Trip[] = [];
    for (const e of [...events].reverse()) {
      const city = e.location.split(',')[0].trim();
      const to = CITY_COORDS[city];
      if (!to) continue;
      const year = Number(e.date.slice(0, 4));
      const home = homeFor(year);
      const km = haversine(home.pos, to) * 2;
      trips.push({ key: `${e.name}-${e.date}`, year, city, event: e, home, to, km, d: pathFor(home.pos, to) });
    }
    const byYear = new Map<number, number>();
    for (const t of trips) byYear.set(t.year, (byYear.get(t.year) ?? 0) + t.km);
    const years = [...byYear.entries()].sort((a, b) => a[0] - b[0]);
    const total = trips.reduce((s, t) => s + t.km, 0);
    const cities = new Map<string, LatLon>();
    const cityYears = new Map<string, Set<number>>();
    for (const t of trips) {
      cities.set(t.city, t.to);
      cityYears.set(t.city, (cityYears.get(t.city) ?? new Set()).add(t.year));
    }
    return { trips, years, total, cities, cityYears };
  }, [events]);

  const inEurope = (p: LatLon) => p.lat > 35 && p.lat < 62 && p.lon > -12 && p.lon < 30;

  const maxYear = Math.max(...years.map(([, km]) => km), 1);

  // Zoom to the focused trip: fit its arc (home + city) with padding
  const focused = focus ? trips.find((t) => t.key === focus) : undefined;
  const view = useMemo(() => {
    if (!focused) return { z: 1, tx: 0, ty: 0 };
    const pts = greatCircle(focused.home.pos, focused.to).map(project);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const bw = Math.max(maxX - minX, 60), bh = Math.max(maxY - minY, 60);
    const z = Math.min(3.2, Math.max(1.15, Math.min(W / (bw * 1.8), H / (bh * 1.8))));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    return { z, tx: W / 2 - z * cx, ty: H / 2 - z * cy };
  }, [focused]);
  const homes = useMemo(() => {
    const seen = new Map<string, LatLon>();
    for (const t of trips) seen.set(t.home.name, t.home.pos);
    return [...seen.entries()];
  }, [trips]);

  return (
    <div ref={cardRef} onPointerMove={tilt} onPointerLeave={untilt} className={`tmap tmap--tilt ${dark ? 'tmap--dark' : 'tile'} p-4 sm:p-6 ${className}`} data-active={active ?? 'all'}>
      <div className="flex flex-col gap-6">
        <div className="relative w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className={`tmap__svg w-full h-auto ${focused ? 'is-focused' : ''}`} role="img" aria-label="Map of conference travel">
            <g className="tmap__world" style={{ transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`, '--z': view.z } as React.CSSProperties}>
            {/* land */}
            <g className="tmap__land">
              {(land.dots as [number, number][]).map(([lon, lat], i) => {
                const [x, y] = project({ lat, lon });
                return <circle key={i} cx={x} cy={y} r={1.6} />;
              })}
            </g>

            {/* routes, oldest first so the newest draw last */}
            <g className="tmap__routes">
              {trips.map((t, i) => (
                <g
                  key={t.key}
                  className={`tmap__trip ${(active !== null && active !== t.year) || (focused && focused.key !== t.key) ? 'is-dim' : ''} ${focused?.key === t.key ? 'is-focus' : ''}`}
                  style={{ '--i': i, '--path': `path('${t.d}')` } as React.CSSProperties}
                >
                  <path key={focused?.key === t.key ? 'focus' : 'idle'} className="tmap__arc" d={t.d} />
                  <circle className="tmap__plane" r={3.2} />
                </g>
              ))}
            </g>

            {/* cities */}
            <g className="tmap__cities">
              {[...cities.entries()].map(([name, pos], i) => {
                const [x, y] = project(pos);
                const on = (active !== null && cityYears.get(name)?.has(active)) || (focused ? focused.city === name : false);
                const dim = (active !== null && !on) || (focused ? focused.city !== name : false);
                const labelled = on || (!dim && !inEurope(pos));
                return (
                  <g
                    key={name}
                    className={`tmap__city ${labelled ? 'is-labelled' : ''} ${dim ? 'is-dim' : ''}`}
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <circle cx={x} cy={y} r={3.4} />
                    <text x={x + 7} y={y - 6}>
                      {name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* homes */}
            {homes.map(([name, pos]) => {
              const [x, y] = project(pos);
              return (
                <g key={name} className="tmap__home">
                  <circle className="tmap__home-ring" cx={x} cy={y} r={10} />
                  <circle cx={x} cy={y} r={5} />
                  <text x={x} y={y + 22} textAnchor="middle">
                    {name}
                  </text>
                </g>
              );
            })}
            </g>
          </svg>
        </div>

        {/* Ledger */}
        {ledger && <div className="flex flex-col gap-5 border-t border-line pt-5">
          <div>
            <p className="text-sm text-dim">Kilometres flown for talks</p>
            <p className="display text-4xl mt-1">
              <CountUp to={Math.round(total / 100) * 100} delay={600} />
              <span className="text-dim text-lg font-semibold ml-1">km</span>
            </p>
            <p className="text-xs text-dim mt-1">Round trips, as the crow flies. Home was Bangalore until 2020, Berlin since 2021.</p>
          </div>

          <ol className="flex-1 grid grid-cols-4 gap-x-3 gap-y-3" onMouseLeave={() => setActive(null)}>
            {years.map(([year, km], i) => (
              <li key={year}>
                <button
                  onMouseEnter={() => setActive(year)}
                  onFocus={() => setActive(year)}
                  onClick={() => setActive(active === year ? null : year)}
                  className={`w-full text-left group ${active === year ? 'is-on' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="font-mono text-xs text-dim group-hover:text-ink transition-colors">{year}</span>
                  <span className="block text-sm font-semibold tabular-nums leading-tight">
                    {km < 100 ? 'home' : <CountUp to={km} delay={700 + i * 90} duration={1200} format={(n) => `${(Math.round(n / 100) / 10).toFixed(1)}k km`} />}
                  </span>
                  <span className="tmap__bar">
                    <span className="tmap__bar-fill" style={{ '--w': `${Math.max(3, (km / maxYear) * 100)}%`, '--d': `${700 + i * 90}ms` } as React.CSSProperties} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>}
      </div>
    </div>
  );
}
