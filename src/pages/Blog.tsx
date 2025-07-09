
import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { SeriesStepper } from '@/components/SeriesStepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, FileText, Filter, Calendar, Clock } from 'lucide-react';
import { getBlogSeries, getIndividualBlogPosts, getAllBlogPosts, BlogPost, BlogSeries } from '@/utils/markdownUtils';

export default function Blog() {
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [individualPosts, setIndividualPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const [seriesData, postsData, allPostsData] = await Promise.all([
        getBlogSeries(),
        getIndividualBlogPosts(),
        getAllBlogPosts()
      ]);
      setSeries(seriesData);
      setIndividualPosts(postsData);
      setAllPosts(allPostsData);
      setIsLoading(false);
    };
    
    loadContent();
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags))).sort();

  // Filter posts based on search and tag
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const filteredIndividualPosts = individualPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Thoughts on Android development, open source, and technology. 
          Discover insights, tutorials, and best practices from my journey.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{allPosts.length}</div>
            <div className="text-sm text-muted-foreground">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{series.length}</div>
            <div className="text-sm text-muted-foreground">Series</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{allTags.length}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
        </div>
      </div>

      {!hasContent ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4">No blog posts yet</h3>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Add markdown files to src/content/blogs/ to see them here. 
            Stay tuned for upcoming content!
          </p>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Tag Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                <Filter className="h-3 w-3 mr-1" />
                All Topics
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all" className="text-sm">
                <FileText className="h-4 w-4 mr-2" />
                All ({filteredPosts.length})
              </TabsTrigger>
              <TabsTrigger value="series" className="text-sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Series ({series.length})
              </TabsTrigger>
              <TabsTrigger value="individual" className="text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Articles ({filteredIndividualPosts.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-12">
              {series.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">Blog Series</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {series.map((serie) => (
                      <div key={serie.name} className="flex flex-col">
                        <SeriesStepper {...serie} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {filteredPosts.filter(post => !post.series).length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">Latest Articles</h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts
                      .filter(post => !post.series)
                      .map((post) => (
                        <div key={post.slug} className="flex flex-col">
                          <BlogCard {...post} />
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </TabsContent>
            
            <TabsContent value="series">
              {series.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {series.map((serie) => (
                    <div key={serie.name} className="flex flex-col">
                      <SeriesStepper {...serie} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">No blog series yet</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Add series information to your markdown frontmatter to organize posts into series.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="individual">
              {filteredIndividualPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIndividualPosts.map((post) => (
                    <div key={post.slug} className="flex flex-col">
                      <BlogCard {...post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">
                    {searchTerm || selectedTag ? 'No matching articles' : 'No individual posts yet'}
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    {searchTerm || selectedTag 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Individual blog posts will appear here.'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
