import { ArrowUpRight } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CountUp, Headline, Reveal } from '@/components/motion';
const TravelMap = lazy(() => import('@/components/TravelMap').then((m) => ({ default: m.TravelMap })));
import { BoardingPass, PASS_STYLES, type PassStyle } from '@/components/BoardingPass';
import {
  countryCount,
  inPersonCount,
  nextEvent,
  groupEventsByYear,
  formatEventDate,
  SESSIONIZE_PROFILE_URL,
} from '@/data/talks';
import { useTalks } from '@/hooks/useTalks';
import { TiltCard } from '@/components/motion';

export default function Talks() {
  const { events, talks } = useTalks();
  const since = events[events.length - 1].date.slice(0, 4);
  const nextTalk = nextEvent(events);
  const cities = Array.from(new Set(events.map((e) => e.location.split(',')[0].trim())));
  const heroRef = useRef<HTMLElement>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'slides' | 'video'>('all');
  const shown = events.filter((e) => (filter === 'slides' ? Boolean(e.slides) : filter === 'video' ? Boolean(e.video) : true));
  const byYear = groupEventsByYear(shown);
  const withSlides = events.filter((e) => e.slides).length;
  const withVideo = events.filter((e) => e.video).length;
  const [params] = useSearchParams();
  const passParam = params.get('pass');
  const passStyle: PassStyle = (PASS_STYLES as readonly string[]).includes(passParam ?? '') ? (passParam as PassStyle) : 'stub';

  // Pointer parallax inside the stage card
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', ((px - 0.5) * 2).toFixed(3));
        el.style.setProperty('--my', ((py - 0.5) * 2).toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const eventSchema = {
    '@context': 'https://schema.org',
    '@graph': events.slice(0, 40).map((e) => ({
      '@type': 'Event',
      name: `${e.talk ? `${e.talk} at ` : 'Talk at '}${e.name}`,
      startDate: e.day ? `${e.date}-${String(e.day).padStart(2, '0')}` : e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: e.location === 'Online' ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
      location:
        e.location === 'Online'
          ? { '@type': 'VirtualLocation', url: e.url ?? 'https://himanshoe.com/talks' }
          : { '@type': 'Place', name: e.name, address: e.location },
      performer: { '@type': 'Person', name: 'Himanshu Singh', url: 'https://himanshoe.com' },
      organizer: e.url ? { '@type': 'Organization', name: e.name, url: e.url } : undefined,
      url: e.url,
    })),
  };

  return (
    <div className="relative container py-10 md:py-14 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <header ref={heroRef} className="stagehero stagehero--compact mb-12">
        <div className="stagehero__photo parallax" style={{ '--depth': -10 } as React.CSSProperties}>
          <img src="/images/speaking-wide.jpg" alt="" className="stagehero__img" loading="eager" />
        </div>
        <span className="stagehero__fade" aria-hidden />
        <span className="stagehero__grain" aria-hidden />

        {/* Live equaliser by the mic */}
        <div className="stagehero__eq parallax" aria-hidden style={{ '--depth': 10 } as React.CSSProperties}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className="stagehero__bar" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>

        {/* Floating stickers */}
        <div className="stagehero__stickers hidden md:block" aria-hidden>
          <span className="parallax pop absolute right-[6%] top-[12%]" style={{ '--depth': 22, '--d': '900ms' } as React.CSSProperties}>
            <span className="sticker sticker-gold float-a" style={{ '--rot': '-5deg' } as React.CSSProperties}>
              Most Active Speaker, 2023 and 2025
            </span>
          </span>
          {nextTalk && (
            <span className="parallax pop absolute right-[14%] top-[34%]" style={{ '--depth': 32, '--d': '1050ms' } as React.CSSProperties}>
              <span className="sticker sticker-white float-c" style={{ '--rot': '4deg' } as React.CSSProperties}>
                Next: {nextTalk.name}
              </span>
            </span>
          )}
        </div>

        <div className="stagehero__body">
          <h1 className="display text-5xl md:text-7xl text-paper">
            <Headline words={['Talks']} start={450} />
          </h1>
          <p className="rise mt-5 text-lg sm:text-xl text-paper/80 max-w-xl leading-snug" style={{ '--d': '700ms' } as React.CSSProperties}>
            I have spoken at <span className="text-gold font-semibold"><CountUp to={inPersonCount(events)} delay={900} /></span> conferences in{' '}
            <span className="text-gold font-semibold"><CountUp to={countryCount(events)} delay={1000} /></span> countries since {since}, mostly at
            droidcon and DevFest, about Android performance, Kotlin, and Compose.
          </p>
          <a
            href={SESSIONIZE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pop mt-7 inline-flex items-center gap-2 rounded-full bg-gold text-ink px-5 py-2.5 text-sm font-semibold hover:bg-surface transition-colors"
            style={{ '--d': '1000ms' } as React.CSSProperties}
          >
            Speaker profile on Sessionize
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* City ticker along the bottom edge */}
        <div className="stagehero__ticker" aria-hidden>
          <div className="stagehero__ticker-track">
            {[...cities, ...cities].map((c, i) => (
              <span key={`${c}-${i}`} className="stagehero__city">
                <span className="stagehero__dot" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        {/* Map stays in view while the timeline scrolls */}
        <Reveal className="lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold tracking-tight mb-5">Where the talks took me</h2>
          <Suspense fallback={<div className="tile aspect-[2/1] animate-pulse" />}>
            <TravelMap events={events} active={activeYear} onActiveChange={setActiveYear} focus={focusKey} />
          </Suspense>
        </Reveal>

        <section>
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Where I have spoken</h2>
              {(withSlides > 0 || withVideo > 0) && (
                <div className="flex gap-1.5">
                  {([
                    ['all', 'All'],
                    ['slides', `Slides (${withSlides})`],
                    ['video', `Recordings (${withVideo})`],
                  ] as const).map(([k, label]) =>
                    k === 'all' || (k === 'slides' ? withSlides : withVideo) > 0 ? (
                      <button key={k} onClick={() => setFilter(k)} className={`chip py-1 ${filter === k ? 'chip-active' : 'hover:border-ink hover:text-ink'}`}>
                        {label}
                      </button>
                    ) : null,
                  )}
                </div>
              )}
            </div>
          </Reveal>
          <ol className="flex flex-col gap-8" onMouseLeave={() => setActiveYear(null)}>
            {byYear.map(([year, yearEvents], i) => (
              <Reveal
                as="li"
                key={year}
                className={`transition-opacity duration-300 ${i > 0 ? 'pt-8 border-t border-line' : ''} ${
                  activeYear !== null && activeYear !== Number(year) ? 'opacity-40' : ''
                }`}
                delay={i === 0 ? 300 : 0}
              >
                <button
                  type="button"
                  onMouseEnter={() => setActiveYear(Number(year))}
                  onFocus={() => setActiveYear(Number(year))}
                  className={`flex items-center gap-4 mb-4 text-left transition-colors ${activeYear === Number(year) ? 'text-ember' : 'text-ink'}`}
                  aria-label={`Highlight ${year} on the map`}
                >
                  <span className="display text-3xl sm:text-4xl leading-none">{year}</span>
                  <span className="stamp">
                    {yearEvents.filter((e) => e.location !== 'Online').length || 'online'}{' '}
                    {yearEvents.filter((e) => e.location !== 'Online').length === 1 ? 'trip' : yearEvents.filter((e) => e.location !== 'Online').length ? 'trips' : ''}
                  </span>
                </button>
                <ul className="flex flex-col gap-3" onMouseEnter={() => setActiveYear(Number(year))}>
                  {yearEvents.map((event, j) => (
                    <BoardingPass
                      key={`${event.name}-${event.date}`}
                      event={event}
                      index={j}
                      style={passStyle}
                      onHover={(hovering) => setFocusKey(hovering ? `${event.name}-${event.date}` : null)}
                    />
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      {/* Sessions: what the talks are about */}
      {talks.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">What I talk about</h2>
                <p className="text-dim text-sm mt-1">
                  {talks.length} sessions, from Flow and Compose internals to shipping performance in apps with millions of users.
                </p>
              </div>
              <a href={SESSIONIZE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="btn-line text-xs">
                All sessions on Sessionize
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {talks.map((talk, i) => {
              const givenAt = events.filter((e) => e.talk && e.talk.toLowerCase() === talk.title.toLowerCase());
              return (
                <Reveal as="li" key={talk.url} delay={(i % 3) * 80} className="h-full">
                  <TiltCard href={talk.url} className="p-5 session">
                    <span className="session__no">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-base font-bold tracking-tight leading-snug mt-3 group-hover:text-ember transition-colors">{talk.title}</h3>
                    {talk.summary && <p className="text-sm text-dim leading-relaxed mt-2 line-clamp-3 flex-1">{talk.summary}</p>}
                    {givenAt.length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-1.5">
                        {givenAt.map((e) => (
                          <span key={`${e.name}-${e.date}`} className="chip">
                            {e.name}
                          </span>
                        ))}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-dim group-hover:text-ink transition-colors">
                      Session details
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </TiltCard>
                </Reveal>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
