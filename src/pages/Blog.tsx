
import React, { useState } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { HashnodeImport } from '@/components/HashnodeImport';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';

export default function Blog() {
  const [showImport, setShowImport] = useState(false);
  
  const allPosts = getAllBlogPosts();

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(!showImport)}
          >
            <Download className="h-4 w-4 mr-2" />
            Import from Hashnode
          </Button>
        </div>
        <p className="text-xl text-muted-foreground">
          Thoughts on Android development, open source, and technology
        </p>
      </div>

      {showImport && (
        <div className="mb-8 flex justify-center">
          <HashnodeImport />
        </div>
      )}

      {allPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Import your posts from Hashnode or add markdown files to src/content/blogs/
          </p>
          <Button onClick={() => setShowImport(true)}>
            <Download className="h-4 w-4 mr-2" />
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
