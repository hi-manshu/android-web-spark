
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, ArrowUp } from 'lucide-react';

export default function Documentation() {
  const { project } = useParams();

  // Mock documentation data - in real implementation, this would load from markdown files
  const getDocumentation = (projectName: string) => {
    const docs = {
      charty: {
        title: "Charty Documentation",
        description: "A comprehensive Android chart library for creating beautiful, interactive charts",
        githubUrl: "https://github.com/hi-manshu/Charty",
        version: "2.0.0",
        content: `
          <h2>Overview</h2>
          <p>Charty is a comprehensive Android chart library that provides beautiful, interactive charts for your Android applications. Built with Jetpack Compose, it offers a modern approach to data visualization.</p>
          
          <h2>Installation</h2>
          <p>Add the following dependency to your app's build.gradle file:</p>
          <pre><code>implementation 'com.himanshoe:charty:2.0.0'</code></pre>
          
          <h2>Quick Start</h2>
          <p>Here's how to create a simple line chart:</p>
          <pre><code>@Composable
fun MyChart() {
    LineChart(
        data = listOf(
            ChartData(1f, 10f),
            ChartData(2f, 15f),
            ChartData(3f, 8f)
        )
    )
}</code></pre>
          
          <h2>Chart Types</h2>
          <ul>
            <li>Line Charts</li>
            <li>Bar Charts</li>
            <li>Pie Charts</li>
            <li>Area Charts</li>
            <li>Scatter Plots</li>
          </ul>
          
          <h2>Customization</h2>
          <p>Charty provides extensive customization options for colors, animations, and styling.</p>
        `,
        tags: ["Android", "Kotlin", "Charts", "Jetpack Compose"]
      },
      kalendar: {
        title: "Kalendar Documentation",
        description: "A beautiful calendar component for Android applications",
        githubUrl: "https://github.com/hi-manshu/Kalendar",
        version: "1.5.0",
        content: `
          <h2>Overview</h2>
          <p>Kalendar is a modern calendar component designed for Android applications using Jetpack Compose.</p>
          
          <h2>Installation</h2>
          <pre><code>implementation 'com.himanshoe:kalendar:1.5.0'</code></pre>
          
          <h2>Basic Usage</h2>
          <pre><code>@Composable
fun MyCalendar() {
    Kalendar(
        selectedDate = remember { mutableStateOf(LocalDate.now()) },
        onDateSelected = { date -> 
            // Handle date selection
        }
    )
}</code></pre>
        `,
        tags: ["Android", "Calendar", "Jetpack Compose", "UI"]
      }
    };
    
    return docs[projectName as keyof typeof docs] || null;
  };

  const doc = getDocumentation(project || '');

  if (!doc) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The documentation for "{project}" could not be found.
          </p>
          <Button asChild>
            <a href="/projects">View All Projects</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{doc.title}</h1>
              <p className="text-xl text-muted-foreground">{doc.description}</p>
            </div>
            <Badge variant="outline">v{doc.version}</Badge>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <Button asChild>
              <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
                <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
              </a>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {doc.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>
        
        <Card>
          <CardContent className="pt-6">
            <div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          </CardContent>
        </Card>
        
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <a href="/projects">
                ← Back to Projects
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                Contribute on GitHub
                <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
