
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { fetchGitHubRepos } from '@/services/githubService';

export default function Projects() {
  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchGitHubRepos,
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
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">Projects</h1>
        <p className="text-lg text-muted-foreground animate-fade-in">
          A collection of my open source projects and contributions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          : repos?.map((repo) => (
              <div key={repo.id} className="animate-fade-in">
                <ProjectCard
                  title={repo.name}
                  description={repo.description || 'No description available'}
                  tags={repo.topics || []}
                  githubUrl={repo.html_url}
                  stars={repo.stargazers_count}
                  language={repo.language}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
