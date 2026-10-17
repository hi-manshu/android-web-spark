/** Coordinates for the places on the talks timeline, plus the two home bases. */

export interface LatLon {
  lat: number;
  lon: number;
}

export const HOMES: { from: number; name: string; city: string; pos: LatLon }[] = [
  { from: 0, name: 'Bangalore', city: 'Bengaluru', pos: { lat: 12.97, lon: 77.59 } },
  { from: 2021, name: 'Berlin', city: 'Berlin', pos: { lat: 52.52, lon: 13.4 } },
];

export function homeFor(year: number) {
  return [...HOMES].reverse().find((h) => year >= h.from) ?? HOMES[0];
}

export const CITY_COORDS: Record<string, LatLon> = {
  Lisbon: { lat: 38.72, lon: -9.14 },
  Berlin: { lat: 52.52, lon: 13.4 },
  Bengaluru: { lat: 12.97, lon: 77.59 },
  Bangalore: { lat: 12.97, lon: 77.59 },
  Catania: { lat: 37.5, lon: 15.09 },
  Milan: { lat: 45.46, lon: 9.19 },
  Stockholm: { lat: 59.33, lon: 18.07 },
  Warsaw: { lat: 52.23, lon: 21.01 },
  Tbilisi: { lat: 41.72, lon: 44.83 },
  Nairobi: { lat: -1.29, lon: 36.82 },
  London: { lat: 51.51, lon: -0.13 },
  Cairo: { lat: 30.04, lon: 31.24 },
  'San Francisco': { lat: 37.77, lon: -122.42 },
  Hamburg: { lat: 53.55, lon: 9.99 },
  'New Delhi': { lat: 28.61, lon: 77.21 },
  Ahmedabad: { lat: 23.02, lon: 72.57 },
  Vadodara: { lat: 22.31, lon: 73.18 },
  Amsterdam: { lat: 52.37, lon: 4.9 },
  Paris: { lat: 48.86, lon: 2.35 },
  Munich: { lat: 48.14, lon: 11.58 },
  Zurich: { lat: 47.38, lon: 8.54 },
  Vienna: { lat: 48.21, lon: 16.37 },
  Prague: { lat: 50.08, lon: 14.44 },
  Barcelona: { lat: 41.39, lon: 2.17 },
  Madrid: { lat: 40.42, lon: -3.7 },
  Dublin: { lat: 53.35, lon: -6.26 },
  Copenhagen: { lat: 55.68, lon: 12.57 },
  Oslo: { lat: 59.91, lon: 10.75 },
  Helsinki: { lat: 60.17, lon: 24.94 },
  Istanbul: { lat: 41.01, lon: 28.98 },
  Dubai: { lat: 25.2, lon: 55.27 },
  Singapore: { lat: 1.35, lon: 103.82 },
  Mumbai: { lat: 19.08, lon: 72.88 },
  Hyderabad: { lat: 17.39, lon: 78.49 },
  Pune: { lat: 18.52, lon: 73.86 },
  Chennai: { lat: 13.08, lon: 80.27 },
  Kolkata: { lat: 22.57, lon: 88.36 },
  'New York': { lat: 40.71, lon: -74.01 },
  Toronto: { lat: 43.65, lon: -79.38 },
  Lagos: { lat: 6.52, lon: 3.38 },
};

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function haversine(a: LatLon, b: LatLon): number {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Points along the great circle from a to b (inclusive), as lat/lon. */
export function greatCircle(a: LatLon, b: LatLon, steps = 48): LatLon[] {
  const φ1 = rad(a.lat), λ1 = rad(a.lon), φ2 = rad(b.lat), λ2 = rad(b.lon);
  const d = 2 * Math.asin(Math.sqrt(Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2));
  if (d === 0) return [a, b];
  const pts: LatLon[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    pts.push({ lat: (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI, lon: (Math.atan2(y, x) * 180) / Math.PI });
  }
  return pts;
}
