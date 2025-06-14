
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

export function BlogCard({ title, description, date, readTime, tags, slug }: BlogCardProps) {
  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg">
      <Link to={`/blog/${slug}`}>
        <CardHeader>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
            <span>{readTime}</span>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
