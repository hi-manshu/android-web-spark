import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { LinkedInImport } from '@/components/LinkedInImport';
import { countryCount, formatEventDate, inPersonCount, nextEvent } from '@/data/talks';
import { useTalks } from '@/hooks/useTalks';
import { CountUp, Headline, Reveal, TiltCard } from '@/components/motion';
import { ContactSection } from '@/components/ContactSection';

const skills = [
  'Kotlin',
  'Jetpack Compose',
  'Kotlin Multiplatform',
  'Coroutines and Flow',
  'Room',
  'KSP',
  'Baseline Profiles',
  'Ktor',
  'Hilt and Koin',
  'Technical writing',
];

const experience = [
  {
    title: 'Senior Android Developer',
    company: 'NordVPN',
    period: '2022 to now',
    description: 'Building the NordVPN Android app used by millions of people.',
  },
  {
    title: 'Senior Android Developer',
    company: 'Clue',
    period: '2021 to 2022',
    description: 'Period tracking for millions, with a clean and modern Android experience.',
  },
];

const links = [
  { label: 'GitHub', href: 'https://github.com/hi-manshu' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/himanshoe/' },
  { label: 'X', href: 'https://x.com/hi_man_shoe' },
  { label: 'Instagram', href: 'https://www.instagram.com/hi_man_shoe/' },
  { label: 'Sessionize', href: 'https://sessionize.com/himanshoe' },
];

/* ── Small illustrations for the numbers ─────────────────────────────── */

type ArtKind = 'pips' | 'pins' | 'stack' | 'ticks';

const PIN_SPOTS: Array<[number, number]> = [
  [6, 55], [16, 30], [27, 62], [36, 22], [47, 48], [55, 70], [63, 28], [72, 56], [81, 20], [90, 50], [96, 72],
];

function StatArt({ kind, count, delay }: { kind: ArtKind; count: number; delay: number }) {
  if (kind === 'pips') {
    return (
      <div className="statart statart-pips" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="pip" style={{ '--d': `${delay + i * 32}ms` } as React.CSSProperties} />
        ))}
      </div>
    );
  }
  if (kind === 'pins') {
    return (
      <div className="statart statart-pins" aria-hidden>
        <span className="pins-ground" style={{ '--d': `${delay}ms` } as React.CSSProperties} />
        {PIN_SPOTS.slice(0, count).map(([x, y], i) => (
          <span key={i} className="pin" style={{ left: `${x}%`, top: `${y}%`, '--d': `${delay + 150 + i * 90}ms` } as React.CSSProperties}>
            <span className="pin__ring" />
          </span>
        ))}
      </div>
    );
  }
  if (kind === 'stack') {
    return (
      <div className="statart statart-stack" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="box" style={{ '--i': i, '--d': `${delay + i * 160}ms` } as React.CSSProperties} />
        ))}
      </div>
    );
  }
  return (
    <div className="statart statart-ticks" aria-hidden>
      <span className="ticks-line" style={{ '--d': `${delay}ms` } as React.CSSProperties} />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`tick ${i === count - 1 ? 'is-last' : ''}`}
          style={{ left: `${(i / (count - 1)) * 100}%`, '--d': `${delay + 200 + i * 90}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function About() {
  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const { events } = useTalks();
  const nextTalk = nextEvent(events);
  const since = events[events.length - 1].date.slice(0, 4);

  const stats: Array<{ value: number; label: string; art: ArtKind }> = [
    { value: inPersonCount(events), label: 'conference talks', art: 'pips' },
    { value: countryCount(events), label: 'countries spoken in', art: 'pins' },
    { value: 3, label: 'open source libraries', art: 'stack' },
    { value: new Date().getFullYear() - Number(since), label: 'years on stage', art: 'ticks' },
  ];

  return (
    <div className="relative container py-10 md:py-14 max-w-5xl">
      <div className="page-glow" aria-hidden />

      {/* Hero: words + portrait */}
      <header className="grid gap-10 lg:grid-cols-[1fr_17rem] lg:items-center mb-16">
        <div>
          <h1 className="display text-5xl md:text-7xl">
            <Headline words={['Android', 'developer,']} />
            <br />
            <Headline words={['speaker,', 'maintainer.']} start={620} />
          </h1>
          <p className="rise mt-7 text-lg sm:text-xl text-dim max-w-2xl leading-snug" style={{ '--d': '1100ms' } as React.CSSProperties}>
            I am Himanshu Singh, a Google Developer Expert for Android living in Berlin. I build Android apps
            for a living, maintain Krate, Charty, and Kalendar in the open, and have spoken at {inPersonCount(events)}{' '}
            conferences since {since}.
          </p>
          <div className="rise mt-7 flex flex-wrap gap-2" style={{ '--d': '1250ms' } as React.CSSProperties}>
            {links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-line text-xs py-2">
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="pop relative mx-auto lg:mx-0 w-56 h-56 lg:w-64 lg:h-64" style={{ '--d': '700ms' } as React.CSSProperties}>
          <div className="portrait">
            <img src="/images/speaking-portrait.jpg" alt="Himanshu Singh speaking on stage" className="portrait__img" loading="eager" />
            <span className="portrait__tint" aria-hidden />
          </div>
          <span className="sticker sticker-white float-a absolute -left-6 bottom-6 text-xs" style={{ '--rot': '-6deg' } as React.CSSProperties}>
            <MapPin className="h-3.5 w-3.5 text-ember" />
            Berlin
          </span>
          <span className="sticker sticker-gold float-b absolute -right-4 top-4 text-xs" style={{ '--rot': '5deg' } as React.CSSProperties}>
            Android GDE
          </span>
        </div>
      </header>

      {/* Numbers that count up */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
        {stats.map((s, i) => (
          <TiltCard key={s.label} delay={1200 + i * 90} className="p-5">
            <p className="display text-4xl md:text-5xl text-ink">
              <CountUp to={s.value} delay={1400 + i * 90} />
            </p>
            <StatArt kind={s.art} count={s.value} delay={1400 + i * 90} />
            <p className="mt-2 text-sm text-dim">{s.label}</p>
          </TiltCard>
        ))}
      </section>

      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        {/* Experience on a rail */}
        <section>
          <Reveal><h2 className="text-2xl font-bold tracking-tight mb-6">Experience</h2></Reveal>
          <ol className="relative border-l border-line ml-1">
            {experience.map((job, i) => (
              <Reveal
                as="li"
                key={job.company}
                className="relative pl-7 pb-8 last:pb-0"
                delay={i * 120}
              >
                <span aria-hidden className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-paper border-2 border-ink -translate-x-1/2" />
                <span className="font-mono text-xs text-dim">{job.period}</span>
                <h3 className="font-bold tracking-tight text-lg leading-snug mt-1">{job.title}</h3>
                <p className="text-sm text-ink/80 mt-0.5">{job.company}</p>
                <p className="text-sm text-dim mt-2 leading-relaxed">{job.description}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal><h2 className="text-2xl font-bold tracking-tight mt-12 mb-4">Open source</h2></Reveal>
          <Reveal delay={80}><p className="text-sm text-dim leading-relaxed">
            My libraries aim to remove boilerplate from Android and Kotlin Multiplatform apps and to come
            with documentation that is actually read. Krate is the newest. Charty and Kalendar have been in
            production apps for years.
          </p></Reveal>
          <Reveal delay={160}><Link to="/projects" className="link-ink text-sm mt-4 inline-block">
            See the projects
          </Link></Reveal>
        </section>

        {/* Skills pop in, then what's happening now */}
        <section>
          <Reveal><h2 className="text-2xl font-bold tracking-tight mb-6">What I work with</h2></Reveal>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Reveal as="span" key={skill} delay={i * 45} className="inline-flex">
                <span className="chip py-1 text-sm text-ink hover:border-ink">{skill}</span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-10 tile p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-ember animate-ping opacity-60" />
                <span className="relative rounded-full h-2 w-2 bg-ember" />
              </span>
              Right now
            </p>
            <ul className="mt-3 space-y-2 text-sm text-dim">
              <li>
                Shipping <Link to="/docs/krate" className="link-ink">Krate 0.1</Link>, a reactive database for KMP.
              </li>
              {nextTalk && (
                <li>
                  Next on stage at{' '}
                  {nextTalk.url ? (
                    <a href={nextTalk.url} target="_blank" rel="noopener noreferrer" className="link-ink">
                      {nextTalk.name}
                    </a>
                  ) : (
                    <span className="text-ink">{nextTalk.name}</span>
                  )}
                  , {formatEventDate(nextTalk.date)}.
                </li>
              )}
              <li>Working on the NordVPN Android app in Berlin.</li>
            </ul>
          </Reveal>
        </section>
      </div>

      <div className="mt-20 pt-12 border-t border-line">
        <ContactSection delay={200} />
      </div>

      <div className="mt-16 pt-8 border-t border-line">
        <button onClick={() => setShowLinkedIn((v) => !v)} className="text-xs text-dim hover:text-ink transition-colors">
          {showLinkedIn ? 'Hide LinkedIn import' : 'Import from LinkedIn'}
        </button>
        {showLinkedIn && (
          <div className="mt-6">
            <LinkedInImport />
          </div>
        )}
      </div>
    </div>
  );
}
