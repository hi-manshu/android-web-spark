import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Headline } from '@/components/motion';

export default function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="container flex-1 flex flex-col items-center justify-center text-center py-24">
      <div className="relative">
        <h1 className="display text-7xl md:text-8xl">
          <Headline words={['404']} />
        </h1>
        <span className="sticker sticker-gold float-a absolute -right-24 -top-6 hidden sm:inline-flex" style={{ '--rot': '6deg' } as React.CSSProperties}>
          Nothing here
        </span>
      </div>
      <p className="rise mt-6 text-dim max-w-sm" style={{ '--d': '300ms' } as React.CSSProperties}>
        Nothing lives at <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">{pathname}</code>.
      </p>
      <Link to="/" className="btn-ink mt-8 pop" style={{ '--d': '450ms' } as React.CSSProperties}>
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
    </div>
  );
}
