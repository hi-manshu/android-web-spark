
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, ArrowUp, BookOpen, Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FadeInView } from '@/components/FadeInView';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Documentation() {
  const { project } = useParams();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['installation', 'charts', 'customization']));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'installation', 'basic-usage', 'charts', 'line-charts', 'bar-charts', 'pie-charts', 'customization', 'styling', 'animations', 'examples'];
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

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock documentation data
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
        sections: [
          {
            id: "overview",
            title: "Overview",
            level: 1,
            content: "Charty is a comprehensive Android chart library that provides beautiful, interactive charts for your Android applications. Built with Jetpack Compose, it offers a modern approach to data visualization with smooth animations and extensive customization options."
          },
          {
            id: "installation",
            title: "Installation",
            level: 1,
            content: "Add Charty to your Android project by including the dependency in your app's build.gradle file."
          },
          {
            id: "basic-usage",
            title: "Basic Usage",
            level: 2,
            parent: "installation",
            content: "Get started with Charty in just a few lines of code. Here's how to create your first chart."
          },
          {
            id: "charts",
            title: "Chart Types",
            level: 1,
            content: "Charty supports multiple chart types to visualize your data effectively."
          },
          {
            id: "line-charts",
            title: "Line Charts",
            level: 2,
            parent: "charts",
            content: "Line charts are perfect for showing trends over time or continuous data."
          },
          {
            id: "bar-charts",
            title: "Bar Charts",
            level: 2,
            parent: "charts",
            content: "Bar charts are ideal for comparing different categories of data."
          },
          {
            id: "pie-charts",
            title: "Pie Charts",
            level: 2,
            parent: "charts",
            content: "Pie charts show proportions and percentages of a whole dataset."
          },
          {
            id: "customization",
            title: "Customization",
            level: 1,
            content: "Customize your charts with various styling options, colors, and animations."
          },
          {
            id: "styling",
            title: "Styling Options",
            level: 2,
            parent: "customization",
            content: "Learn how to style your charts with colors, fonts, and layout options."
          },
          {
            id: "animations",
            title: "Animations",
            level: 2,
            parent: "customization",
            content: "Add smooth animations to make your charts more engaging and interactive."
          },
          {
            id: "examples",
            title: "Examples",
            level: 1,
            content: "Real-world examples and use cases for different chart types."
          }
        ],
        code: {
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
}`,
          lineChart: `LineChart(
    data = lineData,
    modifier = Modifier
        .fillMaxWidth()
        .height(300.dp),
    chartStyle = ChartStyle(
        primaryColor = Color.Blue
    )
)`,
          barChart: `BarChart(
    data = barData,
    modifier = Modifier.fillMaxSize(),
    chartStyle = ChartStyle(
        primaryColor = Color.Green
    )
)`,
          pieChart: `PieChart(
    data = pieData,
    modifier = Modifier.size(300.dp),
    showLabels = true
)`
        },
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
        sections: [
          {
            id: "overview",
            title: "Overview",
            level: 1,
            content: "Kalendar is a modern calendar component designed for Android applications using Jetpack Compose. It provides an intuitive interface for date selection and calendar navigation."
          },
          {
            id: "installation", 
            title: "Installation",
            level: 1,
            content: "Add Kalendar to your Android project with a simple dependency addition."
          },
          {
            id: "basic-usage",
            title: "Basic Usage",
            level: 2,
            parent: "installation",
            content: "Get started with Kalendar in just a few lines of code."
          }
        ],
        code: {
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
              <a href="/docs">View All Documentation</a>
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

  const renderTocItem = (section: any, isNested = false) => {
    const isActive = activeSection === section.id;
    const hasChildren = doc.sections.some(s => s.parent === section.id);
    const isOpen = openSections.has(section.id);
    
    return (
      <div key={section.id}>
        {hasChildren ? (
          <Collapsible open={isOpen} onOpenChange={() => toggleSection(section.id)}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center text-sm py-3 px-4 rounded-lg transition-all group text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                } ${isNested ? 'ml-4 pl-6 border-l-2 border-border' : ''}`}
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 mr-2 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2 transition-transform" />
                )}
                <span className={`${isNested ? 'text-sm' : 'font-medium'}`}>{section.title}</span>
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="ml-4">
              {doc.sections
                .filter(s => s.parent === section.id)
                .map(childSection => (
                  <button
                    key={childSection.id}
                    onClick={() => scrollToSection(childSection.id)}
                    className={`w-full flex items-center text-sm py-2 px-4 rounded-lg transition-all group text-left ml-4 pl-6 border-l-2 border-border ${
                      activeSection === childSection.id
                        ? 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border border-primary/20 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-sm">{childSection.title}</span>
                  </button>
                ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <button
            onClick={() => scrollToSection(section.id)}
            className={`w-full flex items-center text-sm py-3 px-4 rounded-lg transition-all group text-left ${
              isActive
                ? 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border border-primary/20 shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            } ${isNested ? 'ml-4 pl-6 border-l-2 border-border' : ''}`}
          >
            <span className={`${isNested ? 'text-sm' : 'font-medium'}`}>{section.title}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      {/* Hero Section - matching home page style */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5" />
        <div className="container relative">
          <FadeInView>
            <div className="max-w-4xl">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
                <Badge variant="outline" className="text-lg px-4 py-2">
                  v{doc.version}
                </Badge>
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                {doc.title}
              </h1>
              <p className="text-2xl text-muted-foreground mb-2">{doc.subtitle}</p>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">{doc.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    <ArrowUp className="ml-2 h-3 w-3 rotate-45" />
                  </a>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Main Content - matching home page layout */}
      <section className="py-24 bg-gradient-to-br from-slate-50/30 via-white to-gray-50/30 dark:from-slate-900/30 dark:via-background dark:to-gray-900/30">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Enhanced Table of Contents - Fixed position */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2 max-h-[70vh] overflow-y-auto">
                    {doc.sections
                      .filter(section => section.level === 1)
                      .map(section => renderTocItem(section))}
                  </nav>
                </Card>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <FadeInView>
                <div className="space-y-16">
                  {doc.sections.map((section, index) => (
                    <div key={section.id} id={section.id} className="scroll-mt-8">
                      <div className={`${section.level === 1 ? 'mb-8' : 'mb-6'}`}>
                        {section.level === 1 ? (
                          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {section.title}
                          </h2>
                        ) : (
                          <h3 className="text-2xl font-semibold mb-4 text-primary">
                            {section.title}
                          </h3>
                        )}
                      </div>
                      
                      <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {section.content}
                        </p>
                      </div>

                      {/* Code examples for specific sections */}
                      {section.id === 'installation' && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Gradle Dependency</h4>
                          <CodeBlock code={doc.code.installation} language="gradle" id="installation" />
                        </div>
                      )}

                      {section.id === 'basic-usage' && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Basic Example</h4>
                          <CodeBlock code={doc.code.basicUsage} id="basic-usage" />
                        </div>
                      )}

                      {section.id === 'line-charts' && doc.code.lineChart && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Line Chart Example</h4>
                          <CodeBlock code={doc.code.lineChart} id="line-chart" />
                        </div>
                      )}

                      {section.id === 'bar-charts' && doc.code.barChart && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Bar Chart Example</h4>
                          <CodeBlock code={doc.code.barChart} id="bar-chart" />
                        </div>
                      )}

                      {section.id === 'pie-charts' && doc.code.pieChart && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-3">Pie Chart Example</h4>
                          <CodeBlock code={doc.code.pieChart} id="pie-chart" />
                        </div>
                      )}

                      {index < doc.sections.length - 1 && section.level === 1 && (
                        <Separator className="mt-12" />
                      )}
                    </div>
                  ))}
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="py-12 border-t bg-gradient-to-br from-slate-50/50 via-white to-gray-50/50 dark:from-slate-900/50 dark:via-background dark:to-gray-900/50">
        <div className="container">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild size="lg">
              <a href="/docs">
                ← Back to Documentation
              </a>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild size="lg">
                <a href={doc.githubUrl} target="_blank" rel="noopener noreferrer">
                  View Source
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
