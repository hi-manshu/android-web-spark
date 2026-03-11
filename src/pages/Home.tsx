
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { ArrowUpRight, Github, Code2, Rocket, BookOpen } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { Link } from 'react-router-dom';

const stats = [
  {
    icon: Code2,
    value: '50+',
    label: 'Projects Created',
  },
  {
    icon: Github,
    value: '1000+',
    label: 'GitHub Stars',
  },
  {
    icon: Rocket,
    value: '5+',
    label: 'Years Experience',
  },
];

export default function Home() {
  const { data: allProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allBlogPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getAllBlogPosts,
    staleTime: 5 * 60 * 1000,
  });

  const featuredProjects = allProjects?.slice(0, 4) || [];
  const recentBlogPosts = allBlogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Stats */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="container">
          <FadeInView>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 relative z-10">
                    <s.icon className="h-5 w-5 text-white/70" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold tracking-tight text-white">{s.value}</div>
                    <div className="text-sm text-white/45 mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container">
          <FadeInView>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-white/35 text-xs uppercase tracking-widest mb-2">
                  Open Source
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-white">Featured Projects</h2>
                <p className="text-white/45 mt-1 text-sm">
                  Popular libraries and applications for Android developers
                </p>
              </div>
              <Link
                to="/projects"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeInView>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {projectsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <FadeInView key={i} delay={i * 100}>
                    <ProjectCardSkeleton />
                  </FadeInView>
                ))
              : featuredProjects.map((project, index) => (
                  <FadeInView key={project.title} delay={index * 100}>
                    <ProjectCard {...project} />
                  </FadeInView>
                ))}
          </div>

          <FadeInView delay={500}>
            <div className="flex justify-center mt-10 sm:hidden">
              <Link
                to="/projects"
                className="flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-full glass border-white/10 text-white/60 hover:text-white transition-all duration-200"
              >
                View All Projects
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentBlogPosts.length > 0 && (
        <section className="py-20 border-t border-white/[0.06]">
          <div className="container">
            <FadeInView>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-white/35 text-xs uppercase tracking-widest mb-2">
                    Writing
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Latest Articles</h2>
                  <p className="text-white/45 mt-1 text-sm">
                    Thoughts on Android, open source, and technology
                  </p>
                </div>
                <Link
                  to="/blog"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors"
                >
                  Read all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeInView>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentBlogPosts.map((post, index) => (
                <FadeInView key={post.slug} delay={index * 100}>
                  <BlogCard {...post} />
                </FadeInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Docs CTA */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container">
          <FadeInView>
            <div className="glass-card rounded-3xl p-10 text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-5 relative z-10">
                <BookOpen className="h-6 w-6 text-white/70" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-3 text-white relative z-10">
                Documentation
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md mx-auto relative z-10">
                Comprehensive docs for Charty, Krate, and Kalendar — open source libraries built for the Android ecosystem.
              </p>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 text-sm font-semibold transition-all duration-200 relative z-10"
              >
                Browse Docs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
