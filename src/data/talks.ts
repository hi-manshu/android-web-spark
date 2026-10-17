import snapshot from './sessionize.json';
import talksMarkdown from '@/content/talks.md?raw';
import type { SessionizeData, SessionizeEvent, SessionizeSession } from '../../shared/sessionize';
import { parseTalksMarkdown } from './talksMarkdown';

export type SpeakingEvent = SessionizeEvent & {
  /** Day of month when known; Sessionize only publishes the month. */
  day?: number;
  /** Session title given in talks.md */
  talk?: string;
  /** Slide deck: a /slides/*.pdf in this repo, Google Slides, Speaker Deck, or any URL */
  slides?: string;
  /** Recording, usually YouTube */
  video?: string;
  links?: { label: string; url: string }[];
};

/** Exact days for events Sessionize lists by month only. Key = event name. */
export const EVENT_DAYS: Record<string, number> = {
  'droidcon Lisbon 2026': 22,
};

/** Events already held this month whose exact day Sessionize does not publish. */
export const DONE_EVENTS = new Set<string>(['next.app devCon']);

/** True until the event's day (or the end of its month when the day is unknown). */
export function isUpcoming(e: SpeakingEvent, now = new Date()): boolean {
  if (DONE_EVENTS.has(e.name)) return false;
  const [y, m] = e.date.split('-').map(Number);
  const day = e.day ?? EVENT_DAYS[e.name];
  const end = day ? new Date(y, m - 1, day, 23, 59, 59) : new Date(y, m, 0, 23, 59, 59);
  return now.getTime() <= end.getTime();
}

/** The soonest event still ahead, if any. */
export function nextEvent(list: SpeakingEvent[], now = new Date()): SpeakingEvent | undefined {
  return [...list].filter((e) => isUpcoming(e, now)).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
}
export type Talk = SessionizeSession;

export const SESSIONIZE_PROFILE_URL = 'https://sessionize.com/himanshoe';

/**
 * Appearances that are not on the Sessionize profile, maintained by hand in
 * src/content/talks.md. Everything else is fetched from Sessionize.
 */
const parsed = parseTalksMarkdown(talksMarkdown);
export const manualEvents: SpeakingEvent[] = parsed.events;
/** Slides, videos and links keyed by lower-cased event name */
export const eventResources = parsed.resources;

/** Live or snapshot events merged with the manual extras, deduplicated, newest first. */
export function mergeEvents(fetched: SpeakingEvent[]): SpeakingEvent[] {
  const seen = new Set<string>();
  const all: SpeakingEvent[] = [];
  for (const e of [...fetched, ...manualEvents]) {
    const key = `${e.name.toLowerCase()}|${e.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const day = e.day ?? EVENT_DAYS[e.name];
    const extra = eventResources[e.name.toLowerCase()] ?? {};
    all.push({ ...e, ...extra, day, upcoming: isUpcoming({ ...e, day }) || undefined });
  }
  return all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const snapshotData = snapshot as SessionizeData;
export const events: SpeakingEvent[] = mergeEvents(snapshotData.events);
export const talks: Talk[] = snapshotData.sessions;

/** Conferences attended in person (online appearances are listed but not counted). */
export function inPersonCount(list: SpeakingEvent[]): number {
  return list.filter((e) => e.location !== 'Online').length;
}

export function countryCount(list: SpeakingEvent[]): number {
  const set = new Set<string>();
  for (const e of list) {
    if (e.location === 'Online') continue;
    set.add(e.location.split(',').pop()!.trim());
  }
  return set.size;
}

export function formatEventDate(yyyyMm: string): string {
  const [year, month] = yyyyMm.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function groupEventsByYear(list: SpeakingEvent[]): Array<[string, SpeakingEvent[]]> {
  const map = new Map<string, SpeakingEvent[]>();
  for (const e of list) {
    const year = e.date.slice(0, 4);
    map.set(year, [...(map.get(year) ?? []), e]);
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
}
