
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
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
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-card via-card to-card/50 shadow-lg hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
      <Link to={`/blog/${slug}`} className="block h-full flex flex-col">
        <CardHeader className="space-y-4 flex-shrink-0">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</time>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-grow flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            {author && (
              <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="font-medium">{author}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1.5 text-primary group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-sm font-medium">Read more</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
