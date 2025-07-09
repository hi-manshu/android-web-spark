
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
                <div className="h-48">
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    githubUrl={project.githubUrl}
                    stars={project.stars}
                    language={project.language}
                  />
                </div>
              </FadeInView>
            ))}
        
        {!isLoading && (
          <FadeInView delay={700}>
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-md-sys-color-outline bg-md-sys-color-primary hover:bg-md-sys-color-primary/90 h-48"
              onClick={handleViewAllClick}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-md-sys-color-on-primary text-center space-y-3">
                <div className="w-12 h-12 bg-md-sys-color-on-primary/20 rounded-full flex items-center justify-center group-hover:bg-md-sys-color-on-primary/30 transition-colors duration-300">
                  <Github className="h-6 w-6" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">View All Projects</h3>
                  <p className="text-md-sys-color-on-primary/90 text-xs">
                    Explore all repositories on GitHub
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-xs font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Visit GitHub</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </FadeInView>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-md-sys-color-outline">
        <p className="text-md-sys-color-on-surface-variant text-sm">
          Built by Himanshu Singh. The source code is available on{' '}
          <a 
            href="https://github.com/hi-manshu" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-md-sys-color-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
