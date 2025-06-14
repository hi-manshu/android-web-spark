
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

export function BlogCard({ title, description, date, readTime, tags, slug }: BlogCardProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 2000); // Remove animation after 2 seconds
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all border-gradient moving-border ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <Link to={`/blog/${slug}`}>
        <CardHeader className="relative">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
            <span className="bg-gradient-to-r from-slate-500/10 to-gray-500/10 px-2 py-1 rounded-full text-xs">{readTime}</span>
          </div>
          <CardTitle className="group-hover:bg-gradient-to-r group-hover:from-slate-700 group-hover:to-gray-700 dark:group-hover:from-slate-300 dark:group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-gradient-to-r from-secondary to-secondary/80 hover:from-slate-500/10 hover:to-gray-500/10 transition-all duration-300">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
