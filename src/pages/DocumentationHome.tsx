import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowUpRight, Github, Star, GitFork, Sparkles, Zap, Package, CalendarDays, MessageCircle, ExternalLink } from 'lucide-react';
import { FadeInView } from '@/components/FadeInView';

const projects = [
  {
    name: 'krate',
    title: 'Krate',
    description:
      'Type-safe reactive database for Kotlin Multiplatform — zero boilerplate, Flow-based reactivity, and a KSP-generated Store<T> backed by Room. Ships to Android and iOS.',
    version: '0.1.0',
    stars: null,
    forks: null,
    tags: ['KMP', 'Kotlin', 'Android', 'iOS', 'Room', 'KSP'],
    githubUrl: 'https://github.com/hi-manshu/Krate',
    isNew: true,
    iconGradient: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.22)',
    glowClass: 'hover-glow-purple',
    Icon: Package,
  },
  {
    name: 'charty',
    title: 'Charty',
    description:
      'Beautiful charts for Jetpack Compose — 15+ chart types including bar, line, radar, candlestick, and more. Fully animated, interactive, and customizable.',
    version: '3.0.0-beta01',
    stars: '1.2k',
    forks: '180',
    tags: ['Android', 'Kotlin', 'Charts', 'Jetpack Compose'],
    githubUrl: 'https://github.com/hi-manshu/Charty',
    isNew: false,
    iconGradient: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59, 130, 246, 0.22)',
    glowClass: 'hover-glow-blue',
    Icon: Zap,
  },
  {
    name: 'kalendar',
    title: 'Kalendar',
    description:
      'Modern calendar component for Jetpack Compose — beautiful UI, flexible event management, and seamless integration into any Android application.',
    version: '1.5.2',
    stars: '850',
    forks: '120',
    tags: ['Android', 'Calendar', 'Jetpack Compose', 'UI'],
    githubUrl: 'https://github.com/hi-manshu/Kalendar',
    isNew: false,
    iconGradient: 'from-teal-500 to-emerald-500',
    glowColor: 'rgba(20, 184, 166, 0.22)',
    glowClass: 'hover-glow-teal',
    Icon: CalendarDays,
  },
];

export default function DocumentationHome() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] orb-purple opacity-60 blur-3xl" />
        <div className="absolute top-[15%] -right-20 w-[420px] h-[420px] orb-blue opacity-50 blur-3xl" />
        <div className="absolute bottom-[5%] left-[35%] w-[380px] h-[380px] orb-teal opacity-40 blur-3xl" />
        <div className="absolute top-[55%] -left-10 w-[280px] h-[280px] orb-pink opacity-30 blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero */}
        <section className="pt-24 pb-14 px-6">
          <div className="container max-w-4xl mx-auto">
            <FadeInView>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass mb-8 relative transition-transform hover:scale-105">
                  <BookOpen className="h-9 w-9 text-violet-500" />
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.3)' }}
                  />
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5">
                  <span className="text-gradient">Documentation</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Comprehensive guides and API references for every open source project.
                  Integrate, customize, and ship faster.
                </p>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Project Cards */}
        <section className="pb-20 px-6">
          <div className="container max-w-5xl mx-auto">
            <FadeInView delay={100}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
                Available Libraries
              </p>
            </FadeInView>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => {
                const { Icon } = project;
                return (
                  <FadeInView key={project.name} delay={index * 90 + 120}>
                    <div
                      className={`group relative glass rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:scale-[1.018] ${project.glowClass}`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.iconGradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                          style={{ boxShadow: `0 4px 16px ${project.glowColor}` }}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {project.isNew && (
                            <Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 text-xs gap-1 px-2 py-0.5">
                              <Sparkles className="h-3 w-3" />
                              New
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs font-mono px-2 py-0.5">
                            v{project.version}
                          </Badge>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-2 leading-snug">{project.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-xs bg-foreground/5 text-foreground/55 border border-foreground/[0.07]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* GitHub stats */}
                      {(project.stars || project.forks) && (
                        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                          {project.stars && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5" />
                              {project.stars}
                            </span>
                          )}
                          {project.forks && (
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3.5 w-3.5" />
                              {project.forks}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          asChild
                          className={`flex-1 bg-gradient-to-r ${project.iconGradient} text-white border-0 hover:opacity-90 transition-opacity shadow-sm`}
                          style={{ boxShadow: `0 2px 12px ${project.glowColor}` }}
                        >
                          <Link to={`/docs/${project.name}`}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Docs
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          className="glass border-foreground/10 hover:border-foreground/20"
                        >
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </section>

        {/* Help / CTA */}
        <section className="pb-24 px-6">
          <div className="container max-w-2xl mx-auto">
            <FadeInView delay={400}>
              <div className="glass rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-500/10 mb-4">
                  <MessageCircle className="h-5 w-5 text-violet-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Can't find what you're looking for? Browse the GitHub repositories for
                  examples, issues, and community discussions.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Button variant="outline" asChild className="glass border-foreground/10">
                    <Link to="/projects">
                      View All Projects
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="glass border-foreground/10">
                    <a href="https://github.com/hi-manshu" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                      <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-60" />
                    </a>
                  </Button>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      </div>
    </div>
  );
}
