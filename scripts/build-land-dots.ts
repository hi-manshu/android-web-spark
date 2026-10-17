import { writeFile } from 'fs/promises';

/**
 * One-off: sample Natural Earth 110m land polygons into a dot grid for the
 * travel map. Output: src/data/landDots.json as [[lon, lat], ...].
 * Re-run with `npm run build-land` if the crop box or density changes.
 */
const SRC = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';
// Crop box (lon/lat) covering every city visited, with some air around it
export const BOX = { lonMin: -135, lonMax: 105, latMin: -42, latMax: 72 };
const STEP = 1.5;

type Ring = [number, number][];

function inRing(pt: [number, number], ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const hit = yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function inPolygon(pt: [number, number], rings: Ring[]): boolean {
  if (!inRing(pt, rings[0])) return false;
  for (let k = 1; k < rings.length; k++) if (inRing(pt, rings[k])) return false;
  return true;
}

const res = await fetch(SRC);
if (!res.ok) throw new Error(`land geojson ${res.status}`);
const geo = (await res.json()) as { features: { geometry: { type: string; coordinates: unknown } }[] };

const polygons: Ring[][] = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (g.type === 'Polygon') polygons.push(g.coordinates as Ring[]);
  else if (g.type === 'MultiPolygon') for (const p of g.coordinates as Ring[][]) polygons.push(p);
}

const dots: [number, number][] = [];
for (let lat = BOX.latMax; lat >= BOX.latMin; lat -= STEP) {
  // offset every other row for a nicer grid
  const shift = Math.round(lat / STEP) % 2 === 0 ? 0 : STEP / 2;
  for (let lon = BOX.lonMin + shift; lon <= BOX.lonMax; lon += STEP) {
    const pt: [number, number] = [lon, lat];
    if (polygons.some((p) => inPolygon(pt, p))) dots.push([Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
  }
}

const out = new URL('../src/data/landDots.json', import.meta.url).pathname;
await writeFile(out, JSON.stringify({ box: BOX, step: STEP, dots }));
console.log(`build-land: ${dots.length} land dots → ${out.split('/').pop()}`);
