
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug, getBlogSeries } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => slug ? getBlogPostBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allSeries = [] } = useQuery({
    queryKey: ['blog-series'],
    queryFn: getBlogSeries,
    staleTime: 5 * 60 * 1000,
  });

  // Find the series this post belongs to and navigation
  const currentSeries = post?.series ? allSeries.find(s => s.name === post.series) : null;
  const currentPostIndex = currentSeries ? currentSeries.posts.findIndex(p => p.slug === slug) : -1;
  const previousPost = currentSeries && currentPostIndex > 0 ? currentSeries.posts[currentPostIndex - 1] : null;
  const nextPost = currentSeries && currentPostIndex < currentSeries.posts.length - 1 ? currentSeries.posts[currentPostIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we load the blog post.
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button variant="outline" asChild>
            <Link to="/blog">← Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span>{post.readTime}</span>
            </div>
            
            {post.series && (
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-4 w-4 text-primary" />
                <Badge variant="outline">
                  Part {(currentPostIndex + 1)} of {currentSeries?.posts.length} in {post.series}
                </Badge>
              </div>
            )}
            
            <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm text-muted-foreground">By {post.author}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>
          
          <div 
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Series Navigation */}
          {currentSeries && (previousPost || nextPost) && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Continue Reading</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {previousPost && (
                  <Card className="group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Previous
                      </div>
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        <Link to={`/blog/${previousPost.slug}`}>
                          {previousPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )}
                
                {nextPost && (
                  <Card className="group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-end text-sm text-muted-foreground mb-1">
                        Next
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                      <CardTitle className="text-base text-right group-hover:text-primary transition-colors">
                        <Link to={`/blog/${nextPost.slug}`}>
                          {nextPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </div>
          )}
          
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link to="/blog">
                  ← Back to Blog
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  Follow on GitHub
                  <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                </a>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
