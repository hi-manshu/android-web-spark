
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { BlogCard } from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export default function Home() {
  // Mock data - in real implementation, this would come from your GitHub API and blog posts
  const featuredProjects = [
    {
      title: "Charty",
      description: "A comprehensive Android chart library for creating beautiful, interactive charts with ease.",
      tags: ["Android", "Kotlin", "Charts", "Library"],
      githubUrl: "https://github.com/hi-manshu/Charty",
      stars: 250,
      language: "Kotlin"
    },
    {
      title: "Kalendar",
      description: "A beautiful calendar component for Android applications with customizable themes.",
      tags: ["Android", "Compose", "Calendar", "UI"],
      githubUrl: "https://github.com/hi-manshu/Kalendar",
      stars: 180,
      language: "Kotlin"
    },
    {
      title: "Pluck",
      description: "An image picker library for Android with modern design and smooth animations.",
      tags: ["Android", "Image Picker", "UI", "Library"],
      githubUrl: "https://github.com/hi-manshu/Pluck",
      stars: 95,
      language: "Kotlin"
    }
  ];

  const recentBlogPosts = [
    {
      title: "Building Modern Android Apps with Jetpack Compose",
      description: "Learn how to create beautiful, reactive UIs using Jetpack Compose and modern Android development practices.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["Android", "Jetpack Compose", "UI"],
      slug: "modern-android-jetpack-compose"
    },
    {
      title: "Creating Custom Charts in Android",
      description: "A deep dive into building custom chart components for Android applications with performance optimization.",
      date: "2024-01-10",
      readTime: "12 min read",
      tags: ["Android", "Custom Views", "Charts"],
      slug: "custom-charts-android"
    },
    {
      title: "Open Source Contribution Guide",
      description: "Everything you need to know about contributing to open source projects and building a strong developer profile.",
      date: "2024-01-05",
      readTime: "6 min read",
      tags: ["Open Source", "Career", "Development"],
      slug: "open-source-contribution-guide"
    }
  ];

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
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
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
