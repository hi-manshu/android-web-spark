
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/50 hover:from-card/80 hover:via-card hover:to-accent/20">
      <Link to={`/blog/${slug}`} className="block h-full">
        <CardHeader className="space-y-4">
          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
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
          <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {author && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{author}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-sm font-medium">Read more</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
