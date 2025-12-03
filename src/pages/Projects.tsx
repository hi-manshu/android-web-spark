
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { Card, CardContent } from '@/components/ui/card';
import { Github, ArrowRight } from 'lucide-react';

export default function Projects() {
  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
  });

  if (error) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, there was an error loading the projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const handleViewAllClick = () => {
    window.open('https://github.com/hi-manshu', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-12">
        <FadeInView>
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-lg text-muted-foreground">
            A collection of my open source projects and contributions
          </p>
        </FadeInView>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <FadeInView key={i} delay={i * 100}>
                <ProjectCardSkeleton />
              </FadeInView>
            ))
          : repos?.slice(0, 7).map((project, index) => (
              <FadeInView key={project.title} delay={index * 100}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  githubUrl={project.githubUrl}
                  stars={project.stars}
                  language={project.language}
                />
              </FadeInView>
            ))}
        
        {!isLoading && (
          <FadeInView delay={700}>
             <Card 
               className="group cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-border bg-card h-full flex flex-col"
               onClick={handleViewAllClick}
             >
               <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4 min-h-[200px]">
                 <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                   <Github className="h-6 w-6 text-muted-foreground" />
                 </div>
                 
                 <div className="space-y-1">
                   <h3 className="text-base font-medium group-hover:underline underline-offset-4">View All Projects</h3>
                   <p className="text-muted-foreground text-sm">
                     Explore all repositories on GitHub
                   </p>
                 </div>
                 
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                   <span>Visit GitHub</span>
                   <ArrowRight className="h-4 w-4" />
                 </div>
               </CardContent>
             </Card>
          </FadeInView>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-border">
        <p className="text-muted-foreground text-sm">
          Built by Himanshu Singh. The source code is available on{' '}
          <a 
            href="https://github.com/hi-manshu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
