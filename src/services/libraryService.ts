import { useQuery } from '@tanstack/react-query';

export interface LibraryMeta {
  /** latest release tag without a leading "v" */
  version?: string;
  stars?: number;
}

const GH = 'https://api.github.com/repos';

/** Latest release tag and star count for a repository. Fails soft: missing fields stay undefined. */
export async function fetchLibraryMeta(repo: string): Promise<LibraryMeta> {
  const meta: LibraryMeta = {};
  try {
    const r = await fetch(`${GH}/${repo}`);
    if (r.ok) {
      const j = await r.json();
      meta.stars = j.stargazers_count;
    }
  } catch {
    /* offline or rate limited */
  }
  try {
    const r = await fetch(`${GH}/${repo}/releases/latest`);
    if (r.ok) {
      const j = await r.json();
      meta.version = String(j.tag_name ?? '').replace(/^v/i, '') || undefined;
    } else {
      const t = await fetch(`${GH}/${repo}/tags?per_page=1`);
      if (t.ok) {
        const j = await t.json();
        meta.version = String(j[0]?.name ?? '').replace(/^v/i, '') || undefined;
      }
    }
  } catch {
    /* ignore */
  }
  return meta;
}

export function useLibraryMeta(repo: string, fallback: LibraryMeta = {}) {
  const q = useQuery({
    queryKey: ['library-meta', repo],
    queryFn: () => fetchLibraryMeta(repo),
    staleTime: 60 * 60 * 1000,
    retry: 0,
  });
  return {
    version: q.data?.version ?? fallback.version,
    stars: q.data?.stars ?? fallback.stars,
    isLive: Boolean(q.data?.version),
  };
}
