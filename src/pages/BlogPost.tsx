
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();

  // Mock blog post data - in real implementation, this would load markdown content
  const post = {
    title: "Building Modern Android Apps with Jetpack Compose",
    content: `
      <p>Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android with less code, powerful tools, and intuitive Kotlin APIs.</p>
      
      <h2>Getting Started with Compose</h2>
      <p>To get started with Jetpack Compose, you'll need to set up your development environment and create a new project with Compose support.</p>
      
      <h3>Setting up the Environment</h3>
      <p>Make sure you have the latest version of Android Studio and create a new project with Compose Activity template.</p>
      
      <h2>Core Concepts</h2>
      <p>Understanding the core concepts of Compose is essential for building effective UIs:</p>
      <ul>
        <li>Composable functions</li>
        <li>State management</li>
        <li>Recomposition</li>
        <li>Side effects</li>
      </ul>
      
      <h2>Building Your First Compose UI</h2>
      <p>Let's start by building a simple UI component that demonstrates the power of Compose.</p>
      
      <h2>Conclusion</h2>
      <p>Jetpack Compose represents the future of Android UI development. Its declarative approach makes building complex UIs much more intuitive and maintainable.</p>
    `,
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["Android", "Jetpack Compose", "UI"],
    author: "Himanshu Singh"
  };

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
