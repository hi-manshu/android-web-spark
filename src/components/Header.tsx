import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Github, Menu, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { BrandMark } from '@/components/BrandMark';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Docs', href: '/docs' },
  { name: 'Projects', href: '/projects' },
  { name: 'Talks', href: '/talks' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

/**
 * Floating pill navigation. A paper indicator slides between items with a
 * spring: it follows the pointer while hovering and settles back on the
 * active route. The pill drops in on load and compacts once the page scrolls.
 */
export function Header() {
  const { pathname } = useLocation();
  const { openSearch } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>({ left: 0, width: 0, visible: false });
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openSearch]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeHref = navigation.find((n) => isActive(pathname, n.href))?.href ?? null;
  const target = hovered ?? activeHref;

  useLayoutEffect(() => {
    const list = listRef.current;
    const el = target ? itemRefs.current[target] : null;
    if (!list || !el) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    const lr = list.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ left: r.left - lr.left, width: r.width, visible: true });
  }, [target, pathname]);

  useEffect(() => {
    const onResize = () => setHovered((h) => (h === null ? null : h));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-3">
      <div className={`navfrost navpill-enter pointer-events-auto ${compact ? 'is-compact' : ''}`}>
        {/* Brand: hi, man, shoe */}
        <Link to="/" className="navbrand" aria-label="Home">
          <BrandMark />
        </Link>

        {/* Dark pill with the links and the sliding indicator */}
        <div ref={listRef} className="navcore hidden md:flex items-center" onPointerLeave={() => setHovered(null)}>
          <span
            className="nav-ind"
            style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
            aria-hidden
          />
          {navigation.map((item) => {
            const on = target === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                ref={(el) => {
                  itemRefs.current[item.href] = el;
                }}
                onPointerEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
                className={`nav-item ${on ? 'is-on' : ''}`}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={openSearch} className="navpill__icon" aria-label="Search">
            <Search className="h-4 w-4" />
            <kbd className="hidden lg:inline font-mono text-[10px] opacity-70 ml-1">⌘K</kbd>
          </button>
          <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer" className="navpill__icon hidden sm:inline-flex" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </a>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="navpill__icon md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-paper border-l border-line">
              <nav className="mt-8 flex flex-col gap-1">
                {navigation.map((item, i) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rise px-3 py-2.5 rounded-xl text-2xl font-bold tracking-tight transition-colors ${
                      isActive(pathname, item.href) ? 'bg-ink text-paper' : 'text-ink hover:bg-surface'
                    }`}
                    style={{ '--d': `${i * 60}ms` } as React.CSSProperties}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/blog"
                  onClick={() => setMenuOpen(false)}
                  className="rise px-3 py-2.5 rounded-xl text-2xl font-bold tracking-tight text-ink hover:bg-surface"
                  style={{ '--d': '300ms' } as React.CSSProperties}
                >
                  Writing
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
