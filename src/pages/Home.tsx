
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { ArrowUpRight, Github, Code2, Rocket, BookOpen, Package, BarChart2, CalendarDays } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { Link } from 'react-router-dom';

const libraries = [
  {
    name: 'krate',
    title: 'Krate',
    tagline: 'Type-safe reactive database for Kotlin Multiplatform',
    description:
      'Zero-boilerplate persistence — a KSP-generated Store<T> backed by Room with Flow-based reactivity, querying, relations, and migrations. Ships to Android and iOS.',
    version: '0.1.0',
    isNew: true,
    Icon: Package,
    tags: ['KMP', 'Room', 'KSP'],
  },
  {
    name: 'charty',
    title: 'Charty',
    tagline: 'Charts for Jetpack Compose & Compose Multiplatform',
    description:
      '25+ chart types — bar, line, radar, candlestick, waterfall, and more. Fully animated, interactive, and themeable out of the box.',
    version: '3.0.0-beta01',
    isNew: false,
    Icon: BarChart2,
    tags: ['Compose', 'KMP', 'Charts'],
  },
  {
    name: 'kalendar',
    title: 'Kalendar',
    tagline: 'Calendar component for Jetpack Compose',
    description:
      'A modern, customizable calendar with event management that drops straight into any Android application.',
    version: '1.5.2',
    isNew: false,
    Icon: CalendarDays,
    tags: ['Compose', 'Calendar', 'UI'],
  },
];

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

      {/* Libraries showcase */}
      <section className="py-20">
        <div className="container">
          <FadeInView>
            <div className="text-center mb-12">
              <p className="text-white/35 text-xs uppercase tracking-widest mb-2">
                Signature Work
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Open Source Libraries</h2>
              <p className="text-white/45 text-sm max-w-lg mx-auto">
                Production-ready libraries for Android and Kotlin Multiplatform — each with full documentation.
              </p>
            </div>
          </FadeInView>

          <div className="grid gap-5 md:grid-cols-3">
            {libraries.map((lib, index) => (
              <FadeInView key={lib.name} delay={index * 120}>
                <div className="group glass-card rounded-2xl p-7 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                      <lib.Icon className="h-6 w-6 text-white/70" />
                    </div>
                    <div className="flex items-center gap-2">
                      {lib.isNew && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-white text-black">
                          New
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-white/35 px-2 py-1 rounded-full border border-white/[0.08]">
                        v{lib.version}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 relative z-10">{lib.title}</h3>
                  <p className="text-xs font-medium text-white/55 mb-3 relative z-10">{lib.tagline}</p>
                  <p className="text-sm text-white/40 leading-relaxed flex-1 relative z-10">
                    {lib.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4 mb-5 relative z-10">
                    {lib.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <Link
                      to={`/docs/${lib.name}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Docs
                    </Link>
                    <a
                      href={`https://github.com/hi-manshu/${lib.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-all"
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="container">
          <FadeInView>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-white/35 text-xs uppercase tracking-widest mb-2">
                  More on GitHub
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
