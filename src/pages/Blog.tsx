import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { PageTitle, Reveal } from '@/components/motion';
import { getBlogSeries, getAllBlogPosts, type BlogPost, type BlogSeries } from '@/utils/markdownUtils';

export default function Blog() {
  const [series, setSeries] = useState<BlogSeries[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [s, a] = await Promise.all([getBlogSeries(), getAllBlogPosts()]);
      setSeries(s);
      setAllPosts(a);
      setIsLoading(false);
    })();
  }, []);

  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  const matches = (post: BlogPost) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    const matchTag = !selectedTag || post.tags.includes(selectedTag);
    return matchSearch && matchTag;
  };

  const filtered = allPosts.filter(matches);
  const standalone = filtered.filter((p) => !p.series);
  const isFiltering = Boolean(searchTerm || selectedTag);

  return (
    <div className="relative container py-10 md:py-14 max-w-4xl">
      <div className="page-glow" aria-hidden />
      <PageTitle title="Writing">
        Notes on Android, Kotlin, and maintaining open source.
        {!isLoading && allPosts.length > 0 && (
          <>
            {' '}
            {allPosts.length} {allPosts.length === 1 ? 'article' : 'articles'}
            {series.length > 0 && `, ${series.length} series`}.
          </>
        )}
      </PageTitle>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-6 border-b border-line">
              <div className="h-5 w-2/3 rounded bg-secondary mb-3" />
              <div className="h-3 w-full rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : allPosts.length === 0 ? (
        <div className="tile p-12 text-center">
          <p className="font-semibold mb-1">No articles yet</p>
          <p className="text-sm text-dim">
            Add markdown files to <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">src/content/blogs/</code>.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
            <label className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dim" />
              <input
                placeholder="Search articles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-full border border-line bg-surface text-sm placeholder:text-dim focus:border-ink outline-none transition-colors"
              />
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedTag(null)}
                className={`chip py-1 transition-colors ${selectedTag === null ? 'chip-active' : 'hover:border-ink hover:text-ink'}`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`chip py-1 transition-colors ${selectedTag === tag ? 'chip-active' : 'hover:border-ink hover:text-ink'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {!isFiltering && series.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold tracking-tight mb-5">Series</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {series.map((s, i) => (
                  <Reveal key={s.name} delay={i * 90} className="tile p-6">
                    <h3 className="text-lg font-bold tracking-tight">{s.name}</h3>
                    <p className="mt-1 text-sm text-dim line-clamp-2">{s.description}</p>
                    <ol className="mt-4 space-y-2">
                      {s.posts.map((post, i) => (
                        <li key={post.slug} className="flex gap-3 text-sm">
                          <span className="font-mono text-xs text-dim pt-0.5 w-5 flex-shrink-0">{i + 1}</span>
                          <Link to={`/blog/${post.slug}`} className="text-ink hover:text-ember transition-colors leading-snug">
                            {post.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                    <Link to={`/blog/${s.posts[0].slug}`} className="btn-line mt-5 text-xs py-2">
                      Start reading
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <section>
            {!isFiltering && series.length > 0 && (
              <h2 className="text-2xl font-bold tracking-tight mb-2">Articles</h2>
            )}
            {(isFiltering ? filtered : standalone).length > 0 ? (
              <div className="border-t border-line">
                {(isFiltering ? filtered : standalone).map((post, i) => (
                  <Reveal key={post.slug} delay={Math.min(i, 6) * 60}>
                    <BlogCard {...post} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="tile p-10 text-center text-sm text-dim">
                Nothing matches that search. Clear the filters to see every article.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
