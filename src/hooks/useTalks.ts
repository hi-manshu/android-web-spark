import { useQuery } from '@tanstack/react-query';
import type { SessionizeData } from '../../shared/sessionize';
import { events as snapshotEvents, talks as snapshotTalks, mergeEvents, type SpeakingEvent, type Talk } from '@/data/talks';

async function fetchLiveTalks(): Promise<SessionizeData> {
  const r = await fetch('/api/talks', { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`talks api ${r.status}`);
  const ct = r.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) throw new Error('talks api returned non-JSON'); // vite dev serves index.html here
  const data = (await r.json()) as SessionizeData;
  if (!Array.isArray(data.events) || data.events.length === 0) throw new Error('empty talks payload');
  return data;
}

/**
 * Talks and events: the build snapshot renders immediately, then the live
 * Sessionize data replaces it when /api/talks answers.
 */
export function useTalks(): { events: SpeakingEvent[]; talks: Talk[]; isLive: boolean } {
  const q = useQuery({
    queryKey: ['talks-live'],
    queryFn: fetchLiveTalks,
    staleTime: 60 * 60 * 1000,
    retry: 0,
  });
  if (q.data) {
    return { events: mergeEvents(q.data.events), talks: q.data.sessions, isLive: true };
  }
  return { events: snapshotEvents, talks: snapshotTalks, isLive: false };
}
