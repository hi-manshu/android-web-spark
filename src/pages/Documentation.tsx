import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronRight, Github, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    description: 'Beautiful React chart components with Material Design',
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

function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-md-sys-color-surface-variant p-4 rounded-lg overflow-x-auto text-sm border border-md-sys-color-outline-variant">
        <code className="text-md-sys-color-on-surface-variant">{code}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0"
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

  return (
    <div className="bg-md-sys-color-surface border border-md-sys-color-outline-variant rounded-lg p-4 md-elevation-1">
      <h3 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
        Table of Contents
      </h3>

      <nav className="space-y-1">
        {sections.map((section) => (
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
        ))}
      </nav>
    </div>
  );
}

// Load all markdown files
const modules = import.meta.glob('/src/content/docs/**/*.md', { as: 'raw', eager: true });

export default function Documentation() {
  const { project } = useParams<{ project: string }>();
  const [activeSection, setActiveSection] = useState('installation');

  const doc = project ? docsData[project] : null;

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

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      <div className="container mx-auto px-6 py-8">
        <FadeInView>
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
                  <CardTitle className="md-typescale-headline-medium text-md-sys-color-on-surface">
                    {currentSection?.title}
                  </CardTitle>
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
                          }
                        }}
                      >
                        {getContent(currentSection?.content)}
                      </ReactMarkdown>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {activeSection === 'installation' && (
                    <div>
                      <h4 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
                        Installation
                      </h4>
                      <CodeBlock code={doc.code.installation} id="installation" />
                    </div>
                  )}

                  {activeSection === 'basic-usage' && (
                    <div>
                      <h4 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
                        Basic Usage
                      </h4>
                      <CodeBlock code={doc.code.basicUsage} id="basic-usage" />
                    </div>
                  )}

                  {activeSection === 'line-charts' && 'lineChart' in doc.code && (
                    <div>
                      <h4 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
                        Line Chart Example
                      </h4>
                      <CodeBlock code={doc.code.lineChart as string} id="line-chart" />
                    </div>
                  )}

                  {activeSection === 'bar-charts' && 'barChart' in doc.code && (
                    <div>
                      <h4 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
                        Bar Chart Example
                      </h4>
                      <CodeBlock code={doc.code.barChart as string} id="bar-chart" />
                    </div>
                  )}

                  {activeSection === 'pie-charts' && 'pieChart' in doc.code && (
                    <div>
                      <h4 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
                        Pie Chart Example
                      </h4>
                      <CodeBlock code={doc.code.pieChart as string} id="pie-chart" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </div>
    </div>
  );
}