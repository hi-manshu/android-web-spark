
import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { HashnodeImport } from '@/components/HashnodeImport';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import type { BlogPost } from '@/utils/markdownUtils';

const STORAGE_KEY = 'imported-hashnode-posts';

export default function Blog() {
  const [importedPosts, setImportedPosts] = useState<BlogPost[]>([]);
  const [showImport, setShowImport] = useState(false);
  
  const localBlogPosts = getAllBlogPosts();

  // Load imported posts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const posts = JSON.parse(stored);
        setImportedPosts(posts);
      } catch (error) {
        console.error('Error loading stored posts:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const allPosts = [...localBlogPosts, ...importedPosts];

  const handleImport = (posts: BlogPost[]) => {
    const newPosts = [...importedPosts, ...posts];
    setImportedPosts(newPosts);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
    setShowImport(false);
  };

  const clearImportedPosts = () => {
    setImportedPosts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(!showImport)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Import from Hashnode
            </Button>
            {importedPosts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearImportedPosts}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Imported
              </Button>
            )}
          </div>
        </div>
        <p className="text-xl text-muted-foreground">
          Thoughts on Android development, open source, and technology
        </p>
        {importedPosts.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {importedPosts.length} posts imported from Hashnode
          </p>
        )}
      </div>

      {showImport && (
        <div className="mb-8 flex justify-center">
          <HashnodeImport onImport={handleImport} />
        </div>
      )}

      {allPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Import your posts from Hashnode to get started
          </p>
          <Button onClick={() => setShowImport(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Import from Hashnode
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
