
import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'blog';
  url: string;
  tags?: string[];
}

interface SearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  searchResults: SearchResult[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getAllBlogPosts,
    staleTime: 5 * 60 * 1000,
  });

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search projects
    projects?.forEach((project) => {
      const matchesTitle = project.title.toLowerCase().includes(query);
      const matchesDescription = project.description.toLowerCase().includes(query);
      const matchesTags = project.tags.some(tag => tag.toLowerCase().includes(query));

      if (matchesTitle || matchesDescription || matchesTags) {
        results.push({
          id: `project-${project.title}`,
          title: project.title,
          description: project.description,
          type: 'project',
          url: project.githubUrl,
          tags: project.tags,
        });
      }
    });

    // Search blog posts
    blogPosts.forEach((post) => {
      const matchesTitle = post.title.toLowerCase().includes(query);
      const matchesDescription = post.description.toLowerCase().includes(query);
      const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(query));

      if (matchesTitle || matchesDescription || matchesTags) {
        results.push({
          id: `blog-${post.slug}`,
          title: post.title,
          description: post.description,
          type: 'blog',
          url: `/blog/${post.slug}`,
          tags: post.tags,
        });
      }
    });

    return results;
  }, [searchQuery, projects, blogPosts]);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openSearch,
        closeSearch,
        searchResults,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
