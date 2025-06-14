
interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  stars: number;
  language: string;
}

export const fetchGitHubRepos = async (username: string): Promise<ProjectData[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and private repos, sort by stars, and transform to our format
    return repos
      .filter(repo => !repo.name.includes('.') && repo.description) // Basic filtering
      .sort((a, b) => b.stargazers_count - a.stargazers_count) // Sort by stars descending
      .slice(0, 6) // Limit to 6 repos
      .map(repo => ({
        title: repo.name,
        description: repo.description || 'No description available',
        tags: repo.topics.length > 0 ? repo.topics : [repo.language || 'Unknown'].filter(Boolean),
        githubUrl: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown'
      }));
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    // Return fallback data in case of error
    return getFallbackProjects();
  }
};

// Fallback data in case GitHub API fails
const getFallbackProjects = (): ProjectData[] => [
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
  }
];
