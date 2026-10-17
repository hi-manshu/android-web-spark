/**
 * Parser for a public Sessionize speaker profile page.
 * Used by scripts/fetch-talks.ts (build-time snapshot) and api/talks.ts (live).
 * Sessionize has no public JSON for speaker profiles, so this reads the HTML.
 */

export interface SessionizeEvent {
  name: string;
  /** YYYY-MM */
  date: string;
  location: string;
  url?: string;
  upcoming?: boolean;
}

export interface SessionizeSession {
  title: string;
  summary: string;
  url: string;
}

export interface SessionizeData {
  fetchedAt: string;
  profileUrl: string;
  events: SessionizeEvent[];
  sessions: SessionizeSession[];
}

const MONTHS: Record<string, string> = {
  january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
  july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
};

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function text(fragment: string): string {
  return decode(fragment.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

/** "2025 | Berlin | droidcon" -> "droidcon Berlin 2025"; "Devfest" -> "DevFest" */
export function normaliseEventName(name: string): string {
  const m = name.match(/^(\d{4})\s*\|\s*(.+?)\s*\|\s*droidcon$/i);
  if (m) return `droidcon ${m[2]} ${m[1]}`;
  return name.replace(/\bDevfest\b/g, 'DevFest').trim();
}

export function parseSessionize(html: string, profileUrl: string): SessionizeData {
  const events: SessionizeEvent[] = [];
  const blocks = html.split('<div class="c-s-event">').slice(1);
  for (const raw of blocks) {
    const block = raw.slice(0, 2500);
    const anchor = block.match(/class="c-s-event__name"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const title = anchor
      ? decode(anchor[2]).trim()
      : text(block.match(/<h3 class="c-s-event__title">([\s\S]*?)<\/h3>/)?.[1] ?? '').split('\n')[0];
    if (!title) continue;
    const plain = text(block.replace(/<svg[\s\S]*?<\/svg>/g, ''));
    const dateMatch = plain.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/);
    if (!dateMatch) continue;
    const date = `${dateMatch[2]}-${MONTHS[dateMatch[1].toLowerCase()]}`;
    const after = plain.slice(plain.indexOf(dateMatch[0]) + dateMatch[0].length);
    const location =
      after
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !/^Sessionize Event$/i.test(l) && !/^Upcoming$/i.test(l))[0] ?? 'Online';
    events.push({
      name: normaliseEventName(title),
      date,
      location: location.replace(/, United States$/, ', USA').replace(/^San Francisco, California, USA$/, 'San Francisco, USA'),
      url: anchor ? anchor[1].replace(/^http:\/\//, 'https://') : undefined,
      upcoming: /\bUpcoming\b/.test(plain) || undefined,
    });
  }

  const sessions: SessionizeSession[] = [];
  const sessionBlocks = html.split('<div class="c-s-session">').slice(1);
  for (const raw of sessionBlocks) {
    const block = raw.slice(0, 6000);
    const a = block.match(/<h3 class="c-s-session__title">\s*<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!a) continue;
    const summaryHtml = block.match(/<p class="c-s-session__summary">([\s\S]*?)<\/p>/)?.[1] ?? '';
    const summary = text(summaryHtml).split('\n')[0].slice(0, 220);
    const url = a[1].startsWith('http') ? a[1] : `https://sessionize.com${a[1]}`;
    const title = decode(a[2]).trim();
    if (!sessions.some((s) => s.title === title)) sessions.push({ title, summary, url });
  }

  // newest first
  events.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
  return { fetchedAt: new Date().toISOString(), profileUrl, events, sessions };
}

export const PROFILE_URL = 'https://sessionize.com/himanshoe';
export const FETCH_HEADERS = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 himanshoe.com',
  accept: 'text/html',
};
