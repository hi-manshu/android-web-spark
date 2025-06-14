
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="https://github.com/hi-manshu"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Himanshu Singh
            </a>
            . The source code is available on{' '}
            <a
              href="https://github.com/hi-manshu"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <a
            href="https://github.com/hi-manshu"
            target="_blank"
            rel="noreferrer"
          >
            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Github className="h-4 w-4 fill-current" />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}
