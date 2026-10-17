import { writeFile } from 'fs/promises';
import { parseSessionize, PROFILE_URL, FETCH_HEADERS } from '../shared/sessionize.ts';

// Snapshot the Sessionize profile → src/data/sessionize.json (runs before every build)
const ROOT = new URL('..', import.meta.url).pathname;
const OUT = `${ROOT}src/data/sessionize.json`;

const res = await fetch(PROFILE_URL, { headers: FETCH_HEADERS });
if (!res.ok) throw new Error(`Sessionize responded ${res.status}`);
const data = parseSessionize(await res.text(), PROFILE_URL);
if (data.events.length === 0) throw new Error('Parsed zero events; the page layout may have changed');

await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
console.log(`fetch-talks: ${data.events.length} events, ${data.sessions.length} sessions → src/data/sessionize.json`);
