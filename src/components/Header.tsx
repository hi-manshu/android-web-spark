import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Github, Menu, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSearch } = useSearch();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/[0.07] transition-all duration-300">
        <div className="container flex h-14 max-w-screen-2xl items-center">

          {/* Desktop nav */}
          <div className="mr-4 hidden md:flex items-center">
            <Link to="/" className="mr-5 flex items-center">
              <img
                src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png"
                alt="Logo"
                className="h-9 w-auto"
              />
            </Link>

            <nav className="flex items-center gap-0.5 text-sm font-medium">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white">
                  <Menu className="h-4.5 w-4.5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] glass-sidebar border-r border-white/[0.08]">
                <div className="flex flex-col mt-2">
                  <Link to="/" className="mb-6 flex items-center" onClick={closeMenu}>
                    <img
                      src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png"
                      alt="Logo"
                      className="h-8 w-auto"
                    />
                  </Link>
                  <nav className="flex flex-col gap-1">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={closeMenu}
                          className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                            isActive
                              ? 'sidebar-active font-semibold'
                              : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right side */}
          <div className="flex flex-1 items-center justify-between md:justify-end gap-1.5">
            {/* Mobile logo */}
            <div className="flex md:hidden">
              <Link to="/">
                <img
                  src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png"
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-1">
              {/* Search button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={openSearch}
                className="h-8 px-2 md:px-3 rounded-lg glass border-white/[0.08] text-white/50 hover:text-white hover:border-white/15 transition-all duration-150"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden md:inline ml-2 text-sm">Search</span>
                <kbd className="hidden md:inline ml-2.5 text-[10px] font-mono bg-white/[0.06] px-1.5 py-0.5 rounded-md">
                  ⌘K
                </kbd>
              </Button>

              {/* GitHub */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
