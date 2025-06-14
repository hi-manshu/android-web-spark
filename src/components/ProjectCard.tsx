
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
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {language && (
              <span className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-full mr-1" />
                {language}
              </span>
            )}
            {stars && (
              <span className="flex items-center">
                ⭐ {stars}
              </span>
            )}
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-1" />
              <ArrowUp className="h-3 w-3 rotate-45" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
