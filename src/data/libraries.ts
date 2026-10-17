/** Where each library's documentation lives. External URLs open in a new tab. */
export const DOCS_LINKS: Record<string, string> = {
  krate: '/docs/krate',
  charty: 'https://hi-manshu.github.io/charty/',
  kalendar: 'https://hi-manshu.github.io/kalendar/',
};

export function docsLink(name: string): string | undefined {
  return DOCS_LINKS[name.toLowerCase()];
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
