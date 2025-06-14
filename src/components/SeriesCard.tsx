
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogSeries } from '@/utils/markdownUtils';

interface SeriesCardProps extends BlogSeries {}

export function SeriesCard({ name, description, posts }: SeriesCardProps) {
  const latestPost = posts[0];
  
  return (
    <Card className="group cursor-pointer transition-all border-gradient h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <CardHeader className="relative">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="text-xs">
            {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
          </Badge>
        </div>
        
        <CardTitle className="group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {name}
        </CardTitle>
        
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Latest: <span className="font-medium">{latestPost.title}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <time className="text-xs text-muted-foreground">
              Updated {new Date(latestPost.date).toLocaleDateString()}
            </time>
            
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/blog/${latestPost.slug}`}>
                Start Reading
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
