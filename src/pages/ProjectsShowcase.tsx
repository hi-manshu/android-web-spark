import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Github } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Showcase data — one slide per signature project
───────────────────────────────────────────────────────────────────────────── */

interface Slide {
  name: string;
  title: string;
  tags: string[];
  description: string;
  docsPath?: string;
  githubUrl: string;
  screen: 'charts' | 'calendar' | 'code';
}

const slides: Slide[] = [
  {
    name: 'krate',
    title: 'Krate',
    tags: ['KMP', 'Room', 'KSP'],
    description:
      'Type-safe reactive database for Kotlin Multiplatform. Define data classes — Krate generates the rest.',
    docsPath: '/docs/krate',
    githubUrl: 'https://github.com/hi-manshu/Krate',
    screen: 'code',
  },
  {
    name: 'charty',
    title: 'Charty',
    tags: ['Compose', 'KMP', 'Charts'],
    description:
      '25+ animated, interactive chart types for Jetpack Compose and Compose Multiplatform.',
    docsPath: '/docs/charty',
    githubUrl: 'https://github.com/hi-manshu/Charty',
    screen: 'charts',
  },
  {
    name: 'kalendar',
    title: 'Kalendar',
    tags: ['Compose', 'Calendar', 'UI'],
    description:
      'A modern, customizable calendar component with event management for Jetpack Compose.',
    docsPath: '/docs/kalendar',
    githubUrl: 'https://github.com/hi-manshu/Kalendar',
    screen: 'calendar',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Laptop screen previews — pure CSS/SVG, one per project
───────────────────────────────────────────────────────────────────────────── */

function ChartsScreen() {
  const bars = [42, 68, 34, 80, 56, 90, 48, 72];
  return (
    <div className="w-full h-full flex items-end justify-center gap-[4%] px-[8%] pb-[10%]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[3px] bg-gradient-to-t from-white/20 to-white/70 origin-bottom animate-bar-grow"
          style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

function CalendarScreen() {
  const today = 17;
  return (
    <div className="w-full h-full grid grid-cols-7 gap-[3%] p-[8%] content-center">
      {Array.from({ length: 28 }, (_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[3px] flex items-center justify-center text-[6px] font-mono animate-cell-pop ${
            i + 1 === today
              ? 'bg-white text-black font-bold'
              : i % 9 === 4
              ? 'bg-white/20 text-white/70'
              : 'bg-white/[0.06] text-white/30'
          }`}
          style={{ animationDelay: `${i * 20}ms` }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

function CodeScreen() {
  const lines = [
    { w: '52%', accent: true },
    { w: '78%', accent: false },
    { w: '64%', accent: false },
    { w: '40%', accent: false },
    { w: '12%', accent: true },
    { w: '70%', accent: false },
    { w: '46%', accent: true },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-[5%] px-[10%]">
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-[4%] animate-line-in" style={{ animationDelay: `${i * 110}ms` }}>
          <span className="text-[6px] font-mono text-white/20">{i + 1}</span>
          <div
            className={`h-[6%] min-h-[3px] rounded-full ${l.accent ? 'bg-white/60' : 'bg-white/[0.14]'}`}
            style={{ width: l.w }}
          />
        </div>
      ))}
    </div>
  );
}

const SCREENS: Record<Slide['screen'], () => JSX.Element> = {
  charts: ChartsScreen,
  calendar: CalendarScreen,
  code: CodeScreen,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Laptop mockup
───────────────────────────────────────────────────────────────────────────── */

function Laptop({ slide }: { slide: Slide }) {
  const Screen = SCREENS[slide.screen];
  return (
    <div className="[perspective:1400px] animate-float-slow">
      <div className="mx-auto w-[300px] sm:w-[420px] md:w-[500px]" style={{ transform: 'rotateX(10deg)' }}>
        {/* Lid / screen */}
        <div className="relative rounded-2xl border border-white/[0.12] bg-[#0b0b0b] p-[2.5%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="rounded-xl overflow-hidden bg-[#050505] aspect-[16/10] relative">
            {/* subtle screen glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            <Screen key={slide.name} />
          </div>
          {/* camera dot */}
          <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/20" />
        </div>
        {/* Base */}
        <div className="mx-auto w-[104%] -ml-[2%] h-[10px] sm:h-[13px] rounded-b-2xl rounded-t-[3px] bg-gradient-to-b from-white/[0.16] to-white/[0.05] border border-t-0 border-white/[0.08]" />
        {/* notch */}
        <div className="mx-auto w-[14%] h-[4px] rounded-b-lg bg-black/60 -mt-[1px]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Showcase page — immersive one-project-at-a-time carousel
───────────────────────────────────────────────────────────────────────────── */

const AUTO_ADVANCE_MS = 7000;

export default function ProjectsShowcase() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const slide = slides[active];

  const go = useCallback((idx: number) => {
    setActive((idx + slides.length) % slides.length);
  }, []);

  // Auto-advance, reset whenever the slide changes manually
  useEffect(() => {
    timer.current = setInterval(() => setActive((a) => (a + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(active + 1);
      if (e.key === 'ArrowLeft') go(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, go]);

  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-black flex flex-col">
      {/* Component-scoped keyframes for the screen previews */}
      <style>{`
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .animate-bar-grow { transform: scaleY(0); animation: barGrow 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes cellPop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        .animate-cell-pop { opacity: 0; animation: cellPop 0.35s ease-out forwards; }
        @keyframes lineIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .animate-line-in { opacity: 0; animation: lineIn 0.5s ease-out forwards; }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 dot-grid opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full bg-white/[0.05] blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-14">
        {/* Laptop */}
        <div key={`laptop-${active}`} className="animate-fade-in-up mb-10">
          <Laptop slide={slide} />
        </div>

        {/* Slide info */}
        <div key={`info-${active}`} className="text-center animate-fade-in-up max-w-2xl">
          <p className="text-white/35 text-xs uppercase tracking-[0.25em] mb-4">Selected Projects</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-5">
            {slide.tags.join(' • ')}
          </p>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-md mx-auto mb-8">
            {slide.description}
          </p>

          <div className="flex items-center justify-center gap-3">
            {slide.docsPath && (
              <Link
                to={slide.docsPath}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </Link>
            )}
            <a
              href={slide.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-sm font-medium transition-all"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous project"
            className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.name}
                onClick={() => go(i)}
                aria-label={`Show ${s.title}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(active + 1)}
            aria-label="Next project"
            className="w-10 h-10 rounded-full glass border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Everything else lives on GitHub */}
        <a
          href="https://github.com/hi-manshu"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Explore all projects on GitHub →
        </a>
      </div>
    </div>
  );
}
