
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { getAllBlogPosts } from '@/utils/markdownUtils';
import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepos } from '@/services/githubService';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  // Fetch GitHub repos for featured projects
  const { data: allProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => fetchGitHubRepos('hi-manshu'), // Replace with actual GitHub username
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get first 3 projects as featured
  const featuredProjects = allProjects?.slice(0, 3) || [];

  // Get recent blog posts from markdown files
  const allBlogPosts = getAllBlogPosts();
  const recentBlogPosts = allBlogPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Featured Projects Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">
                Some of my most popular open source libraries and applications
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/projects">
                View All Projects
                <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
              </a>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4 p-6 border rounded-lg">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))
            ) : (
              featuredProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Recent Blog Posts</h2>
              <p className="text-muted-foreground mt-2">
                Latest articles about Android development and technology
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/blog">
                View All Posts
                <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
              </a>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentBlogPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
