import { ArrowUpRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

/** Turn a slides or video URL into something an iframe can show, or null if it must open externally. */
export function embedUrl(url: string): { src: string; kind: 'pdf' | 'slides' | 'video' } | null {
  try {
    if (/\.pdf($|[?#])/i.test(url)) return { src: `${url}#view=FitH&toolbar=0`, kind: 'pdf' };
    const u = new URL(url, window.location.origin);
    if (u.hostname.includes('docs.google.com') && u.pathname.includes('/presentation/')) {
      const id = u.pathname.match(/\/d\/([^/]+)/)?.[1];
      if (id) return { src: `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false`, kind: 'slides' };
    }
    if (u.hostname.includes('youtube.com') || u.hostname === 'youtu.be') {
      const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') ?? u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
      if (id) return { src: `https://www.youtube-nocookie.com/embed/${id}?rel=0`, kind: 'video' };
    }
    if (u.hostname.includes('speakerdeck.com') && u.pathname.startsWith('/player/')) return { src: url, kind: 'slides' };
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.match(/\/(\d+)/)?.[1];
      if (id) return { src: `https://player.vimeo.com/video/${id}`, kind: 'video' };
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export interface ViewerItem {
  title: string;
  subtitle?: string;
  url: string;
}

export function SlideViewer({ item, onClose }: { item: ViewerItem | null; onClose: () => void }) {
  const embed = item ? embedUrl(item.url) : null;
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[94vw] p-0 overflow-hidden rounded-2xl border-line bg-paper">
        {item && (
          <>
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-line">
              <div className="min-w-0">
                <DialogTitle className="text-base font-bold tracking-tight truncate">{item.title}</DialogTitle>
                {item.subtitle && <p className="text-xs text-dim truncate">{item.subtitle}</p>}
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-line text-xs py-1.5 whitespace-nowrap">
                Open
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            {embed ? (
              <div className={embed.kind === 'pdf' ? 'h-[78vh] bg-[#2b2b2b]' : 'aspect-video bg-ink'}>
                <iframe
                  src={embed.src}
                  title={item.title}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-10 text-center text-sm text-dim">This one lives elsewhere. Use Open to view it.</div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
