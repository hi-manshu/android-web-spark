import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
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

  // Handle keyboard shortcut
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png" alt="Logo" className="h-12 p-2" />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  location.pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <div className="flex flex-col space-y-4 mt-4">
                <Link to="/" className="flex items-center space-x-2 pb-4">
                  <img src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png" alt="Logo" className="h-10 p-2" />
                </Link>
                <nav className="flex flex-col space-y-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={closeMenu}
                      className={`text-lg transition-colors hover:text-foreground/80 ${
                        location.pathname === item.href
                          ? 'text-foreground font-medium'
                          : 'text-foreground/60'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile title */}
          <div className="flex md:hidden">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/add6b1f6-ea67-4b5c-9955-49b02fb3cd9b.png" alt="Logo" className="h-9 p-2" />
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openSearch}
              className="h-8 w-8 md:w-auto md:justify-start md:px-3"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline-flex ml-2">Search</span>
              <span className="hidden md:inline-flex ml-auto text-xs text-muted-foreground">
                ⌘K
              </span>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/hi-manshu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
