
import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-auto">
      <div className="container flex flex-col items-center justify-between gap-3 py-8 md:h-16 md:flex-row md:py-0">
        <p className="text-xs text-white/30">
          Built by{' '}
          <a
            href="https://github.com/hi-manshu"
            target="_blank"
            rel="noreferrer"
            className="text-white/45 hover:text-white transition-colors font-medium"
          >
            Himanshu Singh
          </a>
          {' '}with{' '}
          <Heart className="inline h-3 w-3 text-white/30 mx-0.5" />
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/hi-manshu"
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
            aria-label="GitHub"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
