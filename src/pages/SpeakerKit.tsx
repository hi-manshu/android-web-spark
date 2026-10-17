import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { PageTitle, Reveal, TiltCard } from '@/components/motion';
import { useTalks } from '@/hooks/useTalks';
import { countryCount, inPersonCount, SESSIONIZE_PROFILE_URL } from '@/data/talks';
import { CONTACT_EMAIL } from '@/components/ContactSection';

const SHORT_BIO =
  'Himanshu Singh is a Google Developer Expert for Android based in Berlin, working on the NordVPN Android app and maintaining the open source libraries Krate, Charty, and Kalendar.';

const LONG_BIO =
  'Himanshu Singh is a Google Developer Expert for Android living in Berlin, Germany, building Android apps for a living, currently the NordVPN app, and maintaining three open source libraries used in production: Krate, a reactive database for Kotlin Multiplatform; Charty, a charting library for Compose Multiplatform; and Kalendar, a calendar component for Jetpack Compose. Himanshu has spoken at droidcon and DevFest events across Europe, Africa, Asia, and North America on Android performance, Kotlin, Jetpack Compose, and Kotlin Multiplatform, and was named one of Sessionize’s most active speakers in 2023 and 2025.';

const TOPICS = [
  'Android performance and Baseline Profiles',
  'Jetpack Compose internals and testing',
  'Kotlin Multiplatform in production',
  'Kotlin coroutines and Flow',
  'Backend Kotlin with Ktor for Android developers',
  'Building and maintaining open source libraries',
];

const PHOTOS = [
  { src: '/images/speaking-portrait.jpg', label: 'Portrait, on stage', note: '1067 × 1600' },
  { src: '/images/speaking-wide.jpg', label: 'Wide, on stage', note: '1800 × 1170' },
];

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="tile p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="font-bold tracking-tight">{label}</p>
        <button onClick={copy} className={`btn-line text-xs py-1.5 ${copied ? 'border-gold bg-gold' : ''}`}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-dim leading-relaxed">{text}</p>
    </div>
  );
}

export default function SpeakerKit() {
  const { events, talks } = useTalks();
  const venues = Array.from(new Set(events.filter((e) => e.location !== 'Online').map((e) => e.name.replace(/\s\d{4}$/, '')))).slice(0, 12);

  return (
    <div className="relative container py-10 md:py-14 max-w-5xl">
      <div className="page-glow" aria-hidden />

      <PageTitle
        title="Speaker kit"
        aside={
          <Link to="/contact" className="btn-ink">
            Book me for your event
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      >
        Everything an organiser needs on one page: bios to paste, photos to download, topics, and where I have spoken before.
      </PageTitle>

      <section className="grid gap-4 md:grid-cols-2 mb-12">
        <Reveal><CopyBlock label="Short bio" text={SHORT_BIO} /></Reveal>
        <Reveal delay={80}><CopyBlock label="Long bio" text={LONG_BIO} /></Reveal>
      </section>

      <section className="mb-12">
        <Reveal><h2 className="text-2xl font-bold tracking-tight mb-5">Photos</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.src} delay={i * 90}>
              <a href={p.src} download className="tile group block overflow-hidden">
                <img src={p.src} alt={p.label} className="aspect-[4/3] w-full object-cover object-[60%_30%] transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-semibold tracking-tight">{p.label}</p>
                    <p className="text-xs text-dim font-mono mt-0.5">{p.note}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:text-ember transition-colors">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2 mb-12">
        <div>
          <Reveal><h2 className="text-2xl font-bold tracking-tight mb-5">Topics</h2></Reveal>
          <ul className="border-t border-line">
            {TOPICS.map((t, i) => (
              <Reveal as="li" key={t} delay={i * 50} className="py-3 border-b border-line text-sm flex items-start gap-3">
                <span className="font-mono text-xs text-ember pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </Reveal>
            ))}
          </ul>
          <Reveal delay={320}>
            <p className="mt-4 text-sm text-dim">
              {talks.length} ready sessions with abstracts are on{' '}
              <a href={SESSIONIZE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="link-ink">Sessionize</a>, or see{' '}
              <Link to="/talks" className="link-ink">what I talk about</Link>.
            </p>
          </Reveal>
        </div>

        <div>
          <Reveal><h2 className="text-2xl font-bold tracking-tight mb-5">Track record</h2></Reveal>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <TiltCard className="p-4" delay={100}>
              <p className="display text-3xl">{inPersonCount(events)}</p>
              <p className="text-xs text-dim mt-1">conferences in person</p>
            </TiltCard>
            <TiltCard className="p-4" delay={180}>
              <p className="display text-3xl">{countryCount(events)}</p>
              <p className="text-xs text-dim mt-1">countries</p>
            </TiltCard>
          </div>
          <Reveal delay={260}>
            <p className="text-xs text-dim mb-2">Including</p>
            <p className="flex flex-wrap gap-1.5">
              {venues.map((v) => (
                <span key={v} className="chip">{v}</span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <div className="tile p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="font-bold tracking-tight text-lg">Practical details</p>
            <p className="text-sm text-dim mt-1 max-w-xl">
              Based in Berlin, happy to travel. Talks, panels and workshops. Anything else you need for your programme, ask by email.
            </p>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Speaking%20invitation`} className="btn-ink whitespace-nowrap">
            {CONTACT_EMAIL}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
