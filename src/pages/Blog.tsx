
import { BlogCard } from '@/components/BlogCard';

export default function Blog() {
  // Mock blog posts - in real implementation, this would come from your markdown files
  const blogPosts = [
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
    },
    {
      title: "State Management in Android with ViewModel",
      description: "Best practices for managing state in Android applications using ViewModel and LiveData patterns.",
      date: "2023-12-28",
      readTime: "10 min read",
      tags: ["Android", "ViewModel", "Architecture"],
      slug: "state-management-android-viewmodel"
    },
    {
      title: "Kotlin Coroutines for Android Developers",
      description: "Master asynchronous programming in Android with Kotlin Coroutines and Flow.",
      date: "2023-12-20",
      readTime: "15 min read",
      tags: ["Kotlin", "Coroutines", "Android"],
      slug: "kotlin-coroutines-android"
    },
    {
      title: "Testing Android Applications",
      description: "Comprehensive guide to unit testing, integration testing, and UI testing in Android development.",
      date: "2023-12-15",
      readTime: "12 min read",
      tags: ["Android", "Testing", "Quality"],
      slug: "testing-android-applications"
    }
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Thoughts on Android development, open source, and technology
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
