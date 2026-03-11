
import React, { useState, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { SeriesStepper } from '@/components/SeriesStepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, FileText, Filter } from 'lucide-react';
import { getBlogSeries, getIndividualBlogPosts, getAllBlogPosts, BlogPost, BlogSeries } from '@/utils/markdownUtils';
import { FadeInView } from '@/components/FadeInView';

export default function Blog() {
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [individualPosts, setIndividualPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [s, p, a] = await Promise.all([
        getBlogSeries(),
        getIndividualBlogPosts(),
        getAllBlogPosts(),
      ]);
      setSeries(s);
      setIndividualPosts(p);
      setAllPosts(a);
      setIsLoading(false);
    })();
  }, []);

  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  const filterPost = (post: BlogPost) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    const matchTag = !selectedTag || post.tags.includes(selectedTag);
    return matchSearch && matchTag;
  };

  const filteredPosts = allPosts.filter(filterPost);
  const filteredIndividual = individualPosts.filter(filterPost);

  const hasContent = series.length > 0 || individualPosts.length > 0;

  if (isLoading) {
    return (
      <div className="container py-14">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-24 bg-foreground/10 rounded-full" />
          <div className="h-8 w-32 bg-foreground/10 rounded-xl" />
          <div className="h-4 w-64 bg-foreground/8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 left-0 w-[380px] h-[380px] orb-amber opacity-15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] orb-teal opacity-12 blur-3xl" />
      </div>

      <div className="container py-14 relative">

        {/* Page header */}
        <FadeInView>
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Writing
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
            <p className="text-foreground/50 text-sm max-w-lg">
              Thoughts on Android development, open source, and technology.
            </p>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                { label: `${allPosts.length} Posts`, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
                { label: `${series.length} Series`, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
                { label: `${allTags.length} Topics`, color: 'bg-teal-500/10 text-teal-700 dark:text-teal-400' },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${s.color}`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </FadeInView>

        {!hasContent ? (
          <FadeInView>
            <div className="glass-card rounded-2xl p-14 text-center max-w-md mx-auto">
              <FileText className="h-10 w-10 text-foreground/25 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No blog posts yet</h3>
              <p className="text-sm text-foreground/45">
                Add markdown files to <code className="text-xs bg-foreground/[0.06] px-1.5 py-0.5 rounded">src/content/blogs/</code> to get started.
              </p>
            </div>
          </FadeInView>
        ) : (
          <>
            {/* Search + Tags */}
            <FadeInView delay={80}>
              <div className="mb-8 space-y-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/35" />
                  <Input
                    placeholder="Search articles…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 text-sm glass border-foreground/[0.09] focus:border-emerald-500/30 focus:ring-0 rounded-xl placeholder:text-foreground/35"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 ${
                      selectedTag === null
                        ? 'sidebar-active'
                        : 'glass border border-foreground/[0.08] text-foreground/50 hover:text-foreground hover:border-foreground/15'
                    }`}
                  >
                    <Filter className="h-3 w-3" />
                    All Topics
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 ${
                        selectedTag === tag
                          ? 'sidebar-active'
                          : 'glass border border-foreground/[0.08] text-foreground/50 hover:text-foreground hover:border-foreground/15'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={120}>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="inline-flex glass rounded-xl p-1 border border-foreground/[0.07] mb-8 gap-0.5">
                  <TabsTrigger
                    value="all"
                    className="text-xs rounded-lg px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-foreground/50 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    All ({filteredPosts.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="series"
                    className="text-xs rounded-lg px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-foreground/50 transition-all"
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                    Series ({series.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="individual"
                    className="text-xs rounded-lg px-4 py-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-foreground/50 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                    Articles ({filteredIndividual.length})
                  </TabsTrigger>
                </TabsList>

                {/* All tab */}
                <TabsContent value="all" className="space-y-12 mt-0">
                  {series.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="w-1 h-4 rounded-full bg-amber-500" />
                        <h2 className="text-base font-semibold">Blog Series</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {series.map((serie) => (
                          <SeriesStepper key={serie.name} {...serie} />
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredPosts.filter((p) => !p.series).length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-5">
                        <span className="w-1 h-4 rounded-full bg-emerald-500" />
                        <h2 className="text-base font-semibold">Latest Articles</h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts
                          .filter((p) => !p.series)
                          .map((post) => (
                            <BlogCard key={post.slug} {...post} />
                          ))}
                      </div>
                    </section>
                  )}
                </TabsContent>

                {/* Series tab */}
                <TabsContent value="series" className="mt-0">
                  {series.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {series.map((serie) => (
                        <SeriesStepper key={serie.name} {...serie} />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <BookOpen className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-foreground/45">No blog series yet</p>
                    </div>
                  )}
                </TabsContent>

                {/* Individual tab */}
                <TabsContent value="individual" className="mt-0">
                  {filteredIndividual.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredIndividual.map((post) => (
                        <BlogCard key={post.slug} {...post} />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <FileText className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-foreground/45">
                        {searchTerm || selectedTag ? 'No matching articles' : 'No individual posts yet'}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </FadeInView>
          </>
        )}
      </div>
    </div>
  );
}
