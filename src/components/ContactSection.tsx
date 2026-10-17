import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Coffee, Copy, Github, Linkedin, Mic } from 'lucide-react';
import { Headline, TiltCard } from '@/components/motion';

export const CONTACT_EMAIL = 'hello2himanshusingh@gmail.com';

const reasons = [
  {
    title: 'Invite me to speak',
    text: 'Conferences, meetups, podcasts. Bios, photos and topics are in the speaker kit.',
    href: '/speaker-kit',
    cta: 'Speaker kit',
    Icon: Mic,
  },
  {
    title: 'Work together',
    text: 'Consulting, workshops, or a conversation about your Android team.',
    href: 'https://www.linkedin.com/in/himanshoe/',
    cta: 'LinkedIn',
    Icon: Linkedin,
  },
  {
    title: 'Ask about a library',
    text: 'Bugs, ideas, and questions about Krate, Charty, or Kalendar belong on GitHub.',
    href: 'https://github.com/hi-manshu',
    cta: 'GitHub',
    Icon: Github,
  },
  {
    title: 'Buy me a coffee',
    text: 'If a library or a talk saved you time, a coffee keeps the open source going.',
    href: 'https://buymeacoffee.com/himanshoe',
    cta: 'Buy Me a Coffee',
    Icon: Coffee,
  },
];

function BerlinClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 text-sm text-dim">
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-gold" />
      </span>
      {time ? `It is ${time} in Berlin` : 'Berlin, Germany'}
    </span>
  );
}

function EmailButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${CONTACT_EMAIL}`} className="btn-ink text-base px-6 py-3">
        {CONTACT_EMAIL}
        <ArrowUpRight className="h-4 w-4" />
      </a>
      <button onClick={copy} className={`btn-line px-4 py-3 ${copied ? 'border-gold bg-gold text-ink' : ''}`} aria-live="polite">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

/**
 * Contact block: email first, then the three reasons people usually write.
 * `standalone` renders the big headline for the /contact page.
 */
export function ContactSection({ standalone = false, delay = 0 }: { standalone?: boolean; delay?: number }) {
  return (
    <section className="relative">
      {standalone ? (
        <h1 className="display text-5xl md:text-7xl">
          <Headline words={['Say', 'hello.']} start={delay + 60} />
        </h1>
      ) : (
        <h2 className="rise text-2xl font-bold tracking-tight" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
          Say hello
        </h2>
      )}

      <p className="rise mt-5 text-lg sm:text-xl text-dim max-w-xl leading-snug" style={{ '--d': `${delay + 200}ms` } as React.CSSProperties}>
        Email is the fastest way to reach me. I read everything, and I answer within a few days.
      </p>

      <div className="rise mt-7" style={{ '--d': `${delay + 320}ms` } as React.CSSProperties}>
        <EmailButton />
      </div>

      <div className="rise mt-4" style={{ '--d': `${delay + 400}ms` } as React.CSSProperties}>
        <BerlinClock />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <TiltCard key={r.title} {...(r.href.startsWith('/') ? { to: r.href } : { href: r.href })} delay={delay + 500 + i * 100} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ember-soft text-ember">
                <r.Icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-dim transition-all duration-200 group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <h3 className="mt-4 text-lg font-bold tracking-tight">{r.title}</h3>
            <p className="mt-1.5 text-sm text-dim leading-relaxed flex-1">{r.text}</p>
            <p className="mt-4 text-xs font-medium text-ink">{r.cta}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
