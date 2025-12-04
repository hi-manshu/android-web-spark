import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, ChevronDown, ChevronRight, ChevronLeft, Github, Heart, ArrowUp, Search, Home, BookOpen, Hash } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { FadeInView } from '@/components/FadeInView';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface Section {
  id: string;
  title: string;
  content: string; // Now a path to the markdown file
  subsections?: Section[];
}

interface DocData {
  title: string;
  description: string;
  version: string;
  sections: Section[];
  code: {
    installation: string;
    basicUsage: string;
    lineChart?: string;
    barChart?: string;
    pieChart?: string;
  };
}

const docsData: Record<string, DocData> = {
  charty: {
    title: 'Charty',
    description: 'A sleek & lightweight charting library for Jetpack Compose, now with Kotlin & Compose Multiplatform support!',
    version: '3.0.0-beta01',
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: 'charty/getting-started/installation',
        subsections: [
          {
            id: 'installation',
            title: 'Installation',
            content: 'charty/getting-started/installation'
          },
        ]
      },
      {
        id: 'bar-charts',
        title: 'Bar Charts',
        content: 'charty/chart-types/bar-charts',
        subsections: [
          {
            id: 'bar-chart',
            title: 'Bar Chart',
            content: 'charty/chart-types/bar-chart'
          },
          {
            id: 'horizontal-bar-chart',
            title: 'Horizontal Bar Chart',
            content: 'charty/chart-types/horizontal-bar-chart'
          },
          {
            id: 'stacked-bar-chart',
            title: 'Stacked Bar Chart',
            content: 'charty/chart-types/stacked-bar-chart'
          },
          {
            id: 'mosiac-bar-chart',
            title: 'Mosaic Bar Chart',
            content: 'charty/chart-types/mosiac-bar-chart'
          },
          {
            id: 'comparison-bar-chart',
            title: 'Comparison Bar Chart',
            content: 'charty/chart-types/comparison-bar-chart'
          },
          {
            id: 'bubble-bar-chart',
            title: 'Bubble Bar Chart',
            content: 'charty/chart-types/bubble-bar-chart'
          },
          {
            id: 'lollipop-bar-chart',
            title: 'Lollipop Bar Chart',
            content: 'charty/chart-types/lollipop-bar-chart'
          },
          {
            id: 'span-chart',
            title: 'Span Chart',
            content: 'charty/chart-types/span-chart'
          },
          {
            id: 'waterfall-chart',
            title: 'Waterfall Chart',
            content: 'charty/chart-types/waterfall-chart'
          },
          {
            id: 'wavy-chart',
            title: 'Wavy Chart',
            content: 'charty/chart-types/wavy-chart'
          },
          {
            id: 'block-bar-chart',
            title: 'Block Bar Chart',
            content: 'charty/chart-types/block-bar-chart'
          },
          {
            id: 'combo-bar-chart',
            title: 'Combo Bar Chart',
            content: 'charty/chart-types/combo-bar-chart'
          }
        ]
      },
      {
        id: 'line-charts',
        title: 'Line Charts',
        content: 'charty/chart-types/line-charts',
        subsections: [
          {
            id: 'line-chart',
            title: 'Line Chart',
            content: 'charty/chart-types/line-chart'
          },
          {
            id: 'multiline-chart',
            title: 'Multiline Chart',
            content: 'charty/chart-types/multiline-chart'
          },
          {
            id: 'area-chart',
            title: 'Area Chart',
            content: 'charty/chart-types/area-chart'
          },
          {
            id: 'stacked-area-chart',
            title: 'Stacked Area Chart',
            content: 'charty/chart-types/stacked-area-chart'
          }
        ]
      },
      {
        id: 'point-charts',
        title: 'Point & Bubble Charts',
        content: 'charty/chart-types/point-chart',
        subsections: [
          {
            id: 'point-chart',
            title: 'Point Chart',
            content: 'charty/chart-types/point-chart'
          },
          {
            id: 'bubble-chart',
            title: 'Bubble Chart',
            content: 'charty/chart-types/bubble-chart'
          }
        ]
      },
      {
        id: 'radar-charts',
        title: 'Radar Charts',
        content: 'charty/chart-types/radar-chart',
        subsections: [
          {
            id: 'radar-chart',
            title: 'Radar Chart',
            content: 'charty/chart-types/radar-chart'
          },
          {
            id: 'multiple-radar-chart',
            title: 'Multiple Radar Chart',
            content: 'charty/chart-types/multiple-radar-chart'
          }
        ]
      },
      {
        id: 'other-charts',
        title: 'Other Charts',
        content: 'charty/chart-types/pie-charts',
        subsections: [
          {
            id: 'pie-charts',
            title: 'Pie Charts',
            content: 'charty/chart-types/pie-charts'
          },
          {
            id: 'candle-stick-chart',
            title: 'Candlestick Chart',
            content: 'charty/chart-types/candle-stick-chart'
          }
        ]
      },
      {
        id: 'configurations',
        title: 'Configurations',
        content: 'charty/configurations/chart-scaffold-config',
        subsections: [
          {
            id: 'chart-scaffold-config',
            title: 'ChartScaffoldConfig',
            content: 'charty/configurations/chart-scaffold-config'
          },
          {
            id: 'bar-chart-config',
            title: 'BarChartConfig',
            content: 'charty/configurations/bar-chart-config'
          },
          {
            id: 'line-chart-config',
            title: 'LineChartConfig',
            content: 'charty/configurations/line-chart-config'
          },
          {
            id: 'pie-chart-config',
            title: 'PieChartConfig',
            content: 'charty/configurations/pie-chart-config'
          },
          {
            id: 'radar-chart-config',
            title: 'RadarChartConfig',
            content: 'charty/configurations/radar-chart-config'
          },
          {
            id: 'multiple-radar-chart-config',
            title: 'MultipleRadarChartConfig',
            content: 'charty/configurations/multiple-radar-chart-config'
          },
          {
            id: 'point-chart-config',
            title: 'PointChartConfig',
            content: 'charty/configurations/point-chart-config'
          },
          {
            id: 'candlestick-chart-config',
            title: 'CandlestickChartConfig',
            content: 'charty/configurations/candlestick-chart-config'
          },
          {
            id: 'combo-chart-config',
            title: 'ComboChartConfig',
            content: 'charty/configurations/combo-chart-config'
          },
          {
            id: 'stacked-bar-chart-config',
            title: 'StackedBarChartConfig',
            content: 'charty/configurations/stacked-bar-chart-config'
          },
          {
            id: 'comparison-bar-chart-config',
            title: 'ComparisonBarChartConfig',
            content: 'charty/configurations/comparison-bar-chart-config'
          },
          {
            id: 'bubble-bar-chart-config',
            title: 'BubbleBarChartConfig',
            content: 'charty/configurations/bubble-bar-chart-config'
          },
          {
            id: 'lollipop-bar-chart-config',
            title: 'LollipopBarChartConfig',
            content: 'charty/configurations/lollipop-bar-chart-config'
          },
          {
            id: 'mosiac-bar-chart-config',
            title: 'MosiacBarChartConfig',
            content: 'charty/configurations/mosiac-bar-chart-config'
          },
          {
            id: 'waterfall-chart-config',
            title: 'WaterfallChartConfig',
            content: 'charty/configurations/waterfall-chart-config'
          },
          {
            id: 'wavy-chart-config',
            title: 'WavyChartConfig',
            content: 'charty/configurations/wavy-chart-config'
          },
          {
            id: 'block-bar-chart-config',
            title: 'BlockBarChartConfig',
            content: 'charty/configurations/block-bar-chart-config'
          },
          {
            id: 'reference-line-config',
            title: 'ReferenceLineConfig',
            content: 'charty/configurations/reference-line-config'
          }
        ]
      }
    ],
    code: {
      installation: `npm install @yourorg/charty
# or
yarn add @yourorg/charty`,
      basicUsage: `import { LineChart } from '@yourorg/charty';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
];

function App() {
  return (
    <LineChart 
      data={data} 
      width={400} 
      height={300}
      animate={true}
    />
  );
}`
    }
  },
  kalendar: {
    title: 'Kalendar',
    description: 'Modern calendar component with event management',
    version: '1.5.2',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        content: 'kalendar/overview/features', // Placeholder
        subsections: [
          {
            id: 'features',
            title: 'Features',
            content: 'kalendar/overview/features'
          },
          {
            id: 'setup',
            title: 'Setup',
            content: 'kalendar/overview/setup'
          }
        ]
      }
    ],
    code: {
      installation: `npm install @yourorg/kalendar
# or
yarn add @yourorg/kalendar`,
      basicUsage: `import { Calendar } from '@yourorg/kalendar';

function App() {
  return (
    <Calendar
      events={events}
      onEventClick={handleEventClick}
      onDateSelect={handleDateSelect}
    />
  );
}`
    }
  }
};

