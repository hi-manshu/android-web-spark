import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { fetchGitHubRepos } from '@/services/githubService';
import { PageTitle, TiltCard } from '@/components/motion';

function SkeletonTile({ delay }: { delay: number }) {
  return (
    <div className="pop tile p-5 animate-pulse" style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      <div className="h-5 w-2/5 rounded bg-secondary mb-3" />
      <div className="h-3 w-full rounded bg-secondary mb-2" />
      <div className="h-3 w-4/5 rounded bg-secondary mb-6" />
      <div className="h-3 w-1/3 rounded bg-secondary" />
    </div>
  );
}

export default function Projects() {
  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
  });

  const base = 420;

  return (
    <div className="relative container py-10 md:py-14 max-w-6xl">
      <div className="page-glow" aria-hidden />

      <PageTitle
        title="Projects"
        aside={
          <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer" className="btn-line">
            All repositories
            <ArrowUpRight className="h-4 w-4" />
          </a>
        }
      >
        Open source libraries and apps for the Android and Kotlin ecosystem, pulled live from GitHub.
      </PageTitle>

      {error ? (
        <div className="pop tile p-10 text-center max-w-md mx-auto" style={{ '--d': `${base}ms` } as React.CSSProperties}>
          <p className="text-dim text-sm mb-4">GitHub did not answer. The list will load again on refresh.</p>
          <button onClick={() => window.location.reload()} className="btn-ink">
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonTile key={i} delay={base + i * 70} />)
            : repos?.map((project, i) => (
                <TiltCard key={project.title} delay={base + i * 90}>
                  <ProjectCard {...project} delay={base + i * 90} />
                </TiltCard>
              ))}
        </div>
      )}
    </div>
  );
}
