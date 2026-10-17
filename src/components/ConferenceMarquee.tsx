import { formatEventDate, type SpeakingEvent } from '@/data/talks';
import { useTalks } from '@/hooks/useTalks';

function Pill({ event }: { event: SpeakingEvent }) {
  const inner = (
    <>
      <span className="font-semibold text-ink whitespace-nowrap">{event.name}</span>
      <span className="text-dim whitespace-nowrap">{formatEventDate(event.date)}</span>
      <span className="text-dim whitespace-nowrap">{event.location}</span>
    </>
  );
  const className =
    'inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-[13px] transition-colors hover:border-ember';
  return event.url ? (
    <a href={event.url} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <span className={className}>{inner}</span>
  );
}

/**
 * One slow, full-bleed strip of every conference appearance.
 * The track holds two copies so the loop is seamless; pauses on hover.
 */
export function ConferenceMarquee({ className = '' }: { className?: string }) {
  const { events } = useTalks();
  const doubled = [...events, ...events];
  return (
    <div className={`marquee ${className}`} aria-label="Conferences I have spoken at">
      <div className="marquee__track">
        {doubled.map((event, i) => (
          <Pill key={`${event.name}-${event.date}-${i}`} event={event} />
        ))}
      </div>
    </div>
  );
}
