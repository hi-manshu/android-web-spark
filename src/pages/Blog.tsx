
import React, { useState } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { HashnodeImport } from '@/components/HashnodeImport';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import type { BlogPost } from '@/utils/markdownUtils';

export default function Blog() {
  const [importedPosts, setImportedPosts] = useState<BlogPost[]>([]);
  const [showImport, setShowImport] = useState(false);
  
  const localBlogPosts = getAllBlogPosts();
  const allPosts = [...localBlogPosts, ...importedPosts];

  const handleImport = (posts: BlogPost[]) => {
    setImportedPosts(prevPosts => [...prevPosts, ...posts]);
    setShowImport(false);
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
          </div>
        </div>
        <p className="text-xl text-muted-foreground">
          Thoughts on Android development, open source, and technology
        </p>
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
