import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Social cards for crawlers. vercel.json routes known bots here so links shared on
 * X, LinkedIn, Slack and the like get a page-specific title, description and image.
 * Humans never hit this; the SPA serves them.
 */
const SITE = 'https://himanshoe.com';

const PAGES: Record<string, { title: string; description: string; image: string }> = {
  '/': { title: 'Himanshu Singh — Android developer, speaker, maintainer', description: 'Google Developer Expert for Android in Berlin. Krate, Charty and Kalendar maintainer, speaker at droidcon and DevFest.', image: 'home' },
  '/talks': { title: 'Talks — Himanshu Singh', description: 'Where the talks took me: conferences, routes from Bangalore and Berlin, slides and recordings.', image: 'talks' },
  '/about': { title: 'About — Himanshu Singh', description: 'Android developer, speaker and open source maintainer based in Berlin.', image: 'about' },
  '/projects': { title: 'Projects — Himanshu Singh', description: 'Open source libraries and apps for Android and Kotlin, live from GitHub.', image: 'projects' },
  '/docs': { title: 'Documentation — Himanshu Singh', description: 'Guides and API references for Krate, Charty and Kalendar.', image: 'docs' },
  '/contact': { title: 'Contact — Himanshu Singh', description: 'Email, speaking invitations, consulting and open source questions.', image: 'contact' },
  '/blog': { title: 'Writing — Himanshu Singh', description: 'Notes on Android, Kotlin and maintaining open source.', image: 'blog' },
  '/speaker-kit': { title: 'Speaker kit — Himanshu Singh', description: 'Bios, photos, topics and track record for event organisers.', image: 'speaker-kit' },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', SITE);
  const path = (url.searchParams.get('path') ?? '/').replace(/\/$/, '') || '/';
  const page = PAGES[path] ?? (path.startsWith('/blog/') ? PAGES['/blog'] : path.startsWith('/docs/') ? PAGES['/docs'] : PAGES['/']);
  const canonical = `${SITE}${path === '/' ? '' : path}`;
  const image = `${SITE}/og/${page.image}.png`;
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.setHeader('cache-control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.statusCode = 200;
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Himanshu Singh">
<meta property="og:url" content="${canonical}"><meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}"><meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@hi_man_shoe">
<meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${image}">
<meta http-equiv="refresh" content="0;url=${canonical}">
</head><body><a href="${canonical}">${esc(page.title)}</a></body></html>`);
}
