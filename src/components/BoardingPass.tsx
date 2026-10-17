import { useRef, useState } from 'react';
import { ArrowUpRight, Link2, MonitorPlay, Presentation, Plane } from 'lucide-react';
import { SlideViewer, embedUrl, type ViewerItem } from '@/components/SlideViewer';
import { Reveal } from '@/components/motion';
import { CITY_COORDS, haversine, homeFor } from '@/data/geo';
import { formatEventDate, type SpeakingEvent } from '@/data/talks';

const CODES: Record<string, string> = {
  Berlin: 'BER', Bengaluru: 'BLR', Bangalore: 'BLR', Lisbon: 'LIS', London: 'LON', Cairo: 'CAI', Nairobi: 'NBO',
  Milan: 'MIL', Catania: 'CTA', Stockholm: 'STO', Warsaw: 'WAW', Tbilisi: 'TBS', 'San Francisco': 'SFO', Hamburg: 'HAM',
  'New Delhi': 'DEL', Ahmedabad: 'AMD', Vadodara: 'BDQ', Online: 'WEB',
};

export function cityCode(city: string) {
  return CODES[city] ?? city.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
}

export const PASS_STYLES = ['stub', 'airline', 'line', 'leaf', 'dark', 'tag', 'visa', 'receipt'] as const;
export type PassStyle = (typeof PASS_STYLES)[number];

export const PASS_STYLE_INFO: Record<PassStyle, { name: string; note: string }> = {
  stub: { name: 'Perforated stub', note: 'The current pass. Route, event, and a torn-off stub with the date printed sideways.' },
  airline: { name: 'Airline', note: 'Red header band, big codes, flight-style details and a barcode. The most literal.' },
  line: { name: 'One line', note: 'Dense ticket strip. Codes, event, date on a single row. Scans fast, long lists stay short.' },
  leaf: { name: 'Calendar leaf', note: 'Stub on the left shows the month like a tear-off calendar. Date first.' },
  dark: { name: 'Night flight', note: 'Ink pass with paper type, red route, gold badge. Matches the stage card.' },
  tag: { name: 'Luggage tag', note: 'Tag shape with a punched hole. Destination code is the hero.' },
  visa: { name: 'Visa stamp', note: 'Each trip as a rotated dashed stamp in red ink. Pure passport.' },
  receipt: { name: 'Thermal receipt', note: 'Monospace, dashed rules, zigzag edge. A flight receipt from the printer.' },
};

function useTrip(event: SpeakingEvent) {
  const city = event.location.split(',')[0].trim();
  const country = event.location.split(',').slice(1).join(',').trim();
  const year = Number(event.date.slice(0, 4));
  const home = homeFor(year);
  const to = CITY_COORDS[city];
  const online = event.location === 'Online';
  const km = to && !online ? haversine(home.pos, to) * 2 : 0;
  const local = !online && city === home.city;
  const dist = online ? 'online' : local ? 'home game' : `${(Math.round(km / 100) / 10).toFixed(1)}k km`;
  const [mon, yr] = formatEventDate(event.date).split(' ');
  return { city, country, home, from: online ? 'HOME' : cityCode(home.city), to: cityCode(city), online, local, km, dist, mon, yr };
}

