import type { Coordinates, Earthquake, EarthquakeWithDistance, Filters } from '../types/DashboardTypes';
const DAY_MS = 24 * 60 * 60 * 1000;

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function withDistance(quakes: Earthquake[], user: Coordinates): EarthquakeWithDistance[] {
  return quakes.map((q) => ({ ...q, distanceKm: haversineKm(user, q) }));
}

export function applyFilters(
  quakes: EarthquakeWithDistance[],
  filters: Filters,
  now: Date,
): EarthquakeWithDistance[] {
  const from = now.getTime() - filters.days * DAY_MS;
  return quakes.filter(
    (q) =>
      new Date(q.time).getTime() >= from &&
      (q.mag ?? 0) >= filters.minMag &&
      (filters.region === 'Todas' || q.region === filters.region) &&
      (!filters.nearMe || q.distanceKm <= filters.radiusKm),
  );
}

export interface KpiSummary {
  total: number;
  avgMag: number | null;
  maxMag: number | null;
  avgDepth: number | null;
  nearest: EarthquakeWithDistance | null;
}

const average = (values: number[]) =>
  values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;

export function computeKpis(quakes: EarthquakeWithDistance[]): KpiSummary {
  const mags = quakes.flatMap((q) => (q.mag === null ? [] : [q.mag]));
  const depths = quakes.flatMap((q) => (q.depth === null ? [] : [q.depth]));
  const nearest = quakes.reduce<EarthquakeWithDistance | null>(
    (best, q) => (best === null || q.distanceKm < best.distanceKm ? q : best),
    null,
  );
  return {
    total: quakes.length,
    avgMag: average(mags),
    maxMag: mags.length ? Math.max(...mags) : null,
    avgDepth: average(depths),
    nearest,
  };
}

export interface DailyCount {
  label: string; // "10 nov"
  count: number;
}

export function countByDay(quakes: Earthquake[], days: number, now: Date): DailyCount[] {
  const fmt = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const buckets = Array.from({ length: days }, (_, i) => {
    const start = end - (days - 1 - i) * DAY_MS;
    return { start, label: fmt.format(new Date(start)).replace('.', ''), count: 0 };
  });
  for (const q of quakes) {
    const t = new Date(q.time).getTime();
    const b = buckets.find((x) => t >= x.start && t < x.start + DAY_MS);
    if (b) b.count += 1;
  }
  return buckets.map(({ label, count }) => ({ label, count }));
}

export interface RegionCount {
  region: string;
  count: number;
}

export function topRegions(quakes: Earthquake[], n = 5): RegionCount[] {
  const counts = new Map<string, number>();
  for (const q of quakes) {
    const r = q.region ?? 'Sin región';
    counts.set(r, (counts.get(r) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function statusShare(quakes: Earthquake[]): { reviewed: number; automatic: number } {
  const reviewed = quakes.filter((q) => q.status === 'reviewed').length;
  return { reviewed, automatic: quakes.length - reviewed };
}

export function regionOptions(quakes: Earthquake[]): string[] {
  return topRegions(quakes, Infinity).map((r) => r.region);
}

export function timeAgo(iso: string, now: Date): string {
  const hours = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 3_600_000));
  if (hours < 1) return 'hace menos de 1 h';
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Guayaquil',
  }).format(new Date(iso));
}

export const fmt1 = (n: number | null) => (n === null ? '—' : n.toFixed(1));
export const fmtKm = (n: number) => `${Math.round(n).toLocaleString('es-EC')} km`;