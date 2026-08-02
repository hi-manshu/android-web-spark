import { mkdir, writeFile, readFile } from "fs/promises";
import { join, dirname } from "path";

// Load .env manually — no external deps needed
try {
  const env = await readFile(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {
  // .env is optional
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Fetch docs/ from source repos → src/content/docs/{library}
const DOCS_SOURCES: { repo: string; branch: string; outDir: string }[] = [
  {
    repo: "hi-manshu/charty",
    branch: "main",
    outDir: "src/content/docs/charty",
  },
  {
    repo: "hi-manshu/kalendar",
    branch: "main",
    outDir: "src/content/docs/kalendar",
  },
  {
    repo: "hi-manshu/krate",
    branch: "main",
    outDir: "src/content/docs/krate",
  },
];

// Fetch entire subdirectories as static websites → public/{name}
const WEBSITE_SOURCES: { repo: string; branch: string; outDir: string; srcDir: string }[] = [];

const ROOT = new URL("..", import.meta.url).pathname;

function githubHeaders(): HeadersInit {
  return GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};
}

interface GithubFile {
  type: "file" | "dir";
  name: string;
  path: string;
  download_url: string | null;
}

async function listDir(repo: string, branch: string, dir: string): Promise<GithubFile[]> {
  const url = `https://api.github.com/repos/${repo}/contents/${dir}?ref=${branch}`;
  const res = await fetch(url, { headers: githubHeaders() });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);

  return res.json() as Promise<GithubFile[]>;
}

const SKIP_DIRS = new Set([".git", "node_modules", ".github"]);

async function fetchAll(
  repo: string,
  branch: string,
  dir: string,
  mdOnly: boolean,
): Promise<{ path: string; url: string }[]> {
  const entries = await listDir(repo, branch, dir);
  if (entries.length === 0) return [];

  const files: { path: string; url: string }[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.type === "dir") {
        if (SKIP_DIRS.has(entry.name)) return;
        const nested = await fetchAll(repo, branch, entry.path, mdOnly);
        files.push(...nested);
      } else if (entry.download_url) {
        if (mdOnly && !entry.name.endsWith(".md")) return;
        files.push({ path: entry.path, url: entry.download_url });
      }
    })
  );

  return files;
}

async function writeFile_(outDir: string, repoPath: string, stripPrefix: string, content: string) {
  const relative = stripPrefix ? repoPath.replace(new RegExp(`^${stripPrefix}/?`), "") : repoPath;
  const dest = join(ROOT, outDir, relative);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, content, "utf8");
}

async function fetchDocs(source: typeof DOCS_SOURCES[number]) {
  const { repo, branch, outDir } = source;

  console.log(`\n[${repo}] Checking docs/ on branch ${branch}…`);
  const files = await fetchAll(repo, branch, "docs", true);

  if (files.length === 0) {
    console.warn(`  ⚠  No docs/ directory found — skipping.`);
    return;
  }

  console.log(`  Found ${files.length} markdown file(s). Downloading…`);

  await Promise.all(
    files.map(async ({ path: repoPath, url }) => {
      const res = await fetch(url, { headers: githubHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      await writeFile_(outDir, repoPath, "docs", await res.text());
      console.log(`  ✓  ${repoPath}`);
    })
  );
}

async function fetchWebsite(source: typeof WEBSITE_SOURCES[number]) {
  const { repo, branch, srcDir, outDir } = source;
  const label = srcDir ? `${repo}/${srcDir}` : repo;

  console.log(`\n[${label}] Fetching website on branch ${branch}…`);
  const files = await fetchAll(repo, branch, srcDir, false);

  if (files.length === 0) {
    console.warn(`  ⚠  No files found — skipping.`);
    return;
  }

  console.log(`  Found ${files.length} file(s). Downloading…`);

  await Promise.all(
    files.map(async ({ path: repoPath, url }) => {
      const res = await fetch(url, { headers: githubHeaders() });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      const body = await res.arrayBuffer();
      const relative = srcDir ? repoPath.replace(new RegExp(`^${srcDir}/?`), "") : repoPath;
      const dest = join(ROOT, outDir, relative);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(body));
      console.log(`  ✓  ${repoPath}`);
    })
  );
}

async function main() {
  console.log("fetch-docs: syncing docs and websites from source repos\n");

  const results = await Promise.allSettled([
    ...DOCS_SOURCES.map(fetchDocs),
    ...WEBSITE_SOURCES.map(fetchWebsite),
  ]);

  let failed = false;
  const allSources = [...DOCS_SOURCES, ...WEBSITE_SOURCES];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`\n[${allSources[i].repo}] Error: ${r.reason}`);
      failed = true;
    }
  });

  if (failed) process.exit(1);
  console.log("\nDone.");
}

main();
