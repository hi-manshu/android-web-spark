// Blog post interface
export interface BlogPost {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  slug: string;
  content: string;
  series?: string;
  seriesOrder?: number;
}

// Blog series interface
export interface BlogSeries {
  name: string;
  description: string;
  posts: BlogPost[];
}

// Parse frontmatter from markdown content
export function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  console.log('Raw content length:', content.length);
  console.log('Content start:', content.substring(0, 200));
  
  // Check if content starts with frontmatter
  if (!content.trim().startsWith('---')) {
    console.log('Content does not start with frontmatter delimiter');
    return { frontmatter: {}, body: content };
  }
  
  // Find the end of frontmatter
  const lines = content.split('\n');
  let frontmatterEndIndex = -1;
  
  // Skip the first line (opening ---)
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      frontmatterEndIndex = i;
      break;
    }
  }
  
  if (frontmatterEndIndex === -1) {
    console.log('No closing frontmatter delimiter found');
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterLines = lines.slice(1, frontmatterEndIndex);
  const bodyLines = lines.slice(frontmatterEndIndex + 1);
  const body = bodyLines.join('\n').trim();
  
  console.log('Frontmatter lines:', frontmatterLines);
  console.log('Body start:', body.substring(0, 100));
  
  // Parse YAML-like frontmatter
  const frontmatter: any = {};
  
  for (const line of frontmatterLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex !== -1) {
      const key = trimmedLine.substring(0, colonIndex).trim();
      let value: string = trimmedLine.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags) - support both formats: [tag1, tag2] and ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        if (arrayContent.trim()) {
          const arrayValue = arrayContent.split(',').map(item => {
            let cleanItem = item.trim();
            // Remove quotes if present
            if ((cleanItem.startsWith('"') && cleanItem.endsWith('"')) || 
                (cleanItem.startsWith("'") && cleanItem.endsWith("'"))) {
              cleanItem = cleanItem.slice(1, -1);
            }
            return cleanItem;
          });
          frontmatter[key] = arrayValue;
        } else {
          frontmatter[key] = [];
        }
      } else {
        frontmatter[key] = value;
      }
    }
  }
  
  console.log('Parsed frontmatter result:', frontmatter);
  return { frontmatter, body };
}

// Convert markdown content to HTML (basic conversion)
export function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ul>)/gim, '$1');
  html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  
  return html;
}

// Get all blog posts by dynamically importing markdown files
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    // Import all markdown files from the blogs directory
    const blogModules = import.meta.glob('/src/content/blogs/*.md', { as: 'raw' });
    const posts: BlogPost[] = [];
    
    console.log('Loading blog posts from:', Object.keys(blogModules));
    
    for (const path in blogModules) {
      const content = await blogModules[path]();
      const filename = path.split('/').pop()?.replace('.md', '') || '';
      
      console.log('Processing file:', filename);
      console.log('Content preview:', content.substring(0, 200));
      
      const { frontmatter, body } = parseFrontmatter(content);
      
      // Create slug from filename if not provided in frontmatter
      const slug = frontmatter.slug || filename;
      
      const post: BlogPost = {
        title: frontmatter.title || filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: frontmatter.description || frontmatter.excerpt || 'No description available',
        date: frontmatter.date || frontmatter.publishedAt || new Date().toISOString().split('T')[0],
        readTime: frontmatter.readTime || frontmatter.readingTime || '5 min read',
        tags: frontmatter.tags || frontmatter.categories || ['General'],
        author: frontmatter.author || 'Himanshu Singh',
        slug,
        content: markdownToHtml(body),
        series: frontmatter.series,
        seriesOrder: frontmatter.seriesOrder ? parseInt(frontmatter.seriesOrder) : undefined
      };
      
      console.log('Created post:', post.title, 'with slug:', post.slug);
      posts.push(post);
    }
    
    // Sort posts by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

// Get blog posts organized by series
export async function getBlogSeries(): Promise<BlogSeries[]> {
  const posts = await getAllBlogPosts();
  const seriesMap = new Map<string, BlogPost[]>();
  
  // Group posts by series
  posts.forEach(post => {
    if (post.series) {
      if (!seriesMap.has(post.series)) {
        seriesMap.set(post.series, []);
      }
      seriesMap.get(post.series)!.push(post);
    }
  });
  
  // Convert to BlogSeries array and sort posts within each series
  const series: BlogSeries[] = [];
  seriesMap.forEach((posts, seriesName) => {
    const sortedPosts = posts.sort((a, b) => {
      if (a.seriesOrder && b.seriesOrder) {
        return a.seriesOrder - b.seriesOrder;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    series.push({
      name: seriesName,
      description: `A series of ${posts.length} articles about ${seriesName}`,
      posts: sortedPosts
    });
  });
  
  return series;
}

// Get individual blog posts (not part of any series)
export async function getIndividualBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => !post.series);
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
