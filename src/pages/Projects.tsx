
import { useQuery } from '@tanstack/react-query';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { Github, ArrowUpRight } from 'lucide-react';

export default function Projects() {
  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
  });

  const handleViewAll = () => {
    window.open('https://github.com/hi-manshu', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle background orb */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] orb-glow opacity-60 blur-3xl" />
      </div>

      <div className="container max-w-6xl py-14 relative">
        {/* Page header */}
        <FadeInView>
          <div className="mb-12">
            <p className="text-white/35 uppercase text-xs tracking-widest mb-2">
              Open Source
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Projects</h1>
            <p className="text-white/45 text-sm max-w-md">
              A collection of open source libraries and applications for the Android ecosystem
            </p>
          </div>
        </FadeInView>

        {error ? (
          <FadeInView>
            <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto">
              <p className="text-white/45 text-sm mb-4 relative z-10">
                Couldn't load projects from GitHub right now.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-xs text-white/40 hover:text-white underline relative z-10"
              >
                Try again
              </button>
            </div>
          </FadeInView>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <FadeInView key={i} delay={i * 80}>
                    <ProjectCardSkeleton />
                  </FadeInView>
                ))
              : repos?.slice(0, 7).map((project, index) => (
                  <FadeInView key={project.title} delay={index * 80}>
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

            {/* View all card */}
            {!isLoading && (
              <FadeInView delay={600}>
                <button
                  onClick={handleViewAll}
                  className="glass-card rounded-2xl flex flex-col items-center justify-center p-6 h-full min-h-[180px] text-center group w-full"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/[0.05] group-hover:bg-white/[0.08] flex items-center justify-center mb-3 transition-colors duration-200 relative z-10">
                    <Github className="h-5 w-5 text-white/35 group-hover:text-white/70 transition-colors duration-200" />
                  </div>
                  <p className="text-sm font-medium text-white/60 group-hover:text-white transition-colors mb-1 relative z-10">
                    View All Projects
                  </p>
                  <p className="text-xs text-white/35 relative z-10">Explore on GitHub</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                    Visit GitHub
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </button>
              </FadeInView>
            )}
          </div>
        )}

        {/* Footer note */}
        <FadeInView delay={800}>
          <div className="text-center mt-16 pt-8 border-t border-white/[0.06]">
            <p className="text-xs text-white/25">
              Built by Himanshu Singh. Source code on{' '}
              <a
                href="https://github.com/hi-manshu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </FadeInView>
      </div>
    </div>
  );
}
