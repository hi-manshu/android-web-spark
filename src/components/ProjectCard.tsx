
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ArrowUpRight, Star } from 'lucide-react';

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
      className="group cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-border bg-card"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium group-hover:underline underline-offset-4">
            {title}
          </CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-muted text-muted-foreground font-normal"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 font-normal">
              +{tags.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-foreground" />
                <span>{language}</span>
              </div>
            )}
            {stars !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>{stars}</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <Github className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
