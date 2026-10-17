import { useCallback, useEffect, useRef, useState } from 'react';
import { IntroReveal, INTRO_HERO_START_MS } from '@/components/IntroReveal';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Instagram, Linkedin } from 'lucide-react';
import { ConferenceMarquee } from '@/components/ConferenceMarquee';
import { HomeTiles } from '@/components/HomeTiles';
import { Chars } from '@/components/motion';
import { SESSIONIZE_PROFILE_URL, inPersonCount } from '@/data/talks';
import { useTalks } from '@/hooks/useTalks';

const CYCLE_MS = 3200;

const opener = ['Hi,', "I'm", 'Himanshu.', 'I', 'build'];

/** Endings for "I build …". Each one is a real thing he ships. */
const endings = [
  'reactive databases for Kotlin Multiplatform.',
  'charts for Compose Multiplatform.',
  'the NordVPN app for Android.',
  'calendars for Jetpack Compose.',
  'open source for Android developers.',
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/hi-manshu', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/himanshoe/', Icon: Linkedin },
  { label: 'X', href: 'https://x.com/hi_man_shoe' },
  { label: 'Instagram', href: 'https://instagram.com/hi_man_shoe', Icon: Instagram },
  { label: 'Sessionize', href: SESSIONIZE_PROFILE_URL },
];

interface Sticker {
  text: string;
  tone: 'gold' | 'ember' | 'ink' | 'white';
  /** Position inside the sticker column on desktop */
  pos: string;
  /** Parallax depth in px per unit of pointer offset */
  depth: number;
  rotate: number;
  float: 'a' | 'b' | 'c';
  href?: string;
}

function makeStickers(talkCount: number): Sticker[] {
  return [
  {
    text: 'Most Active Speaker, Sessionize 2023 and 2025',
    tone: 'gold',
    pos: 'right-0 top-[6%]',
    depth: 14,
    rotate: -5,
    float: 'a',
    href: SESSIONIZE_PROFILE_URL,
  },
  { text: 'Google Developer Expert, Android', tone: 'ember', pos: 'left-0 top-[30%]', depth: 24, rotate: 4, float: 'b' },
  { text: 'Berlin, Germany', tone: 'white', pos: 'right-[6%] top-[54%]', depth: 32, rotate: -8, float: 'c' },
  { text: `${talkCount} conference talks`, tone: 'ink', pos: 'left-[12%] top-[76%]', depth: 18, rotate: 3, float: 'a' },
  ];
}

function StickerPill({ s, delay, className = '' }: { s: Sticker; delay: number; className?: string }) {
  const style = { '--d': `${delay}ms`, '--depth': s.depth, '--rot': `${s.rotate}deg` } as React.CSSProperties;
  const inner = (
    <span className={`sticker sticker-${s.tone} float-${s.float}`}>
      {s.text}
      {s.href && <ArrowUpRight className="h-3.5 w-3.5" />}
    </span>
  );
  return (
    <div className={`parallax pop ${className}`} style={style}>
      {s.href ? (
        <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

/** Play the intro only on a fresh page load of "/", not on client-side navigation back home. */
function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return performance.now() < 2500;
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const { events } = useTalks();
  const stickers = makeStickers(inPersonCount(events));
  const heroRef = useRef<HTMLElement>(null);
  const [intro, setIntro] = useState(shouldPlayIntro);
  const introOffset = intro ? INTRO_HERO_START_MS : 0;
  const finishIntro = useCallback(() => setIntro(false), []);

  // While the sheet is up: no scrolling, and the nav and glow wait too
  useEffect(() => {
    if (!intro) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    root.classList.add('intro-playing');
    return () => {
      root.style.overflow = prev;
      root.classList.remove('intro-playing');
    };
  }, [intro]);

  // Cycle the headline ending
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % endings.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Pointer parallax: write a normalised offset to CSS variables on the hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
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

  // Character timing for the opener line
  let cursor = 80;
  const openerStarts = opener.map((w) => {
    const start = cursor;
    cursor += w.length * 26 + 50;
    return start;
  });
  const endingStart = cursor + 80;

  return (
    <div
      className="flex-1 flex flex-col min-h-[calc(100svh-5.25rem)] overflow-x-clip"
      style={{ '--intro': `${introOffset}ms` } as React.CSSProperties}
    >
      {intro && <IntroReveal onDone={finishIntro} />}
      <section ref={heroRef} className="relative container flex-1 flex flex-col justify-center pt-6 pb-8 lg:pt-8">
        <div aria-hidden className="glow parallax" style={{ '--depth': -10 } as React.CSSProperties} />

        <div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:items-center">
          <div className="min-w-0">
            <h1 className="display text-[clamp(2.75rem,6.6vw,6.25rem)] text-ink">
              <span className="block">
                {opener.map((word, i) => (
                  <span key={word} className="inline-block mr-[0.22em] last:mr-0">
                    <Chars text={word} start={openerStarts[i]} />
                  </span>
                ))}
              </span>
              <span className="clip block text-ember">
                <span className="rise block" style={{ '--d': `${endingStart}ms` } as React.CSSProperties}>
                  <span key={index} className="cycle-word">
                    {endings[index]}
                  </span>
                </span>
              </span>
            </h1>

            <p
              className="rise mt-7 max-w-xl text-lg sm:text-xl text-dim leading-snug"
              style={{ '--d': `${endingStart + 220}ms` } as React.CSSProperties}
            >
              Google Developer Expert for Android, based in Berlin. I work in Kotlin and Jetpack Compose,
              and I maintain open source libraries that run in production apps.
            </p>

            <nav
              className="rise mt-7 flex flex-wrap items-center gap-2"
              style={{ '--d': `${endingStart + 340}ms` } as React.CSSProperties}
              aria-label="Profiles"
            >
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink hover:border-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {label === 'X' ? <span className="font-bold leading-none" aria-label="X">𝕏</span> : label}
                </a>
              ))}
            </nav>

            {/* Stickers as a wrapped row on smaller screens */}
            <div className="lg:hidden mt-7 flex flex-wrap gap-3">
              {stickers.map((s, i) => (
                <StickerPill key={s.text} s={s} delay={endingStart + 400 + i * 110} />
              ))}
            </div>
          </div>

          {/* Sticker field: its own column, so nothing lands on the headline */}
          <div className="hidden lg:block relative h-[22rem] xl:h-[24rem]">
            {stickers.map((s, i) => (
              <StickerPill
                key={s.text}
                s={s}
                delay={endingStart + 400 + i * 110}
                className={`absolute ${s.pos}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 lg:mt-10">
          <HomeTiles baseDelay={endingStart + 520} />
        </div>
      </section>

      <div className="rise pb-6" style={{ '--d': `${endingStart + 1000}ms` } as React.CSSProperties}>
        <ConferenceMarquee />
      </div>
    </div>
  );
}
