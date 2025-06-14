
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { getBlogPostBySlug } from '@/utils/markdownUtils';

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : null;

  if (!post) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Button variant="outline" asChild>
            <a href="/blog">← Back to Blog</a>
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
          
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <a href="/blog">
                  ← Back to Blog
                </a>
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
