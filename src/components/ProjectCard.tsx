
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ArrowUp } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  stars?: number;
  language?: string;
}

export function ProjectCard({ title, description, tags, githubUrl, stars, language }: ProjectCardProps) {
  const handleCardClick = () => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all border-gradient cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:bg-gradient-to-r group-hover:from-slate-700 group-hover:to-gray-700 dark:group-hover:from-slate-300 dark:group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gradient-to-r from-secondary to-secondary/80 hover:from-slate-500/10 hover:to-gray-500/10 transition-all duration-300">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {language && (
              <span className="flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-slate-600 to-gray-600 rounded-full mr-1" />
                {language}
              </span>
            )}
            {stars && (
              <span className="flex items-center">
                ⭐ {stars}
              </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-gradient-to-r hover:from-slate-500/10 hover:to-gray-500/10"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when button is clicked
              window.open(githubUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <Github className="h-4 w-4 mr-1" />
            <ArrowUp className="h-3 w-3 rotate-45" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
