import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, ArrowUp, BookOpen, Download, Star, GitFork, Eye, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Documentation() {
  const { project } = useParams();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'installation', 'charts', 'customization'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Set initial active section from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock documentation data - in real implementation, this would load from markdown files
  const getDocumentation = (projectName: string) => {
    const docs = {
      charty: {
        title: "Charty",
        subtitle: "Beautiful Charts for Android",
        description: "A comprehensive Android chart library for creating beautiful, interactive charts with Jetpack Compose",
        githubUrl: "https://github.com/hi-manshu/Charty",
        version: "2.0.0",
        stats: {
          stars: "1.2k",
          forks: "180",
          watchers: "45"
        },
        quickStart: {
          installation: "implementation 'com.himanshoe:charty:2.0.0'",
          basicUsage: `@Composable
fun MyChart() {
    LineChart(
        data = listOf(
            ChartData(1f, 10f),
            ChartData(2f, 15f),
            ChartData(3f, 8f)
        ),
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp)
    )
}`
        },
        features: [
          {
            title: "Multiple Chart Types",
            description: "Support for Line, Bar, Pie, Area, and Scatter charts",
            code: `LineChart(data = lineData)
BarChart(data = barData)
PieChart(data = pieData)`
          },
          {
            title: "Jetpack Compose Native",
            description: "Built specifically for Jetpack Compose with modern APIs",
            code: `@Composable
fun ChartExample() {
    LineChart(
        data = chartData,
        modifier = Modifier.fillMaxSize()
    )
}`
          },
          {
            title: "Customizable Styling",
            description: "Extensive customization options for colors, animations, and styling",
            code: `LineChart(
    data = data,
    chartStyle = ChartStyle(
        primaryColor = Color.Blue,
        backgroundColor = Color.White,
        gridColor = Color.Gray
    )
)`
          }
        ],
        sections: [
          {
            id: "overview",
            title: "Overview",
            content: "Charty is a comprehensive Android chart library that provides beautiful, interactive charts for your Android applications. Built with Jetpack Compose, it offers a modern approach to data visualization with smooth animations and extensive customization options."
          },
          {
            id: "installation",
            title: "Installation",
            content: "Add Charty to your Android project by including the dependency in your app's build.gradle file."
          },
          {
            id: "charts",
            title: "Chart Types",
            content: "Charty supports multiple chart types to visualize your data effectively."
          },
          {
            id: "customization",
            title: "Customization",
            content: "Customize your charts with various styling options, colors, and animations."
          }
        ],
        tags: ["Android", "Kotlin", "Charts", "Jetpack Compose", "UI"]
      },
      kalendar: {
        title: "Kalendar",
        subtitle: "Modern Calendar Component",
        description: "A beautiful calendar component for Android applications built with Jetpack Compose",
        githubUrl: "https://github.com/hi-manshu/Kalendar",
        version: "1.5.0",
        stats: {
          stars: "850",
          forks: "120",
          watchers: "32"
        },
        quickStart: {
          installation: "implementation 'com.himanshoe:kalendar:1.5.0'",
          basicUsage: `@Composable
fun MyCalendar() {
    Kalendar(
        selectedDate = remember { 
            mutableStateOf(LocalDate.now()) 
        },
        onDateSelected = { date -> 
            // Handle date selection
        }
    )
}`
        },
        features: [
          {
            title: "Date Selection",
            description: "Easy date selection with customizable callbacks",
            code: `Kalendar(
    onDateSelected = { date ->
        println("Selected: $date")
    }
)`
          },
          {
            title: "Custom Styling",
            description: "Fully customizable appearance and theming",
            code: `Kalendar(
    calendarStyle = CalendarStyle(
        selectedDateColor = Color.Blue,
        todayColor = Color.Red
    )
)`
          }
        ],
        sections: [
          {
            id: "overview",
            title: "Overview",
            content: "Kalendar is a modern calendar component designed for Android applications using Jetpack Compose. It provides an intuitive interface for date selection and calendar navigation."
          },
          {
            id: "installation", 
            title: "Installation",
            content: "Add Kalendar to your Android project with a simple dependency addition."
          },
          {
            id: "usage",
            title: "Basic Usage",
            content: "Get started with Kalendar in just a few lines of code."
          }
        ],
        tags: ["Android", "Calendar", "Jetpack Compose", "UI", "Date Picker"]
      }
    };
    
    return docs[projectName as keyof typeof docs] || null;
  };

  const doc = getDocumentation(project || '');

  if (!doc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The documentation for "{project}" could not be found.
            </p>
            <Button asChild size="lg">
              <a href="/projects">View All Projects</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const CodeBlock = ({ code, language = "kotlin", id }: { code: string; language?: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm border">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white">
        <div className="container py-16">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8" />
              <Badge variant="outline" className="border-slate-400 text-slate-200">
                v{doc.version}
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight mb-4">{doc.title}</h1>
            <p className="text-xl text-slate-300 mb-2">{doc.subtitle}</p>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl">{doc.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button asChild size="lg">
                <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                  <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                </a>
              </Button>
              
              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{doc.stats.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="h-4 w-4" />
                  <span>{doc.stats.forks}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{doc.stats.watchers}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-200 border-slate-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Installation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add the following dependency to your app's build.gradle file:
                  </p>
                  <CodeBlock code={doc.quickStart.installation} language="gradle" id="installation" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Basic Usage</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started with a simple example:
                  </p>
                  <CodeBlock code={doc.quickStart.basicUsage} id="basic-usage" />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Key Features</h2>
              <div className="space-y-6">
                {doc.features.map((feature, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={feature.code} id={`feature-${index}`} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {doc.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block text-sm py-1 px-3 rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {doc.sections.map((section, index) => (
                  <div key={section.id} id={section.id} className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {section.content}
                    </p>
                    {index < doc.sections.length - 1 && <Separator className="mt-8" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-12 border-t">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <a href="/projects">
                ← Back to Projects
              </a>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                  View Source
                  <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href={`${doc.githubUrl}/issues`} target="_blank" rel="noopener noreferrer">
                  Report Issue
                  <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
