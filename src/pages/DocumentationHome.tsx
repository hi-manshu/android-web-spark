import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageTitle, TiltCard } from '@/components/motion';
import { ChartyStage, KalendarStage, KrateStage } from '@/components/stages';
import { useLibraryMeta } from '@/services/libraryService';
import { DOCS_LINKS, isExternal } from '@/data/libraries';
import { Star } from 'lucide-react';

const libraries = [
  {
    name: 'krate',
    title: 'Krate',
    description:
      'Type-safe reactive database for Kotlin Multiplatform. Annotate a data class and KSP generates a Store<T> backed by Room, with Flow-based reads, queries, relations, and migrations.',
    version: '0.1.0',
    tags: ['KMP', 'Room', 'KSP', 'Android', 'iOS'],
    githubUrl: 'https://github.com/hi-manshu/Krate',
    isNew: true,
    logo: '/krate-logo.svg',
    Stage: KrateStage,
  },
  {
    name: 'charty',
    title: 'Charty',
    description:
      'Charts for Jetpack Compose and Compose Multiplatform. 25+ chart types including bar, line, radar, candlestick, and waterfall, all animated, interactive, and themeable.',
    version: '3.0.0-beta01',
    tags: ['Compose', 'KMP', 'Charts'],
    githubUrl: 'https://github.com/hi-manshu/Charty',
    isNew: false,
    Stage: ChartyStage,
  },
  {
    name: 'kalendar',
    title: 'Kalendar',
    description:
      'A calendar component for Jetpack Compose with event management and full customization, built to drop into any Android app.',
    version: '1.5.2',
    tags: ['Compose', 'Calendar', 'Android'],
    githubUrl: 'https://github.com/hi-manshu/Kalendar',
    isNew: false,
    Stage: KalendarStage,
  },
];

function LibraryMeta({ repo, fallback }: { repo: string; fallback: string }) {
  const meta = useLibraryMeta(repo, { version: fallback });
  return (
    <span className="flex items-center gap-3 font-mono text-xs text-dim">
      {meta.stars !== undefined && (
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />
          {meta.stars.toLocaleString()}
        </span>
      )}
      <span>v{meta.version}</span>
    </span>
  );
}

export default function DocumentationHome() {
  const base = 520;
  return (
    <div className="relative container py-10 md:py-14 max-w-6xl">
      <div className="page-glow" aria-hidden />

      <PageTitle title="Documentation">
        Guides and API references for every library. Each one demos itself below. Pick one to get started.
      </PageTitle>

      <div className="grid gap-4 md:grid-cols-3">
        {libraries.map((lib, i) => (
          <TiltCard key={lib.name} delay={base + i * 110} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {'logo' in lib && lib.logo ? (
                  <h2 className="flex items-center">
                    <img src={lib.logo} alt={lib.title} className="h-9 w-auto" />
                  </h2>
                ) : (
                  <h2 className="text-2xl font-bold tracking-tight">{lib.title}</h2>
                )}
                {lib.isNew && <span className="rounded-full bg-ember text-white text-[11px] font-semibold px-2 py-0.5">New</span>}
              </div>
              <LibraryMeta repo={lib.githubUrl.replace('https://github.com/', '')} fallback={lib.version} />
            </div>

            <lib.Stage className="stage-lg" />

            <p className="text-sm text-dim leading-relaxed flex-1">{lib.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {lib.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {isExternal(DOCS_LINKS[lib.name]) ? (
                <a href={DOCS_LINKS[lib.name]} target="_blank" rel="noopener noreferrer" className="btn-ink flex-1 justify-center text-xs py-2">
                  Read the docs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link to={DOCS_LINKS[lib.name]} className="btn-ink flex-1 justify-center text-xs py-2">
                  Read the docs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
              <a href={lib.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-line justify-center text-xs py-2 px-3" aria-label={`${lib.title} on GitHub`}>
                <Github className="h-4 w-4" />
              </a>
            </div>
          </TiltCard>
        ))}
      </div>

      <p className="rise mt-10 text-sm text-dim" style={{ '--d': `${base + 400}ms` } as React.CSSProperties}>
        Missing something? Open an issue on the library's GitHub repository, or ask in Discussions.
      </p>
    </div>
  );
}
