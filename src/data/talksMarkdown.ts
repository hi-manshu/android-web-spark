import type { SpeakingEvent } from './talks';

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', sept: '09', oct: '10', nov: '11', dec: '12',
};

export interface EventResources {
  talk?: string;
  slides?: string;
  video?: string;
  links?: { label: string; url: string }[];
}

/** "22 Oct 2026" or "2026-10-22" -> 22, otherwise undefined. */
export function parseDay(input: string): number | undefined {
  const s = input.trim();
  const m = s.match(/^(\d{1,2})\s+[A-Za-z]+\.?\s+\d{4}$/) ?? s.match(/^\d{4}-\d{1,2}-(\d{1,2})$/);
  return m ? Number(m[1]) : undefined;
}

/** "Nov 2022", "November 2022", "22 Nov 2022" or "2022-11" -> "2022-11". Returns null when unreadable. */
export function parseMonth(input: string): string | null {
  const s = input.trim().replace(/^(\d{1,2})\s+/, '').replace(/^(\d{4})-(\d{1,2})-\d{1,2}$/, '$1-$2');
  const iso = s.match(/^(\d{4})-(\d{1,2})$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}`;
  const words = s.match(/^([A-Za-z]+)\.?\s+(\d{4})$/);
  if (words) {
    const m = MONTHS[words[1].slice(0, 4).toLowerCase()] ?? MONTHS[words[1].slice(0, 3).toLowerCase()];
    if (m) return `${words[2]}-${m}`;
  }
  const reversed = s.match(/^(\d{4})\s+([A-Za-z]+)$/);
  if (reversed) {
    const m = MONTHS[reversed[2].slice(0, 3).toLowerCase()];
    if (m) return `${reversed[1]}-${m}`;
  }
  return null;
}

function parseEventLine(line: string): SpeakingEvent | null {
  const cells = line
    .replace(/^[-*]\s+/, '')
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())
    .filter((c, i) => c !== '' || i < 3);
  if (cells.length < 3) return null;
  const [name, dateText, location, ...rest] = cells;
  const date = parseMonth(dateText);
  if (!name || !date) return null;
  const url = rest.find((c) => /^https?:\/\//i.test(c));
  const upcoming = rest.some((c) => /^upcoming$/i.test(c)) || undefined;
  return { name, date, day: parseDay(dateText), location: location || 'Online', url, upcoming };
}

/**
 * Parse src/content/talks.md.
 *  - list items (`- name | date | location | ...`) anywhere are extra events
 *  - `### Event name` sections with `Key: value` lines are resources for that event
 */
export function parseTalksMarkdown(markdown: string): { events: SpeakingEvent[]; resources: Record<string, EventResources> } {
  const events: SpeakingEvent[] = [];
  const resources: Record<string, EventResources> = {};
  let current: EventResources | null = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      const key = heading[1].toLowerCase();
      current = resources[key] ?? (resources[key] = {});
      continue;
    }
    if (/^##?\s/.test(line)) {
      current = null;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const e = parseEventLine(line);
      if (e) events.push(e);
      continue;
    }
    if (line.startsWith('|') && !/^\|\s*-+/.test(line) && !/^\|\s*name\s*\|/i.test(line)) {
      const e = parseEventLine(line);
      if (e) events.push(e);
      continue;
    }
    if (!current) continue;
    const kv = line.match(/^(Talk|Slides|Video|Link)\s*:\s*(.+)$/i);
    if (!kv) continue;
    const key = kv[1].toLowerCase();
    const value = kv[2].trim();
    if (key === 'talk') current.talk = value;
    else if (key === 'slides') current.slides = value;
    else if (key === 'video') current.video = value;
    else if (key === 'link') {
      const [label, url] = value.includes('|') ? value.split('|').map((s) => s.trim()) : [value, value];
      if (url) (current.links ??= []).push({ label: label || url, url });
    }
  }
  return { events, resources };
}
