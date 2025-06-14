
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowUp, Github, Code2, Rocket } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';

export default function Home() {
  // Fetch GitHub repos for featured projects
  const { data: allProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch blog posts
  const { data: allBlogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getAllBlogPosts,
    staleTime: 5 * 60 * 1000,
  });

  // Get first 3 projects as featured
  const featuredProjects = allProjects?.slice(0, 3) || [];

  // Get recent blog posts
  const recentBlogPosts = allBlogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50/50 via-white to-gray-50/50 dark:from-slate-900/50 dark:via-background dark:to-gray-900/50">
        <div className="container">
          <FadeInView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Code2 className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                  50+
                </h3>
                <p className="text-muted-foreground">Projects Created</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Github className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                  1000+
                </h3>
                <p className="text-muted-foreground">GitHub Stars</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Rocket className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                  5+
                </h3>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5" />
        
        <div className="container relative">
          <FadeInView>
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <p className="text-muted-foreground text-lg">
                  Some of my most popular open source libraries and applications
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden sm:flex">
                <a href="/projects">
                  View All Projects
                  <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
                </a>
              </Button>
            </div>
          </FadeInView>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsLoading ? (
              // Loading skeletons with staggered animation
              Array.from({ length: 3 }).map((_, i) => (
                <FadeInView key={i} delay={i * 150}>
                  <ProjectCardSkeleton />
                </FadeInView>
              ))
            ) : (
              featuredProjects.map((project, index) => (
                <FadeInView key={project.title} delay={index * 150}>
                  <ProjectCard {...project} />
                </FadeInView>
              ))
            )}
          </div>
          
          {/* Mobile button */}
          <FadeInView delay={600}>
            <div className="flex justify-center mt-12 sm:hidden">
              <Button variant="outline" size="lg" asChild>
                <a href="/projects">
                  View All Projects
                  <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
                </a>
              </Button>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50/30 via-white to-gray-50/30 dark:from-slate-900/30 dark:via-background dark:to-gray-900/30">
        <div className="container">
          <FadeInView>
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                  Recent Blog Posts
                </h2>
                <p className="text-muted-foreground text-lg">
                  Latest articles about Android development and technology
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden sm:flex">
                <a href="/blog">
                  View All Posts
                  <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
                </a>
              </Button>
            </div>
          </FadeInView>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <FadeInView key={i} delay={i * 150}>
                  <div className="animate-pulse">
                    <div className="bg-muted rounded-lg h-48"></div>
                  </div>
                </FadeInView>
              ))
            ) : (
              recentBlogPosts.map((post, index) => (
                <FadeInView key={post.slug} delay={index * 150}>
                  <BlogCard {...post} />
                </FadeInView>
              ))
            )}
          </div>
          
          {/* Mobile button */}
          <FadeInView delay={600}>
            <div className="flex justify-center mt-12 sm:hidden">
              <Button variant="outline" size="lg" asChild>
                <a href="/blog">
                  View All Posts
                  <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
                </a>
              </Button>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
