
import { ProjectCard } from '@/components/ProjectCard';

export default function Projects() {
  // Mock projects - in real implementation, this would come from GitHub API
  const projects = [
    {
      title: "Charty",
      description: "A comprehensive Android chart library for creating beautiful, interactive charts with ease. Supports line charts, bar charts, pie charts, and more.",
      tags: ["Android", "Kotlin", "Charts", "Library"],
      githubUrl: "https://github.com/hi-manshu/Charty",
      stars: 250,
      language: "Kotlin"
    },
    {
      title: "Kalendar",
      description: "A beautiful calendar component for Android applications with customizable themes and smooth animations.",
      tags: ["Android", "Compose", "Calendar", "UI"],
      githubUrl: "https://github.com/hi-manshu/Kalendar",
      stars: 180,
      language: "Kotlin"
    },
    {
      title: "Pluck",
      description: "An image picker library for Android with modern design and smooth animations. Easy to integrate and customize.",
      tags: ["Android", "Image Picker", "UI", "Library"],
      githubUrl: "https://github.com/hi-manshu/Pluck",
      stars: 95,
      language: "Kotlin"
    },
    {
      title: "ColorPicker",
      description: "A flexible color picker component for Android with support for different color models and custom palettes.",
      tags: ["Android", "Color Picker", "UI", "Compose"],
      githubUrl: "https://github.com/hi-manshu/ColorPicker",
      stars: 75,
      language: "Kotlin"
    },
    {
      title: "AnimationUtils",
      description: "A collection of useful animation utilities for Android development with Jetpack Compose.",
      tags: ["Android", "Animation", "Compose", "Utils"],
      githubUrl: "https://github.com/hi-manshu/AnimationUtils",
      stars: 45,
      language: "Kotlin"
    },
    {
      title: "NetworkHelper",
      description: "A lightweight networking library for Android with built-in retry logic and error handling.",
      tags: ["Android", "Networking", "HTTP", "Library"],
      githubUrl: "https://github.com/hi-manshu/NetworkHelper",
      stars: 35,
      language: "Kotlin"
    }
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground">
          Open source libraries and applications I've built for the Android community
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
