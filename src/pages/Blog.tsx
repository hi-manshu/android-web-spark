
import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { SeriesCard } from '@/components/SeriesCard';
import { HashnodeImport } from '@/components/HashnodeImport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Download, BookOpen, FileIcon } from 'lucide-react';
import { getBlogSeries, getIndividualBlogPosts, BlogPost, BlogSeries } from '@/utils/markdownUtils';

export default function Blog() {
  const [showImport, setShowImport] = useState(false);
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [individualPosts, setIndividualPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const [seriesData, postsData] = await Promise.all([
        getBlogSeries(),
        getIndividualBlogPosts()
      ]);
      setSeries(seriesData);
      setIndividualPosts(postsData);
      setIsLoading(false);
    };
    
    loadContent();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  const hasContent = series.length > 0 || individualPosts.length > 0;

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

      {!hasContent ? (
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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="series">
              <BookOpen className="h-4 w-4 mr-2" />
              Series ({series.length})
            </TabsTrigger>
            <TabsTrigger value="individual">
              <FileIcon className="h-4 w-4 mr-2" />
              Individual ({individualPosts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            {series.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Blog Series</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {series.map((serie) => (
                    <SeriesCard key={serie.name} {...serie} />
                  ))}
                </div>
              </div>
            )}
            
            {individualPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Individual Posts</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {individualPosts.map((post) => (
                    <BlogCard key={post.slug} {...post} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="series">
            {series.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {series.map((serie) => (
                  <SeriesCard key={serie.name} {...serie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No blog series yet</h3>
                <p className="text-muted-foreground">
                  Add series information to your markdown frontmatter to organize posts into series.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="individual">
            {individualPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {individualPosts.map((post) => (
                  <BlogCard key={post.slug} {...post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No individual posts yet</h3>
                <p className="text-muted-foreground">
                  Individual blog posts will appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
