
import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { BookOpen, FileText, Github, Mail, Mic, User, Home as HomeIcon, FolderGit2, type LucideIcon } from 'lucide-react';

export function SearchCommand() {
  const { isOpen, closeSearch, searchResults, searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSelect = (url: string, isExternal: boolean) => {
    closeSearch();
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };

  const projectResults = searchResults.filter(result => result.type === 'project');
  const blogResults = searchResults.filter(result => result.type === 'blog');

  const pages: { label: string; to: string; Icon: LucideIcon; hint: string }[] = [
    { label: 'Home', to: '/', Icon: HomeIcon, hint: 'Start' },
    { label: 'Talks', to: '/talks', Icon: Mic, hint: 'Map, timeline, sessions' },
    { label: 'Projects', to: '/projects', Icon: FolderGit2, hint: 'Open source on GitHub' },
    { label: 'Docs', to: '/docs', Icon: BookOpen, hint: 'Krate, Charty, Kalendar' },
    { label: 'About', to: '/about', Icon: User, hint: 'Bio, experience' },
    { label: 'Speaker kit', to: '/speaker-kit', Icon: Mic, hint: 'Bios, photos, topics' },
    { label: 'Contact', to: '/contact', Icon: Mail, hint: 'Email, socials' },
  ];
  const pageResults = pages.filter((p) => !searchQuery.trim() || p.label.toLowerCase().includes(searchQuery.toLowerCase()) || p.hint.toLowerCase().includes(searchQuery.toLowerCase()));
  const itemClass = 'flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer data-[selected=true]:bg-secondary data-[selected=true]:text-ink aria-selected:bg-secondary';

  return (
    <CommandDialog open={isOpen} onOpenChange={closeSearch}>
      <CommandInput
        placeholder="Search pages, projects, and articles"
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="text-base"
      />
      <CommandList className="max-h-[60vh] p-1.5">
        <CommandEmpty className="py-10 text-center text-sm text-dim">Nothing matches that. Try a project or a page name.</CommandEmpty>

        {pageResults.length > 0 && (
          <CommandGroup heading="Pages">
            {pageResults.map((p) => (
              <CommandItem key={p.to} value={`page ${p.label} ${p.hint}`} onSelect={() => handleSelect(p.to, false)} className={itemClass}>
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-paper border border-line text-dim">
                  <p.Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold tracking-tight">{p.label}</div>
                  <div className="text-xs text-dim">{p.hint}</div>
                </div>
                <kbd className="self-center font-mono text-[10px] text-dim border border-line rounded px-1 py-px">↵</kbd>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {projectResults.length > 0 && (
          <CommandGroup heading="Projects">
            {projectResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => handleSelect(result.url, true)}
                className={itemClass}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-paper border border-line text-dim">
                  <Github className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold tracking-tight">{result.title}</div>
                  <div className="text-xs text-dim line-clamp-2">
                    {result.description}
                  </div>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="chip text-[10px] py-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {blogResults.length > 0 && (
          <CommandGroup heading="Blog Posts">
            {blogResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => handleSelect(result.url, false)}
                className={itemClass}
              >
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-paper border border-line text-dim">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold tracking-tight">{result.title}</div>
                  <div className="text-xs text-dim line-clamp-2">
                    {result.description}
                  </div>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="chip text-[10px] py-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
