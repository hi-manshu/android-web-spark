import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronRight, Github, Heart, FolderOpen, FileText } from 'lucide-react';
import { FadeInView } from '@/components/FadeInView';
import { remark } from 'remark';
import html from 'remark-html';

// Define types for the documentation structure
interface DocSection {
  title: string;
  path?: string; // Path to the markdown file, relative to project dir. Undefined for parent-only sections.
  id: string;    // Unique ID for the section
  htmlContent?: string; // Parsed HTML content
  children?: DocSection[]; // For nested structure
}

interface ProjectIndex {
  projectTitle: string;
  projectDescription: string;
  projectVersion: string;
  sections: DocSection[];
}

// Utility to generate a simple ID from a title, ensuring uniqueness for parents/children
const generateId = (title: string, parentId?: string): string => {
  const baseId = title.toLowerCase().replace(/\s+/g, '-');
  return parentId ? `${parentId}-${baseId}` : baseId;
};

// Function to recursively process sections from index.json, generate IDs, and load content
const processSections = async (
  sections: any[], // Sections from index.json
  project: string,  // Current project name (e.g., "charty")
  // version parameter removed
  parentId?: string
): Promise<DocSection[]> => {
  return Promise.all(
    sections.map(async (sectionData) => {
      const currentId = generateId(sectionData.title, parentId);
      let htmlContent: string | undefined = undefined;

      if (sectionData.path) {
        try {
          // Path is relative to project's doc folder (no version) e.g. src/content/docs/charty/
          const rawContentModule = await import(
            /* @vite-ignore */ `../content/docs/${project}/${sectionData.path}?raw` // version removed from path
          );
          const parsedHtml = await remark().use(html).process(rawContentModule.default);
          htmlContent = String(parsedHtml);
        } catch (e) {
          console.error(`Failed to load or parse markdown for ${project}/${sectionData.path}:`, e); // version removed from log
          htmlContent = `<p>Error loading content for ${sectionData.title}. Details: ${e}</p>`;
        }
      }

      let children: DocSection[] | undefined = undefined;
      if (sectionData.children && sectionData.children.length > 0) {
        children = await processSections(sectionData.children, project, currentId); // version not passed recursively
      }

      return {
        ...sectionData,
        id: currentId,
        htmlContent,
        children,
      };
    })
  );
};


