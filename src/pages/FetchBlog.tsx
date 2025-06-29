
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Calendar, User, ExternalLink, Copy, Check } from 'lucide-react';
import { FadeInView } from '@/components/FadeInView';
import { fetchHashnodePost } from '@/services/hashnodeService';

interface BlogPost {
  title: string;
  content: string;
  publishedAt: string;
  author: string;
  tags: string[];
  url: string;
}

export default function FetchBlog() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchBlogPost = async () => {
    if (!url.trim()) {
      setError('Please enter a valid Hashnode URL');
      return;
    }

    // Validate Hashnode URL
    if (!url.includes('hashnode.') && !url.includes('hashnode.com')) {
      setError('Please enter a valid Hashnode blog post URL');
      return;
    }

    setLoading(true);
    setError('');
    setBlogPost(null);

    try {
      const post = await fetchHashnodePost(url);
      
      if (!post) {
        setError('Blog post not found. Please check the URL and try again.');
        return;
      }

      setBlogPost(post);
    } catch (err) {
      setError('Failed to fetch blog post. Please check the URL and try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (blogPost?.content) {
      navigator.clipboard.writeText(blogPost.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    if (blogPost?.content) {
      const blob = new Blob([blogPost.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${blogPost.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
        <div className="container relative">
          <FadeInView>
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <FileText className="h-16 w-16 text-blue-600" />
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Hashnode Blog Fetcher
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Extract and convert Hashnode blog posts into clean markdown format. 
                Perfect for content curation and documentation.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/30">
        <div className="container max-w-6xl">
          <FadeInView>
            <Card className="mb-8 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  Fetch Hashnode Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Hashnode post URL (e.g., https://yourname.hashnode.dev/post-slug)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button 
                    onClick={fetchBlogPost} 
                    disabled={loading || !url.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? 'Fetching...' : 'Fetch'}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </CardContent>
            </Card>
          </FadeInView>

          {blogPost && (
            <FadeInView delay={200}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Blog Post Content */}
                <div className="lg:col-span-2">
                  <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <CardTitle className="text-3xl mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                            {blogPost.title}
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{blogPost.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(blogPost.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={blogPost.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Source
                              </a>
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {blogPost.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto max-h-96">
                          {blogPost.content}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button 
                          onClick={copyMarkdown} 
                          variant="outline" 
                          className="w-full"
                          disabled={!blogPost.content}
                        >
                          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                          {copied ? 'Copied!' : 'Copy Markdown'}
                        </Button>
                        
                        <Button 
                          onClick={downloadMarkdown} 
                          variant="outline" 
                          className="w-full"
                          disabled={!blogPost.content}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download .md
                        </Button>
                        
                        <Separator />
                        
                        <div className="text-sm text-muted-foreground">
                          <p className="font-semibold mb-2">Content Stats:</p>
                          <p>Characters: {blogPost.content.length.toLocaleString()}</p>
                          <p>Words: {blogPost.content.split(/\s+/).length.toLocaleString()}</p>
                          <p>Lines: {blogPost.content.split('\n').length.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </FadeInView>
          )}

          {!blogPost && !loading && (
            <FadeInView delay={200}>
              <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg">
                <CardContent className="py-16 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
                  <p className="text-muted-foreground">
                    Enter a Hashnode blog post URL above to fetch and convert it to markdown format.
                  </p>
                </CardContent>
              </Card>
            </FadeInView>
          )}
        </div>
      </section>
    </div>
  );
}
