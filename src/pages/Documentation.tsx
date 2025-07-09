import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronRight, Github, Heart } from 'lucide-react';
import { useState } from 'react';
import { FadeInView } from '@/components/FadeInView';

interface Section {
  id: string;
  title: string;
  content: string;
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
    version: '2.1.0',
    sections: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: 'Learn how to set up and use Charty in your React application.',
        subsections: [
          {
            id: 'installation',
            title: 'Installation',
            content: 'Install Charty using npm or yarn to get started with beautiful charts.'
          },
          {
            id: 'basic-usage',
            title: 'Basic Usage',
            content: 'Learn the basics of creating your first chart with Charty.'
          }
        ]
      },
      {
        id: 'chart-types',
        title: 'Chart Types',
        content: 'Explore the different types of charts available in Charty.',
        subsections: [
          {
            id: 'line-charts',
            title: 'Line Charts',
            content: 'Create smooth, animated line charts for time series data.'
          },
          {
            id: 'bar-charts',
            title: 'Bar Charts',
            content: 'Display categorical data with horizontal or vertical bars.'
          },
          {
            id: 'pie-charts',
            title: 'Pie Charts',
            content: 'Show proportional data with interactive pie charts.'
          }
        ]
      },
      {
        id: 'customization',
        title: 'Customization',
        content: 'Learn how to customize your charts to match your design system.',
        subsections: [
          {
            id: 'theming',
            title: 'Theming',
            content: 'Apply custom themes and colors to your charts.'
          },
          {
            id: 'animations',
            title: 'Animations',
            content: 'Configure smooth animations and transitions.'
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
}`,
      lineChart: `import { LineChart } from '@yourorg/charty';

const lineData = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 6000, profit: 9800 },
  { month: 'Apr', sales: 8000, profit: 3908 },
];

<LineChart
  data={lineData}
  xDataKey="month"
  lines={[
    { dataKey: 'sales', stroke: '#8884d8' },
    { dataKey: 'profit', stroke: '#82ca9d' }
  ]}
  width={600}
  height={400}
/>`,
      barChart: `import { BarChart } from '@yourorg/charty';

const barData = [
  { name: 'Product A', sales: 4000 },
  { name: 'Product B', sales: 3000 },
  { name: 'Product C', sales: 6000 },
  { name: 'Product D', sales: 8000 },
];

<BarChart
  data={barData}
  xDataKey="name"
  yDataKey="sales"
  fill="#8884d8"
  width={600}
  height={400}
/>`,
      pieChart: `import { PieChart } from '@yourorg/charty';

const pieData = [
  { name: 'Desktop', value: 400, fill: '#8884d8' },
  { name: 'Mobile', value: 300, fill: '#82ca9d' },
  { name: 'Tablet', value: 200, fill: '#ffc658' },
];

<PieChart
  data={pieData}
  dataKey="value"
  nameKey="name"
  width={400}
  height={400}
  showTooltip={true}
/>`
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
        content: 'Kalendar is a feature-rich calendar component for React applications.',
        subsections: [
          {
            id: 'features',
            title: 'Features',
            content: 'Explore the powerful features of Kalendar including event management, multiple views, and more.'
          },
          {
            id: 'setup',
            title: 'Setup',
            content: 'Get started with Kalendar by installing and configuring it in your project.'
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
              className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive(section.id) 
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
                    className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isActive(subsection.id)
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
                    {currentSection?.content}
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

                  {!['installation', 'basic-usage', 'line-charts', 'bar-charts', 'pie-charts'].includes(activeSection) && (
                    <div className="text-md-sys-color-on-surface-variant">
                      <p>Content for {currentSection?.title} will be available soon.</p>
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