
import { Button } from '@/components/ui/button';
import { Github, Heart, Instagram, X, ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black">
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-100" />

        {/* Fade edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />

        {/* Radial glow — white, subtle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.04] blur-3xl"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-[60rem]">

          {/* Badge pill */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full glass text-sm font-medium animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-white/60">Engineer with a motivation</span>
            <a
              href="/about"
              className="text-white font-semibold transition-colors hover:text-white/80"
            >
              Learn more →
            </a>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up text-white leading-[1.08]"
            style={{ animationDelay: '0.12s' }}
          >
            Hi, I'm{' '}
            <span className="text-gradient">Himanshu Singh</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.20s' }}
          >
            Google Developer Expert · Speaker · Android Developer · Open Source Enthusiast
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.28s' }}
          >
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-semibold rounded-xl px-6 h-11 border-0"
              asChild
            >
              <a href="/projects">View My Projects</a>
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
            className="flex items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.36s' }}
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

          {/* Scroll indicator */}
          <div className="mt-20 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <ArrowDown className="h-5 w-5 text-white/20 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
