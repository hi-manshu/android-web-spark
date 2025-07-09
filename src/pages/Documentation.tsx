import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronRight, Github, Heart } from 'lucide-react';
import { FadeInView } from '@/components/FadeInView';
import { remark } from 'remark';
import html from 'remark-html';
import documentationData from '@/content/documentationData.json'; // Import the JSON data

// Define types for the documentation structure
interface DocItem {
  title: string;
  path: string; // Path to the markdown file
  id: string; // Unique ID for the section, can be derived from title or path
  htmlContent?: string; // Parsed HTML content
  subsections?: DocItem[]; // For nested structure if needed in future
}

interface ProcessedDocData {
  title: string; // Overall title for this documentation set (e.g., "Project Alpha Docs")
  description: string;
  version: string;
  sections: DocItem[];
}

// Utility to generate a simple ID from a title
const generateId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4">
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
  activeSectionId,
  onSectionClick
}: {
  sections: DocItem[];
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
}) {
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
                activeSectionId === section.id
                  ? 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container'
                  : 'text-md-sys-color-on-surface hover:bg-md-sys-color-surface-variant'
              }`}
              onClick={() => onSectionClick(section.id)}
            >
              <span className="md-typescale-body-large font-medium truncate">
                {section.title}
              </span>
            </div>
            {/* Placeholder for subsections if needed */}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function Documentation() {
  const { project } = useParams<{ project?: string }>(); // project can be undefined
  const [processedDocs, setProcessedDocs] = useState<ProcessedDocData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocumentation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // For now, we'll assume 'project' parameter might select different JSON files or structures in future.
        // Currently, we only have one documentationData.json.
        // Let's simulate a "default" project or the first one if no project param is given.
        const currentProjectKey = project || "default"; // Or however you want to map `project` to your data

        // This is where you might fetch a different JSON if you had multiple doc sets
        // For this task, documentationData is imported directly.

        const sectionsWithIds = documentationData.map(doc => ({
          ...doc,
          id: generateId(doc.title),
        }));

        const sectionsWithContent: DocItem[] = await Promise.all(
          sectionsWithIds.map(async (section) => {
            try {
              // Vite specific way to load raw file content
              // Path is now relative to src/content/docs/
              const rawContent = await import(/* @vite-ignore */ `../content/docs/${section.path}?raw`)
              const parsedHtml = await remark().use(html).process(rawContent.default);
              return { ...section, htmlContent: String(parsedHtml) };
            } catch (e) {
              console.error(`Failed to load or parse markdown for ${section.path}:`, e);
              return { ...section, htmlContent: `<p>Error loading content for ${section.title}.</p>` };
            }
          })
        );

        // Simulate a main doc structure. In a real scenario, this might also come from JSON.
        const mainDocData: ProcessedDocData = {
            title: project ? `${project.charAt(0).toUpperCase() + project.slice(1)} Docs` : "Documentation",
            description: "Browse through the documentation sections.",
            version: "1.0.0", // This could also be dynamic
            sections: sectionsWithContent,
        };

        setProcessedDocs(mainDocData);
        if (mainDocData.sections.length > 0) {
          setActiveSectionId(mainDocData.sections[0].id);
        }
      } catch (e) {
        console.error("Failed to load documentation data:", e);
        setError("Failed to load documentation.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentation();
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-md-sys-color-background flex items-center justify-center">
        <p className="text-md-sys-color-on-surface">Loading documentation...</p>
      </div>
    );
  }

  if (error || !processedDocs) {
    return (
      <div className="min-h-screen bg-md-sys-color-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="md-typescale-display-small text-md-sys-color-on-background mb-4">
            Documentation Error
          </h1>
          <p className="text-md-sys-color-on-surface-variant">
            {error || `The documentation for "${project || 'this project'}" could not be loaded.`}
          </p>
        </div>
      </div>
    );
  }

  const currentSection = processedDocs.sections.find(sec => sec.id === activeSectionId);

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      <div className="container mx-auto px-6 py-8">
        <FadeInView>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="md-typescale-display-small text-md-sys-color-on-background">
                  {processedDocs.title}
                </h1>
                <Badge className="bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container">
                  v{processedDocs.version}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://github.com/hi-manshu/android-web-spark" target="_blank" rel="noopener noreferrer">
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
              {processedDocs.description}
            </p>
          </div>
        </FadeInView>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents
                sections={processedDocs.sections}
                activeSectionId={activeSectionId}
                onSectionClick={setActiveSectionId}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentSection ? (
              <FadeInView key={currentSection.id}>
                <Card className="bg-md-sys-color-surface border-md-sys-color-outline-variant md-elevation-1">
                  <CardHeader>
                    <CardTitle className="md-typescale-headline-medium text-md-sys-color-on-surface">
                      {currentSection.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Render parsed HTML. Ensure prose styles are applied if not default */}
                    <div
                        className="prose dark:prose-invert max-w-none" // Apply prose for markdown styling
                        dangerouslySetInnerHTML={{ __html: currentSection.htmlContent || "" }}
                    />
                    {/* Example of how you might conditionally render CodeBlock if markdown contains specific syntax */}
                    {/* This part would require more sophisticated parsing or conventions in your .md files */}
                    {/* For instance, if a section path implies it's about code:
                    {currentSection.path.includes("installation.md") && (
                        <CodeBlock code={"extracted_code_for_installation"} id={`${currentSection.id}-code`} />
                    )}
                    */}
                  </CardContent>
                </Card>
              </FadeInView>
            ) : (
              <p className="text-md-sys-color-on-surface-variant">Select a section to view its content.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}