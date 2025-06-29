
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ArrowUp, Star, GitFork } from 'lucide-react';

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
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col bg-gradient-to-br from-card via-card to-card/50 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      <CardHeader className="relative flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative flex flex-col flex-grow pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 4).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{tags.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {language && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-500 rounded-full" />
                <span className="font-medium">{language}</span>
              </div>
            )}
            {stars && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{stars}</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-primary/10 hover:text-primary transition-colors gap-1.5 opacity-70 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <Github className="h-4 w-4" />
            <ArrowUp className="h-3 w-3 rotate-45" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