// Reading Progress Bar
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
      <div 
        className="h-full bg-foreground transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Scroll to Top Button
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-20 right-6 z-50 h-10 w-10 rounded-full shadow-lg animate-fade-in"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}

// Breadcrumbs
function Breadcrumbs({ project, currentSection }: { project: string; currentSection: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link to="/docs" className="hover:text-foreground transition-colors flex items-center gap-1">
        <BookOpen className="h-3.5 w-3.5" />
        Docs
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="capitalize">{project}</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-foreground font-medium truncate max-w-[150px]">{currentSection}</span>
    </nav>
  );
}

// Copy Code Button for Markdown
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={copyToClipboard}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-md-sys-color-surface-variant p-4 rounded-lg overflow-x-auto text-sm border border-md-sys-color-outline-variant">
        <code className="text-md-sys-color-on-surface-variant">{code}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}

function TableOfContents({
  sections,
  activeSection,
  onSectionClick
}: {
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (sectionId: string) => activeSection === sectionId;

  // Filter sections based on search query
  const filterSections = (sections: Section[]): Section[] => {
    if (!searchQuery.trim()) return sections;
    
    return sections.reduce<Section[]>((acc, section) => {
      const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredSubsections = section.subsections ? filterSections(section.subsections) : [];
      
      if (matchesSearch || filteredSubsections.length > 0) {
        acc.push({
          ...section,
          subsections: filteredSubsections.length > 0 ? filteredSubsections : section.subsections
        });
      }
      return acc;
    }, []);
  };

  const filteredSections = filterSections(sections);

  // Auto-expand sections when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const allSectionIds = new Set(sections.map(s => s.id));
      setExpandedSections(allSectionIds);
    }
  }, [searchQuery, sections]);

  return (
    <div className="bg-md-sys-color-surface border border-md-sys-color-outline-variant rounded-lg p-4 md-elevation-1 flex flex-col max-h-[calc(100vh-8rem)]">
      <h3 className="md-typescale-title-large text-md-sys-color-on-surface mb-3 font-medium flex-shrink-0">
        Table of Contents
      </h3>

      {/* Search Input */}
      <div className="relative mb-3 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search docs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      <nav className="space-y-1 overflow-y-auto flex-1">
        {filteredSections.length === 0 ? (
          <p className="text-sm text-muted-foreground px-3 py-2">No results found</p>
        ) : (
          filteredSections.map((section) => (
            <div key={section.id}>
              <div
                className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive(section.id)
                  ? 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container'
                  : 'text-md-sys-color-on-surface hover:bg-md-sys-color-surface-variant'
                  }`}
                onClick={() => {
                  if (section.subsections && section.subsections.length > 0) {
                    toggleSection(section.id);
                  } else {
                    onSectionClick(section.id);
                  }
                }}
              >
                {section.subsections && section.subsections.length > 0 && (
                  expandedSections.has(section.id) ?
                    <ChevronDown className="h-4 w-4 flex-shrink-0" /> :
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="md-typescale-body-large font-medium truncate">
                  {section.title}
                </span>
              </div>

              {section.subsections && expandedSections.has(section.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.subsections.map((subsection) => (
                    <div
                      key={subsection.id}
                      className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive(subsection.id)
                        ? 'bg-md-sys-color-secondary-container text-md-sys-color-on-secondary-container'
                        : 'text-md-sys-color-on-surface-variant hover:bg-md-sys-color-surface-variant'
                        }`}
                      onClick={() => onSectionClick(subsection.id)}
                    >
                      <span className="text-sm truncate">
                        {subsection.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </nav>
    </div>
  );
}

// Load all markdown files
const modules = import.meta.glob('/src/content/docs/**/*.md', { as: 'raw', eager: true });

export default function Documentation() {
  const { project } = useParams<{ project: string }>();
  const [activeSection, setActiveSection] = useState('installation');
  const [isAtBottom, setIsAtBottom] = useState(false);

  const doc = project ? docsData[project] : null;

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setIsAtBottom(scrollTop + windowHeight >= docHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!doc) {
    return (
      <div className="min-h-screen bg-md-sys-color-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="md-typescale-display-small text-md-sys-color-on-background mb-4">
            Documentation Not Found
          </h1>
          <p className="text-md-sys-color-on-surface-variant">
            The documentation for "{project}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Flatten all sections into a single array for navigation
  const flattenSections = (sections: Section[]): Section[] => {
    const result: Section[] = [];
    for (const section of sections) {
      if (section.subsections && section.subsections.length > 0) {
        result.push(...flattenSections(section.subsections));
      } else {
        result.push(section);
      }
    }
    return result;
  };

  const allSections = flattenSections(doc.sections);
  const currentIndex = allSections.findIndex(s => s.id === activeSection);
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const findSectionById = (sections: Section[], id: string): Section | null => {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.subsections) {
        const found = findSectionById(section.subsections, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentSection = findSectionById(doc.sections, activeSection);

  // Helper to get content from modules
  const getContent = (path: string | undefined) => {
    if (!path) return '';
    const fullPath = `/src/content/docs/${path}.md`;
    return modules[fullPath] || 'Content not found';
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      <ReadingProgressBar />
      <ScrollToTopButton />
      
      <div className="container mx-auto px-6 py-8">
        <FadeInView>
          {/* Breadcrumbs */}
          <Breadcrumbs project={project || ''} currentSection={currentSection?.title || ''} />
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="md-typescale-display-small text-md-sys-color-on-background">
                  {doc.title}
                </h1>
                <Badge className="bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container">
                  v{doc.version}
                </Badge>
              </div>

              {/* GitHub and Sponsor Links */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/hi-manshu/Charty" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/sponsors/hi-manshu" target="_blank" rel="noopener noreferrer">
                    <Heart className="h-4 w-4 mr-2" />
                    Sponsor
                  </a>
                </Button>
              </div>
            </div>
            <p className="md-typescale-body-large text-md-sys-color-on-surface-variant">
              {doc.description}
            </p>
          </div>
        </FadeInView>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents
                sections={doc.sections}
                activeSection={activeSection}
                onSectionClick={setActiveSection}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <FadeInView key={activeSection}>
              <Card className="bg-md-sys-color-surface border-md-sys-color-outline-variant md-elevation-1">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="md-typescale-headline-medium text-md-sys-color-on-surface">
                      {currentSection?.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="md-typescale-body-large text-md-sys-color-on-surface-variant">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => {
                            const href = props.href;
                            if (href && href.startsWith('#')) {
                              const sectionId = href.substring(1);
                              return (
                                <a
                                  {...props}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveSection(sectionId);
                                  }}
                                  className="text-md-sys-color-primary hover:underline cursor-pointer"
                                />
                              );
                            }
                            return <a {...props} className="text-md-sys-color-primary hover:underline" target="_blank" rel="noopener noreferrer" />;
                          },
                          pre: ({ node, children, ...props }) => {
                            const codeElement = (children as any)?.[0];
                            const codeContent = codeElement?.props?.children || '';
                            return (
                              <div className="relative group">
                                <pre {...props} className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border">
                                  {children}
                                </pre>
                                <CopyCodeButton code={String(codeContent)} />
                              </div>
                            );
                          },
                          code: ({ node, className, children, ...props }) => {
                            const isInline = !className;
                            if (isInline) {
                              return (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            }
                            return <code className={className} {...props}>{children}</code>;
                          },
                          h2: ({ children }) => (
                            <h2 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-2 border-b pb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-medium mt-4 mb-2">
                              {children}
                            </h3>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                              <table className="w-full border-collapse border border-border rounded-lg">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="border border-border px-4 py-2">
                              {children}
                            </td>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-foreground/20 pl-4 italic my-4 text-muted-foreground">
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 my-4">
                              {children}
                            </ol>
                          )
                        }}
                      >
                        {getContent(currentSection?.content)}
                      </ReactMarkdown>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                </CardContent>
              </Card>
            </FadeInView>

            {/* Navigation Buttons */}
            <div className={`flex justify-between items-center gap-4 mt-6 py-4 ${isAtBottom ? '' : 'lg:fixed lg:bottom-6 lg:right-6 lg:left-auto lg:w-auto lg:bg-md-sys-color-surface lg:border lg:border-md-sys-color-outline-variant lg:rounded-lg lg:px-4 lg:shadow-lg lg:z-50'}`}>
              {prevSection ? (
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(prevSection.id)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{prevSection.title}</span>
                  <span className="sm:hidden">Previous</span>
                </Button>
              ) : (
                <div />
              )}
              {nextSection && (
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(nextSection.id)}
                  className="flex items-center gap-2"
                >
                  <span className="hidden sm:inline">{nextSection.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}