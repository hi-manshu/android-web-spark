/**
 * Lightweight feature switches.
 *
 * Enable a feature by visiting any page with `?<name>=1` (persists in
 * localStorage), disable with `?<name>=0`. Example:
 *
 *   https://himanshoe.com/projects?showcase=1   → turns the showcase on
 *   https://himanshoe.com/projects?showcase=0   → back to the classic page
 */
export function isFeatureEnabled(name: string, defaultValue = false): boolean {
  if (typeof window === 'undefined') return defaultValue;

  const key = `feature:${name}`;
  const param = new URLSearchParams(window.location.search).get(name);

  if (param !== null) {
    const on = param === '1' || param === 'true';
    try {
      localStorage.setItem(key, on ? '1' : '0');
    } catch {
      // storage unavailable (private mode) — flag still applies for this load
    }
    return on;
  }

  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return stored === '1';
  } catch {
    // ignore
  }

  return defaultValue;
}
