
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight, BookOpen } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { BlogSeries } from '@/utils/markdownUtils';

interface SeriesStepperProps extends BlogSeries {}

export function SeriesStepper({ name, description, posts }: SeriesStepperProps) {
  const { slug } = useParams();
  const currentPostIndex = slug ? posts.findIndex(post => post.slug === slug) : -1;
  
  return (
    <Card className="group transition-all border-gradient h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <CardHeader className="relative flex-shrink-0">
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
      
      <CardContent className="relative space-y-4 flex-grow flex flex-col">
        {/* Series Progress Stepper */}
        <div className="space-y-3 flex-grow">
          {posts.map((post, index) => {
            const isCompleted = currentPostIndex > index;
            const isCurrent = currentPostIndex === index;
            const isUpcoming = currentPostIndex < index;
            
            return (
              <div key={post.slug} className="flex items-center space-x-3">
                {/* Step Indicator */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isCurrent ? (
                    <div className="h-5 w-5 rounded-full bg-primary border-2 border-primary animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium truncate ${
                        isCurrent ? 'text-primary' : 
                        isCompleted ? 'text-foreground' : 
                        'text-muted-foreground'
                      }`}>
                        Part {index + 1}: {post.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {post.readTime} • {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {(isCompleted || isCurrent) && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blog/${post.slug}`}>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < posts.length - 1 && (
                  <div className="absolute left-[22px] mt-8 w-0.5 h-6 bg-border" 
                       style={{ top: `${(index + 1) * 64 + 32}px` }} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Series Action */}
        <div className="pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/blog/${posts[0].slug}`}>
              {currentPostIndex === -1 ? 'Start Series' : 'Continue Reading'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
