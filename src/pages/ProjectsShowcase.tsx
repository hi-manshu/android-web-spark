import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { LaptopPreview, type ScreenKind } from '@/components/LaptopPreview';

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
  screen: ScreenKind;
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
      {/* Background */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 dot-grid opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full bg-white/[0.05] blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-14">
        {/* Laptop */}
        <div key={`laptop-${active}`} className="animate-fade-in-up mb-10">
          <LaptopPreview screen={slide.screen} screenKey={slide.name} />
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
