
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <FadeInView key={i} delay={i * 100}>
                <ProjectCardSkeleton />
              </FadeInView>
            ))
          : repos?.slice(0, 6).map((project, index) => (
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
          <FadeInView delay={600}>
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 h-full"
              onClick={handleViewAllClick}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-white text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <Github className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">View All Projects</h3>
                  <p className="text-white/90 text-sm">
                    Explore all my repositories on GitHub
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Visit GitHub</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </FadeInView>
        )}
      </div>
    </div>
  );
}
