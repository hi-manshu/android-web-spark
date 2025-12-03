
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  author?: string;
}

export function BlogCard({ title, description, date, readTime, tags, slug, author }: BlogCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-border bg-card">
      <Link to={`/blog/${slug}`} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readTime}</span>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-medium group-hover:underline underline-offset-4">
              {title}
            </CardTitle>
          </div>

          <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-muted text-muted-foreground font-normal"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {author && (
            <div className="pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">By {author}</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
