import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Copy, Check, ChevronDown, ChevronRight, ChevronLeft,
  Github, Heart, MessageCircle, Search,
  Zap, Package, BarChart2, Layout, Terminal,
  Settings, HelpCircle, ExternalLink, ArrowRight,
  BookOpen, Layers, Database, Calendar as CalendarIcon,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */

interface Section {
  id: string;
  title: string;
  content: string;
  icon?: React.ElementType;
  subsections?: Section[];
}

interface DocData {
  title: string;
  description: string;
  version: string;
  githubUrl?: string;
  sections: Section[];
  code: Record<string, string>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Docs Data
───────────────────────────────────────────────────────────────────────────── */

const docsData: Record<string, DocData> = {
  charty: {
    title: 'Charty',
    description: 'A sleek & lightweight charting library for Jetpack Compose, now with Kotlin & Compose Multiplatform support!',
    version: '3.0.0-beta01',
    githubUrl: 'https://github.com/hi-manshu/Charty',
    sections: [
      {
        id: 'getting-started', title: 'Getting Started', content: 'charty/getting-started/installation', icon: Zap,
        subsections: [
          { id: 'installation', title: 'Installation', content: 'charty/getting-started/installation' },
        ],
      },
      {
        id: 'bar-charts', title: 'Bar Charts', content: 'charty/chart-types/bar-charts', icon: BarChart2,
        subsections: [
          { id: 'bar-chart', title: 'Bar Chart', content: 'charty/chart-types/bar-chart' },
          { id: 'horizontal-bar-chart', title: 'Horizontal Bar Chart', content: 'charty/chart-types/horizontal-bar-chart' },
          { id: 'stacked-bar-chart', title: 'Stacked Bar Chart', content: 'charty/chart-types/stacked-bar-chart' },
          { id: 'mosiac-bar-chart', title: 'Mosaic Bar Chart', content: 'charty/chart-types/mosiac-bar-chart' },
          { id: 'comparison-bar-chart', title: 'Comparison Bar Chart', content: 'charty/chart-types/comparison-bar-chart' },
          { id: 'bubble-bar-chart', title: 'Bubble Bar Chart', content: 'charty/chart-types/bubble-bar-chart' },
          { id: 'lollipop-bar-chart', title: 'Lollipop Bar Chart', content: 'charty/chart-types/lollipop-bar-chart' },
          { id: 'span-chart', title: 'Span Chart', content: 'charty/chart-types/span-chart' },
          { id: 'waterfall-chart', title: 'Waterfall Chart', content: 'charty/chart-types/waterfall-chart' },
          { id: 'wavy-chart', title: 'Wavy Chart', content: 'charty/chart-types/wavy-chart' },
          { id: 'block-bar-chart', title: 'Block Bar Chart', content: 'charty/chart-types/block-bar-chart' },
          { id: 'combo-bar-chart', title: 'Combo Bar Chart', content: 'charty/chart-types/combo-bar-chart' },
        ],
      },
      {
        id: 'line-charts', title: 'Line Charts', content: 'charty/chart-types/line-charts', icon: Layout,
        subsections: [
          { id: 'line-chart', title: 'Line Chart', content: 'charty/chart-types/line-chart' },
          { id: 'multiline-chart', title: 'Multiline Chart', content: 'charty/chart-types/multiline-chart' },
          { id: 'area-chart', title: 'Area Chart', content: 'charty/chart-types/area-chart' },
          { id: 'stacked-area-chart', title: 'Stacked Area Chart', content: 'charty/chart-types/stacked-area-chart' },
        ],
      },
      {
        id: 'point-charts', title: 'Point & Bubble', content: 'charty/chart-types/point-chart', icon: Package,
        subsections: [
          { id: 'point-chart', title: 'Point Chart', content: 'charty/chart-types/point-chart' },
          { id: 'bubble-chart', title: 'Bubble Chart', content: 'charty/chart-types/bubble-chart' },
        ],
      },
      {
        id: 'radar-charts', title: 'Radar Charts', content: 'charty/chart-types/radar-chart', icon: Layers,
        subsections: [
          { id: 'radar-chart', title: 'Radar Chart', content: 'charty/chart-types/radar-chart' },
          { id: 'multiple-radar-chart', title: 'Multiple Radar Chart', content: 'charty/chart-types/multiple-radar-chart' },
        ],
      },
      {
        id: 'other-charts', title: 'Other Charts', content: 'charty/chart-types/pie-charts', icon: Terminal,
        subsections: [
          { id: 'pie-charts', title: 'Pie Charts', content: 'charty/chart-types/pie-charts' },
          { id: 'candle-stick-chart', title: 'Candlestick Chart', content: 'charty/chart-types/candle-stick-chart' },
        ],
      },
      {
        id: 'configurations', title: 'Configurations', content: 'charty/configurations/chart-scaffold-config', icon: Settings,
        subsections: [
          { id: 'chart-scaffold-config', title: 'ChartScaffoldConfig', content: 'charty/configurations/chart-scaffold-config' },
          { id: 'bar-chart-config', title: 'BarChartConfig', content: 'charty/configurations/bar-chart-config' },
          { id: 'line-chart-config', title: 'LineChartConfig', content: 'charty/configurations/line-chart-config' },
          { id: 'pie-chart-config', title: 'PieChartConfig', content: 'charty/configurations/pie-chart-config' },
          { id: 'radar-chart-config', title: 'RadarChartConfig', content: 'charty/configurations/radar-chart-config' },
          { id: 'multiple-radar-chart-config', title: 'MultipleRadarChartConfig', content: 'charty/configurations/multiple-radar-chart-config' },
          { id: 'point-chart-config', title: 'PointChartConfig', content: 'charty/configurations/point-chart-config' },
          { id: 'candlestick-chart-config', title: 'CandlestickChartConfig', content: 'charty/configurations/candlestick-chart-config' },
          { id: 'combo-chart-config', title: 'ComboChartConfig', content: 'charty/configurations/combo-chart-config' },
          { id: 'stacked-bar-chart-config', title: 'StackedBarChartConfig', content: 'charty/configurations/stacked-bar-chart-config' },
          { id: 'comparison-bar-chart-config', title: 'ComparisonBarChartConfig', content: 'charty/configurations/comparison-bar-chart-config' },
          { id: 'bubble-bar-chart-config', title: 'BubbleBarChartConfig', content: 'charty/configurations/bubble-bar-chart-config' },
          { id: 'lollipop-bar-chart-config', title: 'LollipopBarChartConfig', content: 'charty/configurations/lollipop-bar-chart-config' },
          { id: 'mosiac-bar-chart-config', title: 'MosiacBarChartConfig', content: 'charty/configurations/mosiac-bar-chart-config' },
          { id: 'waterfall-chart-config', title: 'WaterfallChartConfig', content: 'charty/configurations/waterfall-chart-config' },
          { id: 'wavy-chart-config', title: 'WavyChartConfig', content: 'charty/configurations/wavy-chart-config' },
          { id: 'block-bar-chart-config', title: 'BlockBarChartConfig', content: 'charty/configurations/block-bar-chart-config' },
          { id: 'reference-line-config', title: 'ReferenceLineConfig', content: 'charty/configurations/reference-line-config' },
        ],
      },
    ],
    code: {
      installation: `dependencies {\n    implementation("com.himanshoe:charty:3.0.0-beta01")\n}`,
      basicUsage: `BarChart(\n    data = chartData,\n    modifier = Modifier.fillMaxWidth().height(300.dp)\n)`,
    },
  },
  krate: {
    title: 'Krate',
    githubUrl: 'https://github.com/hi-manshu/Krate',
    description: 'Type-safe reactive database for Kotlin Multiplatform — zero boilerplate, Flow-based reactivity, KSP-generated Store<T> backed by Room.',
    version: '0.1.0',
    sections: [
      {
        id: 'getting-started', title: 'Getting Started', content: 'krate/getting-started/installation', icon: Zap,
        subsections: [
          { id: 'installation', title: 'Installation', content: 'krate/getting-started/installation' },
          { id: 'setup', title: 'Setup', content: 'krate/getting-started/setup' },
        ],
      },
      {
        id: 'core', title: 'Core Concepts', content: 'krate/core/krate-annotation', icon: Database,
        subsections: [
          { id: 'krate-annotation', title: '@Storable Annotation', content: 'krate/core/krate-annotation' },
          { id: 'kratename-annotation', title: '@KrateName Annotation', content: 'krate/core/kratename-annotation' },
          { id: 'store', title: 'Store', content: 'krate/core/store' },
        ],
      },
      {
        id: 'queries', title: 'Queries', content: 'krate/queries/predicates', icon: Search,
        subsections: [
          { id: 'predicates', title: 'Predicates', content: 'krate/queries/predicates' },
          { id: 'aggregate-queries', title: 'Aggregate Queries', content: 'krate/queries/aggregate-queries' },
        ],
      },
      {
        id: 'advanced', title: 'Advanced', content: 'krate/advanced/compose', icon: Settings,
        subsections: [
          { id: 'compose', title: 'Compose Integration', content: 'krate/advanced/compose' },
          { id: 'migrations', title: 'Migrations', content: 'krate/advanced/migrations' },
        ],
      },
      {
        id: 'modules', title: 'Modules', content: 'krate/modules/overview', icon: Package,
        subsections: [
          { id: 'modules-overview', title: 'Modules Overview', content: 'krate/modules/overview' },
        ],
      },
    ],
    code: {
      installation: `dependencies {\n    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))\n    implementation("com.himanshoe.krate:krate-runtime")\n    ksp("com.himanshoe.krate:krate-processor")\n}`,
      basicUsage: `@Krate\ndata class User(val id: String, val name: String, val age: Int)\n\nval store = buildUserStore(context)\nstore.findAll().collect { users -> render(users) }`,
    },
  },
  kalendar: {
    title: 'Kalendar',
    description: 'Modern calendar component for Jetpack Compose with event management and full customization.',
    version: '1.5.2',
    sections: [
      {
        id: 'overview', title: 'Overview', content: 'kalendar/overview/features', icon: CalendarIcon,
        subsections: [
          { id: 'features', title: 'Features', content: 'kalendar/overview/features' },
          { id: 'setup', title: 'Setup', content: 'kalendar/overview/setup' },
        ],
      },
    ],
    code: {
      installation: `dependencies {\n    implementation("com.himanshoe:kalendar:1.5.2")\n}`,
      basicUsage: `Kalendar(\n    onCurrentDayClick = { day, events -> },\n    kalendarType = KalendarType.Firey\n)`,
    },
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Utilities
───────────────────────────────────────────────────────────────────────────── */

const mdModules = import.meta.glob('/src/content/docs/**/*.md', { as: 'raw', eager: true });

function getContent(path?: string): string {
  if (!path) return '';
  const key = `/src/content/docs/${path}.md`;
  return (mdModules[key] as string) || '_Content not yet available for this section._';
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const lines = markdown.split('\n');
  const headings: { id: string; text: string; level: number }[] = [];
  for (const line of lines) {
    const m2 = line.match(/^## (.+)/);
    const m3 = line.match(/^### (.+)/);
    if (m2) headings.push({ id: slugify(m2[1]), text: m2[1], level: 2 });
    else if (m3) headings.push({ id: slugify(m3[1]), text: m3[1], level: 3 });
  }
  return headings;
}

function flattenAll(secs: Section[]): Section[] {
  return secs.reduce<Section[]>((acc, s) => {
    if (s.subsections?.length) acc.push(...flattenAll(s.subsections));
    else acc.push(s);
    return acc;
  }, []);
}

function findSection(secs: Section[], id: string): Section | null {
  for (const s of secs) {
    if (s.id === id) return s;
    if (s.subsections) {
      const f = findSection(s.subsections, id);
      if (f) return f;
    }
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reading progress
───────────────────────────────────────────────────────────────────────────── */

function ReadingProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[70] bg-foreground/[0.05]">
      <div className="h-full progress-gradient transition-all duration-100" style={{ width: `${p}%` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Copy Button
───────────────────────────────────────────────────────────────────────────── */

function CopyButton({ code, light }: { code: string; light?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all hover:scale-105 ${
        light
          ? 'bg-foreground/[0.06] hover:bg-foreground/10 text-foreground/50'
          : 'bg-white/[0.06] hover:bg-white/10 text-white/50'
      }`}
      aria-label="Copy"
    >
      {copied ? (
        <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
      ) : (
        <><Copy className="h-3 w-3" /><span>Copy</span></>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Code Block
───────────────────────────────────────────────────────────────────────────── */

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden my-5 border border-white/[0.07] dark:border-white/[0.07]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161616] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-3">
          {lang && (
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              {lang}
            </span>
          )}
          <CopyButton code={code} />
        </div>
      </div>
      {/* Code */}
      <pre className="bg-[#0e0e0e] px-5 py-4 overflow-x-auto text-[12.5px] font-mono leading-[1.75] text-[#e2e8f0] m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Left Sidebar
───────────────────────────────────────────────────────────────────────────── */

function LeftSidebar({
  doc,
  project,
  activeSection,
  onNavigate,
}: {
  doc: DocData;
  project: string;
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const s of doc.sections) {
      if (s.subsections?.some((sub) => sub.id === activeSection) || s.id === activeSection) {
        initial.add(s.id);
      }
    }
    if (initial.size === 0 && doc.sections[0]) initial.add(doc.sections[0].id);
    return initial;
  });
  const [query, setQuery] = useState('');

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const isSubActive = (s: Section) =>
    s.subsections?.some((sub) => sub.id === activeSection);

  const filteredSections = query.trim()
    ? doc.sections.reduce<Section[]>((acc, s) => {
        const sMatch = s.title.toLowerCase().includes(query.toLowerCase());
        const filteredSubs = s.subsections?.filter((sub) =>
          sub.title.toLowerCase().includes(query.toLowerCase())
        );
        if (sMatch || filteredSubs?.length) {
          acc.push({ ...s, subsections: filteredSubs?.length ? filteredSubs : s.subsections });
        }
        return acc;
      }, [])
    : doc.sections;

  useEffect(() => {
    if (query.trim()) setExpanded(new Set(doc.sections.map((s) => s.id)));
  }, [query]);

  return (
    <aside className="flex flex-col h-full">
      {/* Library header */}
      <div className="px-4 py-4 border-b border-foreground/[0.06]">
        <Link to="/docs" className="flex items-center gap-2 group mb-0.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors leading-none mb-0.5">
              {doc.title}
            </div>
            <div className="text-[10px] font-mono text-foreground/35">v{doc.version}</div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-foreground/[0.06]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/30" />
          <Input
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-7 h-7 text-xs bg-foreground/[0.04] border-foreground/[0.07] focus:border-emerald-500/30 focus-visible:ring-0 rounded-lg placeholder:text-foreground/30"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expanded.has(section.id);
          const isActive = activeSection === section.id || isSubActive(section);
          const hasChildren = !!section.subsections?.length;

          return (
            <div key={section.id}>
              <button
                onClick={() => {
                  if (hasChildren) toggle(section.id);
                  else onNavigate(section.id);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 group ${
                  isActive && !hasChildren
                    ? 'sidebar-active font-semibold'
                    : isActive
                    ? 'text-foreground/80 font-medium bg-foreground/[0.04]'
                    : 'text-foreground/55 hover:text-foreground hover:bg-foreground/[0.04]'
                }`}
              >
                {Icon ? (
                  <Icon
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-foreground/30 group-hover:text-foreground/55'
                    }`}
                  />
                ) : (
                  <span className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="truncate flex-1 text-left">{section.title}</span>
                {hasChildren && (
                  <ChevronRight
                    className={`h-3 w-3 flex-shrink-0 opacity-30 transition-transform duration-150 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-[22px] mt-0.5 mb-1 space-y-0.5 border-l border-foreground/[0.07] pl-3">
                  {section.subsections!.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onNavigate(sub.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-all duration-150 block ${
                        activeSection === sub.id
                          ? 'sidebar-active font-semibold'
                          : 'text-foreground/45 hover:text-foreground hover:bg-foreground/[0.04]'
                      }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-foreground/[0.06] px-2 py-3 space-y-0.5">
        <a
          href={doc.githubUrl || 'https://github.com/hi-manshu'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-foreground/45 hover:text-foreground hover:bg-foreground/[0.04] transition-all"
        >
          <Github className="h-3.5 w-3.5 flex-shrink-0" />
          <span>View on GitHub</span>
          <ExternalLink className="h-2.5 w-2.5 ml-auto opacity-40" />
        </a>
        <a
          href="https://github.com/sponsors/hi-manshu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-foreground/45 hover:text-foreground hover:bg-foreground/[0.04] transition-all"
        >
          <Heart className="h-3.5 w-3.5 flex-shrink-0 text-rose-500/70" />
          <span>Sponsor</span>
        </a>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Right Sidebar — On This Page + Need Help
───────────────────────────────────────────────────────────────────────────── */

function RightSidebar({
  headings,
  activeHeading,
}: {
  headings: { id: string; text: string; level: number }[];
  activeHeading: string;
}) {
  return (
    <aside className="flex flex-col gap-5">
      {headings.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/35 mb-3 px-1">
            On this page
          </p>
          <nav className="space-y-0.5">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-[11px] py-1 px-2 rounded-md transition-all duration-150 ${
                  h.level === 3 ? 'pl-4' : ''
                } ${
                  activeHeading === h.id
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/[0.07]'
                    : 'text-foreground/45 hover:text-foreground hover:bg-foreground/[0.04]'
                }`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Need help card */}
      <div className="glass-card rounded-xl p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-semibold text-foreground/80">Need help?</p>
        </div>
        <p className="text-[11px] text-foreground/45 leading-relaxed mb-3">
          Join the community for support or browse the source code.
        </p>
        <a
          href="https://github.com/hi-manshu/Charty/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-foreground text-background text-[11px] font-semibold hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-3 w-3" />
          Join Discussions
        </a>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Markdown Renderer
───────────────────────────────────────────────────────────────────────────── */

function DocContent({
  markdown,
  onSectionLink,
}: {
  markdown: string;
  onSectionLink: (id: string) => void;
}) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 id={slugify(String(children))} className="text-2xl font-bold tracking-tight mb-2 mt-1 text-foreground scroll-mt-20">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 id={slugify(String(children))} className="text-lg font-semibold mt-10 mb-3 pb-2 border-b border-foreground/[0.08] text-foreground scroll-mt-20">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 id={slugify(String(children))} className="text-sm font-semibold mt-6 mb-2 text-foreground/90 scroll-mt-20">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-sm leading-[1.85] mb-4 text-foreground/65">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-4 space-y-1.5 text-sm text-foreground/65">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-sm text-foreground/65">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ node, ...props }) => {
          const href = props.href;
          if (href?.startsWith('#')) {
            const id = href.substring(1);
            return (
              <a
                {...props}
                onClick={(e) => { e.preventDefault(); onSectionLink(id); }}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 underline underline-offset-2 cursor-pointer transition-colors"
              />
            );
          }
          return (
            <a
              {...props}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            />
          );
        },
        pre: ({ node, children, ...props }) => {
          // children may be a single element or an array — normalize
          const codeEl = Array.isArray(children) ? children[0] : children;
          const rawChildren = (codeEl as any)?.props?.children;
          // code children can be a plain string or an array of strings/elements
          const codeStr = (
            Array.isArray(rawChildren)
              ? rawChildren
                  .map((c: any) => (typeof c === 'string' ? c : String(c?.props?.children ?? '')))
                  .join('')
              : String(rawChildren ?? '')
          ).replace(/\n$/, '');
          const lang = (codeEl as any)?.props?.className?.replace('language-', '') || '';
          return <CodeBlock code={codeStr} lang={lang || undefined} />;
        },
        code: ({ node, className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded-md text-[11.5px] font-mono bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300 border border-emerald-500/[0.12]"
                {...props}
              >
                {children}
              </code>
            );
          }
          return <code className={className} {...props}>{children}</code>;
        },
        blockquote: ({ children }) => (
          <blockquote className="relative pl-4 my-5 text-sm text-foreground/55 italic bg-emerald-500/[0.04] border-l-[3px] border-emerald-400/50 rounded-r-xl py-3 pr-4">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-5 rounded-xl border border-foreground/[0.08]">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-foreground/[0.03] px-4 py-2.5 text-left font-semibold border-b border-foreground/[0.08] text-[11px] uppercase tracking-wider text-foreground/50">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 border-b border-foreground/[0.05] text-foreground/60 text-sm">
            {children}
          </td>
        ),
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        hr: () => <hr className="my-8 border-foreground/[0.08]" />,
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="rounded-xl border border-foreground/[0.08] my-5 max-w-full"
          />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */

export default function Documentation() {
  const { project } = useParams<{ project: string }>();
  const [activeSection, setActiveSection] = useState('installation');
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const doc = project ? docsData[project] : null;

  const markdown = doc ? getContent(findSection(doc.sections, activeSection)?.content) : '';
  const headings = extractHeadings(markdown);

  // Auto-highlight headings on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!contentRef.current) return;
      const all = contentRef.current.querySelectorAll<HTMLElement>('h2[id], h3[id]');
      let current = '';
      for (const el of all) {
        if (el.getBoundingClientRect().top <= 120) current = el.id;
      }
      setActiveHeading(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeSection]);

  const handleNavigate = useCallback((id: string) => {
    setActiveSection(id);
    setActiveHeading('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center glass-card rounded-2xl p-12 max-w-md mx-auto">
          <BookOpen className="h-10 w-10 text-foreground/20 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Documentation Not Found</h1>
          <p className="text-foreground/50 text-sm mb-6">
            No docs for{' '}
            <code className="text-xs bg-foreground/[0.06] px-1.5 py-0.5 rounded">{project}</code>.
          </p>
          <Button asChild variant="outline" size="sm" className="glass border-foreground/10">
            <Link to="/docs">Browse Docs</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allSections = flattenAll(doc.sections);
  const currentIdx = allSections.findIndex((s) => s.id === activeSection);
  const prevSection = currentIdx > 0 ? allSections[currentIdx - 1] : null;
  const nextSection = currentIdx < allSections.length - 1 ? allSections[currentIdx + 1] : null;
  const currentSection = findSection(doc.sections, activeSection);

  // Find which top-level section is parent of activeSection
  const parentSection = doc.sections.find(
    (s) => s.id === activeSection || s.subsections?.some((sub) => sub.id === activeSection)
  );

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgressBar />

      {/* ── Three-column layout ── */}
      <div className="flex min-h-[calc(100vh-56px)]">

        {/* ── Left Sidebar ── */}
        <div className="hidden lg:flex flex-col w-[230px] xl:w-[250px] flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] border-r border-foreground/[0.06] bg-background/80 backdrop-blur-sm overflow-hidden">
          <LeftSidebar
            doc={doc}
            project={project || ''}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
        </div>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 px-6 md:px-10 py-8 max-w-[800px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/35 mb-7">
            <Link to="/docs" className="hover:text-foreground/60 transition-colors">Docs</Link>
            <span className="opacity-30">›</span>
            <span className="text-foreground/45">{doc.title}</span>
            {parentSection && parentSection.id !== activeSection && (
              <>
                <span className="opacity-30">›</span>
                <span className="text-foreground/55">{parentSection.title}</span>
              </>
            )}
            <span className="opacity-30">›</span>
            <span className="text-emerald-600 dark:text-emerald-400">{currentSection?.title}</span>
          </nav>

          {/* Page title — split color like reference */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3">
              <span className="text-foreground">{doc.title} </span>
              <span className="text-gradient">{currentSection?.title}</span>
            </h1>
            <p className="text-sm text-foreground/55 leading-relaxed max-w-xl">
              {doc.description}
            </p>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <DocContent markdown={markdown} onSectionLink={handleNavigate} />
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between items-stretch gap-4 mt-10 pt-6 border-t border-foreground/[0.07]">
            {prevSection ? (
              <button
                onClick={() => handleNavigate(prevSection.id)}
                className="flex-1 flex items-center gap-3 glass-card rounded-xl px-4 py-3.5 text-left group hover:border-emerald-500/20 transition-all"
              >
                <ChevronLeft className="h-4 w-4 text-foreground/30 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/30 mb-0.5">Previous</div>
                  <div className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                    {prevSection.title}
                  </div>
                </div>
              </button>
            ) : <div className="flex-1" />}

            {nextSection && (
              <button
                onClick={() => handleNavigate(nextSection.id)}
                className="flex-1 flex items-center justify-end gap-3 glass-card rounded-xl px-4 py-3.5 text-right group hover:border-emerald-500/20 transition-all"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/30 mb-0.5">Next</div>
                  <div className="text-xs font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                    {nextSection.title}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-foreground/30 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </button>
            )}
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <div className="hidden xl:block w-[200px] 2xl:w-[220px] flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-l border-foreground/[0.06] bg-background/80 backdrop-blur-sm px-4 py-6">
          <RightSidebar headings={headings} activeHeading={activeHeading} />
        </div>
      </div>
    </div>
  );
}