function CodeBlock({ code }: { code: string; }) {
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

interface TocSectionProps {
  section: DocSection;
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
  expandedSections: Set<string>;
  toggleSectionExpansion: (sectionId: string) => void;
  level: number;
}

function TocSection({
  section,
  activeSectionId,
  onSectionClick,
  expandedSections,
  toggleSectionExpansion,
  level,
}: TocSectionProps) {
  const isExpandable = section.children && section.children.length > 0;
  const isExpanded = expandedSections.has(section.id);
  const isActive = activeSectionId === section.id;

  const handleSectionClick = () => {
    if (isExpandable) {
      toggleSectionExpansion(section.id);
    }
    // Allow clicking on parent sections even if they are just for toggling
    // if (section.path) { // Only navigate if it has content
      onSectionClick(section.id);
    // }
  };

  const Icon = isExpandable ? (isExpanded ? FolderOpen : FolderOpen) : FileText;


  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-${2 + level * 2} rounded-lg cursor-pointer transition-all duration-200 ${
          isActive
            ? 'bg-md-sys-color-primary-container text-md-sys-color-on-primary-container'
            : 'text-md-sys-color-on-surface hover:bg-md-sys-color-surface-variant'
        }`}
        onClick={handleSectionClick}
        style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
      >
        {isExpandable && (
          isExpanded ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
        {!isExpandable && <Icon className="h-4 w-4 flex-shrink-0 mr-1 opacity-50" />}
        <span className="md-typescale-body-large font-medium truncate">
          {section.title}
        </span>
      </div>
      {isExpandable && isExpanded && section.children && (
        <div className="mt-1 space-y-1">
          {section.children.map((child) => (
            <TocSection
              key={child.id}
              section={child}
              activeSectionId={activeSectionId}
              onSectionClick={onSectionClick}
              expandedSections={expandedSections}
              toggleSectionExpansion={toggleSectionExpansion}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TableOfContents({
  sections,
  activeSectionId,
  onSectionClick,
  expandedSections,
  toggleSectionExpansion,
}: {
  sections: DocSection[];
  activeSectionId: string | null;
  onSectionClick: (sectionId: string) => void;
  expandedSections: Set<string>;
  toggleSectionExpansion: (sectionId: string) => void;
}) {
  return (
    <div className="bg-md-sys-color-surface border border-md-sys-color-outline-variant rounded-lg p-4 md-elevation-1">
      <h3 className="md-typescale-title-large text-md-sys-color-on-surface mb-4 font-medium">
        Table of Contents
      </h3>
      <nav className="space-y-1">
        {sections.map((section) => (
          <TocSection
            key={section.id}
            section={section}
            activeSectionId={activeSectionId}
            onSectionClick={onSectionClick}
            expandedSections={expandedSections}
            toggleSectionExpansion={toggleSectionExpansion}
            level={0}
          />
        ))}
      </nav>
    </div>
  );
}


export default function Documentation() {
  const { project = "charty" } = useParams<{ project?: string }>(); // Version removed
  const navigate = useNavigate(); // Keep for now, might be used by other UI elements later
  const [projectData, setProjectData] = useState<ProjectIndex | null>(null);
  const [processedSections, setProcessedSections] = useState<DocSection[]>([]);
  // availableVersions state removed
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSectionExpansion = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  useEffect(() => {
    const loadDocumentation = async () => {
      if (!project) { // Version check removed
        setError("No project specified.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      // Removed logic for availableVersions

      try {
        // Dynamically import the project's index.json (no version in path)
        const indexJsonModule = await import(
          /* @vite-ignore */ `../content/docs/${project}/index.json` // Path reverted
        );
        const projectIndexData: ProjectIndex = indexJsonModule.default;
        setProjectData(projectIndexData);

        // processSections call no longer needs version
        const fullyProcessedSections = await processSections(projectIndexData.sections, project);
        setProcessedSections(fullyProcessedSections);

        // Set initial active section and expand its parents
        if (fullyProcessedSections.length > 0) {
          let firstValidSection: DocSection | null = null;
          const findFirstContentSection = (secs: DocSection[]): DocSection | null => {
            for (const sec of secs) {
              if (sec.path) return sec;
              if (sec.children) {
                const childSec = findFirstContentSection(sec.children);
                if (childSec) return childSec;
              }
            }
            return null;
          };
          firstValidSection = findFirstContentSection(fullyProcessedSections);

          if (firstValidSection) {
            setActiveSectionId(firstValidSection.id);
            // Expand all parent sections of the initial active section
            const newExpanded = new Set<string>();
            const expandParents = (sectionId: string | undefined) => {
                if (!sectionId) return;
                const parts = sectionId.split('-');
                for (let i = 1; i < parts.length; i++) {
                    newExpanded.add(parts.slice(0, i).join('-'));
                }
            };
            expandParents(firstValidSection.id.substring(0, firstValidSection.id.lastIndexOf('-')));
            setExpandedSections(newExpanded);

          } else {
             setActiveSectionId(null); // Or set to the first section's ID even if it has no path
          }
        }

      } catch (e) {
        console.error(`Failed to load documentation for project "${project}":`, e);
        setError(`Failed to load documentation for project "${project}". Check if an index.json exists at src/content/docs/${project}/index.json.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentation();
  }, [project]);

  const findSectionRecursive = (sections: DocSection[], id: string | null): DocSection | null => {
    if (!id) return null;
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children) {
        const foundInChildren = findSectionRecursive(section.children, id);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };

  const currentSection = findSectionRecursive(processedSections, activeSectionId);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-md-sys-color-background flex items-center justify-center">
        <p className="text-md-sys-color-on-surface">Loading documentation for {project}...</p>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-md-sys-color-background flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="md-typescale-display-small text-md-sys-color-on-background mb-4">
            Documentation Error
          </h1>
          <p className="text-md-sys-color-on-surface-variant">
            {error || `The documentation for project "${project}" could not be loaded.`}
          </p>
          <Button onClick={() => window.history.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-md-sys-color-background">
      <div className="container mx-auto px-6 py-8">
        <FadeInView>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="md-typescale-display-small text-md-sys-color-on-background">
                  {projectData.projectTitle}
                </h1>
                <Badge className="bg-md-sys-color-tertiary-container text-md-sys-color-on-tertiary-container">
                  v{projectData.projectVersion}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" asChild>
                  <a href={projectData.projectRepoUrl || `https://github.com/hi-manshu/${project}`} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    {project} on GitHub
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
              {projectData.projectDescription}
            </p>
          </div>
        </FadeInView>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents
                sections={processedSections}
                activeSectionId={activeSectionId}
                onSectionClick={setActiveSectionId}
                expandedSections={expandedSections}
                toggleSectionExpansion={toggleSectionExpansion}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentSection && currentSection.htmlContent ? (
              <FadeInView key={currentSection.id}>
                <Card className="bg-md-sys-color-surface border-md-sys-color-outline-variant md-elevation-1">
                  <CardHeader>
                    <CardTitle className="md-typescale-headline-medium text-md-sys-color-on-surface">
                      {currentSection.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentSection.htmlContent }}
                    />
                  </CardContent>
                </Card>
              </FadeInView>
            ) : currentSection && !currentSection.htmlContent && currentSection.children && currentSection.children.length > 0 ? (
                 <FadeInView key={currentSection.id + "-parent"}>
                    <Card className="bg-md-sys-color-surface border-md-sys-color-outline-variant md-elevation-1">
                        <CardHeader>
                            <CardTitle className="md-typescale-headline-medium text-md-sys-color-on-surface">
                                {currentSection.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-md-sys-color-on-surface-variant">
                                This is a parent section. Please select one of its sub-sections from the Table of Contents to view content.
                            </p>
                        </CardContent>
                    </Card>
                </FadeInView>
            ) : activeSectionId ? (
              <p className="text-md-sys-color-on-surface-variant">Select a section with content to view it, or content for "{currentSection?.title}" is missing or not loadable.</p>
            ) : (
              <p className="text-md-sys-color-on-surface-variant">Select a section from the Table of Contents to view its content.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}