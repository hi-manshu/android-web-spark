import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Heart, Instagram, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LaptopPreview, type ScreenKind } from '@/components/LaptopPreview';

/* ─────────────────────────────────────────────────────────────────────────────
   Showcase hero — split layout: serif intro on the left, a floating laptop
   auto-cycling through the signature libraries on the right.
   Rendered on Home when the "showcase" feature switch is on.
───────────────────────────────────────────────────────────────────────────── */

const cycle: { name: string; title: string; screen: ScreenKind; docsPath: string }[] = [
  { name: 'krate', title: 'Krate', screen: 'code', docsPath: '/docs/krate' },
  { name: 'charty', title: 'Charty', screen: 'charts', docsPath: '/docs/charty' },
  { name: 'kalendar', title: 'Kalendar', screen: 'calendar', docsPath: '/docs/kalendar' },
];

const CYCLE_MS = 4500;

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const current = cycle[active];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % cycle.length), CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        <div className="absolute inset-0 dot-grid opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        <div
          className="absolute right-[10%] top-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-white/[0.04] blur-3xl"
          aria-hidden="true"
        />
      </div>

      <div className="container relative mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-8 items-center">

          {/* ── Left: intro ── */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            {/* Badge pill */}
            <div
              className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full glass text-sm font-medium animate-fade-in-up"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="text-white/60">Building open source for Android &amp; KMP</span>
            </div>

            <p
              className="text-white/35 text-xs uppercase tracking-[0.25em] mb-4 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Google Developer Expert · Speaker
            </p>

            <h1
              className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up text-white leading-[1.05]"
              style={{ animationDelay: '0.15s' }}
            >
              Himanshu
              <br />
              Singh
            </h1>

            <p
              className="text-lg text-white/55 leading-relaxed mb-10 animate-fade-in-up"
              style={{ animationDelay: '0.22s' }}
            >
              Android developer crafting open source libraries and tools
              for the Kotlin Multiplatform ecosystem.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 font-semibold rounded-xl px-6 h-11 border-0"
                asChild
              >
                <Link to="/projects">View My Projects</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-white/10 bg-white/[0.04] backdrop-blur-sm text-white/80 hover:bg-white/[0.08] hover:border-white/20 rounded-xl px-6 h-11"
                asChild
              >
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-white/10 bg-white/[0.04] backdrop-blur-sm text-white/80 hover:bg-white/[0.08] hover:border-white/20 rounded-xl px-6 h-11"
                asChild
              >
                <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor
                </a>
              </Button>
            </div>

            {/* Social links */}
            <div
              className="flex items-center justify-center lg:justify-start gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.38s' }}
            >
              <span className="text-sm text-white/20">Connect</span>
              <div className="h-px w-8 bg-white/10" />
              <a
                href="https://www.instagram.com/hi_man_shoe/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/hi_man_shoe"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
                aria-label="X / Twitter"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ── Right: floating laptop cycling through libraries ── */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <LaptopPreview
              screen={current.screen}
              screenKey={current.name}
              className="w-[300px] sm:w-[400px] xl:w-[460px]"
            />

            {/* Caption + dots */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                to={current.docsPath}
                key={current.name}
                className="group flex items-center gap-2 text-sm animate-fade-in-up"
              >
                <span className="text-white/35">Now showing</span>
                <span className="font-serif font-bold text-white text-base">{current.title}</span>
                <span className="flex items-center gap-1 text-white/40 group-hover:text-white transition-colors">
                  Docs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <div className="flex items-center gap-2">
                {cycle.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setActive(i)}
                    aria-label={`Show ${c.title}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