export function BoardingPass({
  event,
  index = 0,
  style = 'stub',
  onHover,
}: {
  event: SpeakingEvent;
  index?: number;
  style?: PassStyle;
  onHover?: (hovering: boolean) => void;
}) {
  const t = useTrip(event);
  const [viewing, setViewing] = useState<ViewerItem | null>(null);
  const Arrow = () =>
    event.url ? (
      <a href={event.url} target="_blank" rel="noopener noreferrer" className="pass__arrow" aria-label={`${event.name} website`}>
        <ArrowUpRight className="h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    ) : null;
  const Badge = () => (event.upcoming ? <span className="pass__badge">Upcoming</span> : null);
  const hasRes = Boolean(event.talk || event.slides || event.video || event.links?.length);
  const open = (url: string, label: string) => {
    if (embedUrl(url)) setViewing({ title: event.talk ?? event.name, subtitle: `${label} · ${event.name}`, url });
    else window.open(url, '_blank', 'noopener,noreferrer');
  };
  // Icon-only resources, inline with the location so the pass keeps its height
  const Res = () =>
    hasRes ? (
      <span className="pass__res">
        {event.slides && (
          <button type="button" onClick={() => open(event.slides!, 'Slides')} className="pass__res-btn" title={event.talk ? `Slides: ${event.talk}` : 'Slides'} aria-label="Slides">
            <Presentation className="h-3.5 w-3.5" />
          </button>
        )}
        {event.video && (
          <button type="button" onClick={() => open(event.video!, 'Recording')} className="pass__res-btn" title={event.talk ? `Recording: ${event.talk}` : 'Recording'} aria-label="Recording">
            <MonitorPlay className="h-3.5 w-3.5" />
          </button>
        )}
        {event.links?.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="pass__res-btn" title={l.label} aria-label={l.label}>
            <Link2 className="h-3.5 w-3.5" />
          </a>
        ))}
      </span>
    ) : null;

  let body: React.ReactNode;
  switch (style) {
    case 'airline':
      body = (
        <>
          <div className="pass__band">
            <span>Himanshoe Air</span>
            <span>Boarding pass</span>
          </div>
          <div className="pass__main">
            <div className="pass__big">
              <span>{t.from}</span>
              <Plane className="h-5 w-5 text-ember rotate-45" />
              <span>{t.to}</span>
            </div>
            <p className="pass__title">
              {event.name} <Badge />
            </p>
            <dl className="pass__details">
              <div><dt>Date</dt><dd>{t.mon} {t.yr}</dd></div>
              <div><dt>City</dt><dd>{t.city}</dd></div>
              <div><dt>Distance</dt><dd>{t.dist}</dd></div>
            </dl>
            <span className="pass__barcode" aria-hidden />
            <Res />
          </div>
          <Arrow />
        </>
      );
      break;
    case 'line':
      body = (
        <>
          <span className="pass__code">{t.from}</span>
          <span className="pass__line"><Plane className="h-3 w-3" /></span>
          <span className="pass__code">{t.to}</span>
          <span className="pass__title truncate">{event.name} <Badge /></span>
          <span className="pass__meta">{t.mon} {t.yr}</span>
          <span className="pass__meta hidden sm:inline">{t.dist}</span>
          <Res />
          <Arrow />
        </>
      );
      break;
    case 'leaf':
      body = (
        <>
          <div className="pass__leaf">
            <span className="pass__leaf-mon">{t.mon}</span>
            <span className="pass__leaf-yr">{t.yr}</span>
          </div>
          <div className="pass__main">
            <div className="pass__route">
              <span className="pass__code">{t.from}</span>
              <span className="pass__line"><Plane className="h-3.5 w-3.5" /></span>
              <span className="pass__code">{t.to}</span>
              <span className="pass__meta">{t.dist}</span>
            </div>
            <p className="pass__title">{event.name} <Badge /></p>
            <p className="pass__sub">
              <span className="truncate">{event.location}</span>
              <Res />
            </p>
          </div>
          <Arrow />
        </>
      );
      break;
    case 'tag':
      body = (
        <>
          <span className="pass__hole" aria-hidden />
          <div className="pass__main">
            <span className="pass__tagcode">{t.to}</span>
            <p className="pass__title">{event.name} <Badge /></p>
            <p className="pass__sub">
              <span className="truncate">from {t.from} · {t.mon} {t.yr} · {t.dist}</span>
              <Res />
            </p>
          </div>
          <Arrow />
        </>
      );
      break;
    case 'visa':
      body = (
        <>
          <span className="pass__visa-top">{t.online ? 'Online' : t.country || t.city}</span>
          <span className="pass__visa-city">{t.city}</span>
          <span className="pass__visa-date">{t.mon} {t.yr}</span>
          <span className="pass__visa-event">{event.name}</span>
          <Badge />
          <Res />
        </>
      );
      break;
    case 'receipt':
      body = (
        <>
          <div className="pass__main">
            <p className="pass__rcpt-row"><span>FROM</span><span>{t.from}</span></p>
            <p className="pass__rcpt-row"><span>TO</span><span>{t.to} · {t.city}</span></p>
            <p className="pass__rcpt-row"><span>DATE</span><span>{t.mon} {t.yr}</span></p>
            <p className="pass__rcpt-row"><span>DIST</span><span>{t.dist}</span></p>
            <p className="pass__rcpt-event">{event.name} <Badge /> <Res /></p>
          </div>
          <Arrow />
        </>
      );
      break;
    case 'dark':
    case 'stub':
    default:
      body = (
        <>
          <div className="pass__main">
            <div className="pass__route">
              <span className="pass__code">{t.from}</span>
              <span className="pass__line"><Plane className="h-3.5 w-3.5" /></span>
              <span className="pass__code">{t.to}</span>
              <span className="pass__meta">{t.dist}</span>
            </div>
            <p className="pass__title">{event.name} <Badge /></p>
            <p className="pass__sub">
              <span className="truncate">{event.location}</span>
              <Res />
            </p>
          </div>
          <div className="pass__stub">
            <span className="pass__date">{t.mon} {t.yr}</span>
            <Arrow />
          </div>
        </>
      );
  }

  const cls = `pass pass--${style} group ${hasRes ? 'has-res' : ''}`;
  const ref = useRef<HTMLDivElement>(null);
  const tilt = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`);
  };
  const untilt = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };
  const hover = {
    onPointerEnter: () => onHover?.(true),
    onPointerMove: tilt,
    onPointerLeave: () => {
      untilt();
      onHover?.(false);
    },
    onFocus: () => onHover?.(true),
    onBlur: () => onHover?.(false),
  };
  return (
    <Reveal as="li" delay={index * 60} className="reveal--print">
      <div ref={ref} className={cls} {...hover}>
        {body}
      </div>
      <SlideViewer item={viewing} onClose={() => setViewing(null)} />
    </Reveal>
  );
}
