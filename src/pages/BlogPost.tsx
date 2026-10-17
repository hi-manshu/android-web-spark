import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug, getBlogSeries } from '@/utils/markdownUtils';

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="read-progress" aria-hidden>
      <div className="read-progress__bar" style={{ '--p': `${p}%` } as React.CSSProperties} />
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => (slug ? getBlogPostBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allSeries = [] } = useQuery({
    queryKey: ['blog-series'],
    queryFn: getBlogSeries,
    staleTime: 5 * 60 * 1000,
  });

  const currentSeries = post?.series ? allSeries.find((s) => s.name === post.series) : null;
  const currentIndex = currentSeries ? currentSeries.posts.findIndex((p) => p.slug === slug) : -1;
  const previousPost = currentSeries && currentIndex > 0 ? currentSeries.posts[currentIndex - 1] : null;
  const nextPost =
    currentSeries && currentIndex < currentSeries.posts.length - 1 ? currentSeries.posts[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="container py-16 max-w-3xl animate-pulse space-y-6">
        <div className="h-4 w-24 rounded bg-secondary" />
        <div className="h-12 w-3/4 rounded bg-secondary" />
        <div className="h-4 w-1/2 rounded bg-secondary" />
        <div className="space-y-3 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-24 max-w-xl text-center">
        <h1 className="display text-5xl mb-4">Not found</h1>
        <p className="text-dim mb-8">There is no article at this address.</p>
        <Link to="/blog" className="btn-ink">
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>
      </div>
    );
  }

  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="container py-12 md:py-16 max-w-3xl">
      <ReadingProgress />
      <header className="mb-12">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-dim hover:text-ink transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Writing
        </Link>

        {post.series && currentSeries && (
          <p className="mt-8 text-sm text-dim">
            Part {currentIndex + 1} of {currentSeries.posts.length} in{' '}
            <span className="text-ink font-medium">{post.series}</span>
          </p>
        )}

        <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl rise" style={{ '--d': '80ms' } as React.CSSProperties}>{post.title}</h1>

        <p className="mt-6 text-dim text-sm flex flex-wrap gap-x-4 gap-y-1 rise" style={{ '--d': '240ms' } as React.CSSProperties}>
          <time dateTime={post.date}>{date}</time>
          <span>{post.readTime}</span>
          <span>{post.author}</span>
        </p>

        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg rise" style={{ '--d': '380ms' } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: post.content }} />

      {currentSeries && (previousPost || nextPost) && (
        <nav className="mt-16 pt-10 border-t border-line grid gap-4 sm:grid-cols-2">
          {previousPost ? (
            <Link to={`/blog/${previousPost.slug}`} className="tile group p-5">
              <span className="text-xs text-dim inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Previous
              </span>
              <span className="block mt-2 font-semibold tracking-tight group-hover:text-ember transition-colors">
                {previousPost.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link to={`/blog/${nextPost.slug}`} className="tile group p-5 text-right">
              <span className="text-xs text-dim inline-flex items-center gap-1">
                Next
                <ArrowRight className="h-3 w-3" />
              </span>
              <span className="block mt-2 font-semibold tracking-tight group-hover:text-ember transition-colors">
                {nextPost.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
