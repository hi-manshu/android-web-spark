
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Github, Code2, Rocket } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { FadeInView } from '@/components/FadeInView';
import { ProjectCardSkeleton } from '@/components/ProjectCardSkeleton';
import { Link } from 'react-router-dom';

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

  // Get first 4 projects as featured
  const featuredProjects = allProjects?.slice(0, 4) || [];

  // Get recent blog posts
  const recentBlogPosts = allBlogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container">
          <FadeInView>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Code2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-bold">50+</h3>
                <p className="text-muted-foreground">Projects Created</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Github className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-bold">1000+</h3>
                <p className="text-muted-foreground">GitHub Stars</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Rocket className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-3xl font-bold">5+</h3>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container">
          <FadeInView>
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Featured Projects
                </h2>
                <p className="text-muted-foreground text-lg">
                  Some of my most popular open source libraries and applications
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="hidden sm:flex">
                <Link to="/projects">
                  View All Projects
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInView>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {projectsLoading ? (
              // Loading skeletons with staggered animation
              Array.from({ length: 4 }).map((_, i) => (
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
                <Link to="/projects">
                  View All Projects
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInView>
        </div>
      </section>


    </div>
  );
}
