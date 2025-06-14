
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';

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
          : repos?.map((project, index) => (
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
      </div>
    </div>
  );
}
