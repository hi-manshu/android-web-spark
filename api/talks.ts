import type { IncomingMessage, ServerResponse } from 'http';
import { parseSessionize, PROFILE_URL, FETCH_HEADERS } from '../shared/sessionize';

/**
 * Vercel serverless function: live talks from Sessionize.
 * Cached at the edge for an hour; the client falls back to the build snapshot if this fails.
 */
export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const r = await fetch(PROFILE_URL, { headers: FETCH_HEADERS });
    if (!r.ok) throw new Error(`Sessionize responded ${r.status}`);
    const data = parseSessionize(await r.text(), PROFILE_URL);
    if (data.events.length === 0) throw new Error('Parsed zero events');
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'fetch failed' }));
  }
}
