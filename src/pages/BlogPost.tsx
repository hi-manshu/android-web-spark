
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, BookOpen, ArrowLeft, ArrowRight, Calendar, Clock, User, Share2 } from 'lucide-react';
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
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Post Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist.
            </p>
          </div>
          <Button variant="outline" asChild size="lg">
            <Link to="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <article>
          {/* Header */}
          <header className="mb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span>/</span>
              <span>Article</span>
            </div>

            {/* Series Badge */}
            {post.series && (
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Part {(currentPostIndex + 1)} of {currentSeries?.posts.length} in {post.series}
                </Badge>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>
          
          {/* Content */}
          <div className="relative">
            <div 
              className="prose prose-lg prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          
          {/* Series Navigation */}
          {currentSeries && (previousPost || nextPost) && (
            <div className="mt-16 pt-12 border-t border-border">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Continue Reading</h3>
                <p className="text-muted-foreground">More articles from the {post.series} series</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {previousPost && (
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous Article
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        <Link to={`/blog/${previousPost.slug}`}>
                          {previousPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )}
                
                {nextPost && (
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                        Next Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                      <CardTitle className="text-lg text-right group-hover:text-primary transition-colors">
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
          
          {/* Footer */}
          <footer className="mt-16 pt-12 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button variant="outline" asChild size="lg" className="gap-2">
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg" className="gap-2">
                <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                  Follow on GitHub
                  <ArrowUp className="h-4 w-4 rotate-45" />
                </a>
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
