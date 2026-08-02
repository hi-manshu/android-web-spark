import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Copy, Check, ChevronDown, ChevronRight, ChevronLeft,
  Github, Heart, MessageCircle, Search,
  Zap, Package, BarChart2, Layout, Terminal,
  Settings, HelpCircle, ExternalLink, ArrowRight,
  BookOpen, Layers, Database, GitMerge, Workflow,
  Puzzle, FileText, LineChart, PieChart,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { isFeatureEnabled } from '@/lib/features';

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
    code: {
      installation: `dependencies {\n    implementation(platform("com.himanshoe.krate:krate-bom:0.1.0"))\n    implementation("com.himanshoe.krate:krate-runtime")\n    ksp("com.himanshoe.krate:krate-processor")\n}`,
      basicUsage: `@Krate\ndata class User(val id: String, val name: String, val age: Int)\n\nval store = buildUserStore(context)\nstore.findAll().collect { users -> render(users) }`,
    },
  },
  kalendar: {
    title: 'Kalendar',
    description: 'Modern calendar component for Jetpack Compose with event management and full customization.',
    version: '1.5.2',
    githubUrl: 'https://github.com/hi-manshu/Kalendar',
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

const FOLDER_ICONS: Record<string, React.ElementType> = {
  'getting-started': Zap,
  'installation':    Zap,
  'overview':        BookOpen,
  'core':            Database,
  'chart-types':     BarChart2,
  'charts':          BarChart2,
  'bar':             BarChart2,
  'line':            LineChart,
  'radial':          PieChart,
  'other':           Layout,
  'line-charts':     Layout,
  'bar-charts':      BarChart2,
  'configurations':  Settings,
  'configuration':   Settings,
  'customization':   Terminal,
  'advanced':        Layers,
  'modules':         Package,
  'queries':         Search,
  'querying':        Search,
  'aggregates':      BarChart2,
  'relations':       GitMerge,
  'migrations':      ArrowRight,
  'middleware':      Workflow,
  'integrations':    Puzzle,
  'guides':          FileText,
  'reference':       BookOpen,
};

// Lower weight = earlier in the sidebar; unknown folders default to 50.
const SECTION_ORDER: Record<string, number> = {
  'getting-started': 0,
  'overview':        1,
  'core':            2,
  'charts':          3,
  'chart-types':     3,
  'querying':        4,
  'queries':         4,
  'aggregates':      5,
  'relations':       6,
  'migrations':      7,
  'middleware':      8,
  'configuration':   9,
  'configurations':  9,
  'customization':   10,
  'advanced':        11,
  'integrations':    12,
  'modules':         13,
  'guides':          90,
  'reference':       95,
};

function toTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

interface SectionGroup {
  key: string;
  title: string;
  folder: string;
  sub?: string;
  files: { file: string; content: string }[];
}

function buildSections(library: string): Section[] {
  const prefix = `/src/content/docs/${library}/`;
  const paths = Object.keys(mdModules)
    .filter((k) => k.startsWith(prefix))
    .sort();

  const groups = new Map<string, SectionGroup>();

  for (const path of paths) {
    const relative = path.slice(prefix.length).replace(/\.md$/, '');
    const parts = relative.split('/');

    let key: string;
    let title: string;
    let folder: string;
    let sub: string | undefined;

    if (parts.length === 1) {
      // Root-level pages (e.g. krate/encryption.md) live under "Guides"
      key = 'guides';
      title = 'Guides';
      folder = 'guides';
    } else if (parts.length === 2) {
      key = parts[0];
      title = toTitle(parts[0]);
      folder = parts[0];
    } else {
      // Nested folders (e.g. charty/charts/bar/BarChart.md) → "Bar Charts"
      folder = parts[0];
      sub = parts[1];
      key = `${folder}__${sub}`;
      title = `${toTitle(sub)} ${toTitle(folder)}`;
    }

    if (!groups.has(key)) groups.set(key, { key, title, folder, sub, files: [] });
    groups.get(key)!.files.push({
      file: parts[parts.length - 1],
      content: `${library}/${relative}`,
    });
  }

  const sorted = Array.from(groups.values()).sort((a, b) => {
    const wa = SECTION_ORDER[a.folder] ?? 50;
    const wb = SECTION_ORDER[b.folder] ?? 50;
    if (wa !== wb) return wa - wb;
    // Within the same parent folder, push "other" to the end
    const sa = a.sub === 'other' ? 1 : 0;
    const sb = b.sub === 'other' ? 1 : 0;
    if (sa !== sb) return sa - sb;
    return a.title.localeCompare(b.title);
  });

  for (const g of sorted) {
    g.files.sort((a, b) => {
      if (a.file === 'index') return -1;
      if (b.file === 'index') return 1;
      return a.file.localeCompare(b.file);
    });
  }

  return sorted.map((g) => ({
    id: g.key,
    title: g.title,
    content: g.files[0].content,
    icon: FOLDER_ICONS[g.sub ?? g.folder] ?? FOLDER_ICONS[g.folder],
    subsections: g.files.map(({ file, content }) => ({
      id: content.slice(library.length + 1).replace(/\//g, '__'),
      title: file === 'index' ? 'Overview' : toTitle(file),
      content,
    })),
  }));
}

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
  sections,
  project,
  activeSection,
  onNavigate,
}: {
  doc: DocData;
  sections: Section[];
  project: string;
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const s of sections) {
      if (s.subsections?.some((sub) => sub.id === activeSection) || s.id === activeSection) {
        initial.add(s.id);
      }
    }
    if (initial.size === 0 && sections[0]) initial.add(sections[0].id);
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
    ? sections.reduce<Section[]>((acc, s) => {
        const sMatch = s.title.toLowerCase().includes(query.toLowerCase());
        const filteredSubs = s.subsections?.filter((sub) =>
          sub.title.toLowerCase().includes(query.toLowerCase())
        );
        if (sMatch || filteredSubs?.length) {
          acc.push({ ...s, subsections: filteredSubs?.length ? filteredSubs : s.subsections });
        }
        return acc;
      }, [])
    : sections;

  useEffect(() => {
    if (query.trim()) setExpanded(new Set(sections.map((s) => s.id)));
  }, [query, sections]);

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
  githubUrl,
}: {
  headings: { id: string; text: string; level: number }[];
  activeHeading: string;
  githubUrl?: string;
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
          href={`${githubUrl || 'https://github.com/hi-manshu'}/discussions`}
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
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const doc = project ? docsData[project] : null;
  const sections = project ? buildSections(project) : [];
  const firstSectionId = sections[0]?.subsections?.[0]?.id ?? sections[0]?.id ?? '';

  const [activeSection, setActiveSection] = useState(firstSectionId);

  useEffect(() => {
    const secs = project ? buildSections(project) : [];
    const first = secs[0]?.subsections?.[0]?.id ?? secs[0]?.id ?? '';
    setActiveSection(first);
    setActiveHeading('');
  }, [project]);

  // Strip a leading H1 — the page header already renders the section title,
  // so the markdown's own "# Setup" would appear twice.
  const rawMarkdown = doc ? getContent(findSection(sections, activeSection)?.content) : '';
  const markdown = rawMarkdown.replace(/^\s*#\s[^\n]*\n+/, '');
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

  const allSections = flattenAll(sections);
  const currentIdx = allSections.findIndex((s) => s.id === activeSection);
  const prevSection = currentIdx > 0 ? allSections[currentIdx - 1] : null;
  const nextSection = currentIdx < allSections.length - 1 ? allSections[currentIdx + 1] : null;
  const currentSection = findSection(sections, activeSection);

  // Find which top-level section is parent of activeSection
  const parentSection = sections.find(
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
            sections={sections}
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
            <h1
              className={`${
                isFeatureEnabled('showcase') ? 'font-serif ' : ''
              }text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3`}
            >
              <span className="text-foreground">{doc.title} </span>
              <span className="text-gradient">{currentSection?.title}</span>
            </h1>
            {/* The library tagline only belongs on the landing section —
                everywhere else it just pushes content down */}
            {currentIdx === 0 && (
              <p className="text-sm text-foreground/55 leading-relaxed max-w-xl">
                {doc.description}
              </p>
            )}
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <DocContent markdown={markdown} onSectionLink={handleNavigate} />
          </div>

          {/* Edit on GitHub */}
          {doc.githubUrl && currentSection && (
            <div className="flex justify-end mt-8">
              <a
                href={`${doc.githubUrl}/edit/main/docs/${currentSection.content.slice((project?.length ?? 0) + 1)}.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground transition-colors"
              >
                <Github className="h-3 w-3" />
                Edit this page on GitHub
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </a>
            </div>
          )}

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
          <RightSidebar headings={headings} activeHeading={activeHeading} githubUrl={doc.githubUrl} />
        </div>
      </div>
    </div>
  );
}
