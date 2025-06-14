
// Blog post interface
export interface BlogPost {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  slug: string;
  content: string;
}

// Parse frontmatter from markdown content
export function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  
  // Parse YAML-like frontmatter
  const frontmatter: any = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => 
          item.trim().replace(/"/g, '').replace(/'/g, '')
        );
      }
      
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, body };
}

// Convert markdown content to HTML (basic conversion)
export function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ul>)/gim, '$1');
  html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  
  return html;
}

// Get all blog posts (in a real app, this would read from the file system)
export function getAllBlogPosts(): BlogPost[] {
  // For now, we'll simulate loading from markdown files
  // In a real implementation, you would use a build-time process to read files
  const posts = [
    {
      slug: 'modern-android-jetpack-compose',
      content: `---
title: "Building Modern Android Apps with Jetpack Compose"
description: "Learn how to create beautiful, reactive UIs using Jetpack Compose and modern Android development practices."
date: "2024-01-15"
readTime: "8 min read"
tags: ["Android", "Jetpack Compose", "UI"]
author: "Himanshu Singh"
---

# Building Modern Android Apps with Jetpack Compose

Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android with less code, powerful tools, and intuitive Kotlin APIs.

## Getting Started with Compose

To get started with Jetpack Compose, you'll need to set up your development environment and create a new project with Compose support.

### Setting up the Environment

Make sure you have the latest version of Android Studio and create a new project with Compose Activity template.

## Core Concepts

Understanding the core concepts of Compose is essential for building effective UIs:

- Composable functions
- State management
- Recomposition
- Side effects

## Building Your First Compose UI

Let's start by building a simple UI component that demonstrates the power of Compose.

## Conclusion

Jetpack Compose represents the future of Android UI development. Its declarative approach makes building complex UIs much more intuitive and maintainable.`
    },
    {
      slug: 'custom-charts-android',
      content: `---
title: "Creating Custom Charts in Android"
description: "A deep dive into building custom chart components for Android applications with performance optimization."
date: "2024-01-10"
readTime: "12 min read"
tags: ["Android", "Custom Views", "Charts"]
author: "Himanshu Singh"
---

# Creating Custom Charts in Android

Building custom chart components for Android applications requires understanding of custom views, canvas drawing, and performance optimization techniques.

## Understanding Custom Views

Custom views in Android allow you to create unique UI components that aren't available in the standard library.

## Canvas Drawing Basics

The Canvas class provides methods for drawing primitives like lines, circles, and rectangles.

## Performance Considerations

When creating custom charts, performance is crucial for smooth user experience.

## Conclusion

Custom charts can greatly enhance your Android applications when built with performance in mind.`
    },
    {
      slug: 'open-source-contribution-guide',
      content: `---
title: "Open Source Contribution Guide"
description: "Everything you need to know about contributing to open source projects and building a strong developer profile."
date: "2024-01-05"
readTime: "6 min read"
tags: ["Open Source", "Career", "Development"]
author: "Himanshu Singh"
---

# Open Source Contribution Guide

Contributing to open source projects is one of the best ways to improve your skills and build a strong developer profile.

## Getting Started

Start by finding projects that interest you and align with your skill level.

## Making Your First Contribution

Begin with small contributions like documentation fixes or minor bug fixes.

## Building Your Profile

Consistent contributions help build a strong developer profile that employers value.

## Conclusion

Open source contribution is a journey that benefits both you and the community.`
    }
  ];

  return posts.map(post => {
    const { frontmatter, body } = parseFrontmatter(post.content);
    return {
      ...frontmatter,
      slug: post.slug,
      content: markdownToHtml(body)
    } as BlogPost;
  });
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
