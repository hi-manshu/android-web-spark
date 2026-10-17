import { ArrowUpRight } from 'lucide-react';
import { countryCount, inPersonCount } from '@/data/talks';
import { useTalks } from '@/hooks/useTalks';
import { useLibraryMeta } from '@/services/libraryService';
import { DOCS_LINKS, isExternal } from '@/data/libraries';
import { TiltCard } from '@/components/motion';
import { ChartyStage, KalendarStage, KrateStage, TalksStage } from '@/components/stages';

export function HomeTiles({ baseDelay }: { baseDelay: number }) {
  const { events } = useTalks();
  const krate = useLibraryMeta('hi-manshu/Krate', { version: '0.1.0' });
  const charty = useLibraryMeta('hi-manshu/Charty', { version: '3.0.0-beta01' });
  const kalendar = useLibraryMeta('hi-manshu/Kalendar', { version: '1.5.2' });

  const tiles = [
    { title: 'Krate', text: 'Reactive database for Kotlin Multiplatform', meta: `v${krate.version}`, to: DOCS_LINKS.krate, Stage: KrateStage },
    { title: 'Charty', text: 'Charts for Compose Multiplatform', meta: `v${charty.version}`, to: DOCS_LINKS.charty, Stage: ChartyStage },
    { title: 'Kalendar', text: 'Calendar for Jetpack Compose', meta: `v${kalendar.version}`, to: DOCS_LINKS.kalendar, Stage: KalendarStage },
    {
      title: 'Talks',
      text: `${inPersonCount(events)} conferences in ${countryCount(events)} countries`,
      meta: `since ${events[events.length - 1].date.slice(0, 4)}`,
      to: '/talks',
      Stage: TalksStage,
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, i) => (
        <TiltCard
          key={tile.title}
          {...(isExternal(tile.to) ? { href: tile.to } : { to: tile.to })}
          delay={baseDelay + i * 90}
          className="p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-lg font-bold tracking-tight text-ink">{tile.title}</span>
            <ArrowUpRight className="h-4 w-4 text-dim transition-all duration-200 group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <tile.Stage />
          <p className="text-sm text-dim leading-snug">{tile.text}</p>
          <p className="mt-2 font-mono text-[11px] text-dim/80">{tile.meta}</p>
        </TiltCard>
      ))}
    </div>
  );
}
