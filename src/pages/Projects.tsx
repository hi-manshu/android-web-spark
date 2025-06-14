
import { ProjectCard } from '@/components/ProjectCard';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { Skeleton } from '@/components/ui/skeleton';

export default function Projects() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'), // Replace with actual GitHub username
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
          <p className="text-xl text-muted-foreground">
            Open source libraries and applications I've built for the Android community
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 p-6 border rounded-lg">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
          <p className="text-xl text-muted-foreground">
            Open source libraries and applications I've built for the Android community
          </p>
        </div>
        
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Unable to load projects from GitHub. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground">
          Open source libraries and applications I've built for the Android community
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
