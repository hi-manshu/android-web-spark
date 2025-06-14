
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
import { Badge } from '@/components/ui/badge';
import { FileText, Github } from 'lucide-react';

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

  return (
    <CommandDialog open={isOpen} onOpenChange={closeSearch}>
      <CommandInput
        placeholder="Search projects and blog posts..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {projectResults.length > 0 && (
          <CommandGroup heading="Projects">
            {projectResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => handleSelect(result.url, true)}
                className="flex items-start gap-2 p-3"
              >
                <Github className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </div>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
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
                className="flex items-start gap-2 p-3"
              >
                <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {result.description}
                  </div>
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
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
