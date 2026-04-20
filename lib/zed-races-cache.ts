import { getAllZedRaces } from './get-all-zed-races';
import { getZedRaces, type ZedRace } from './get-zed-races';

export const CACHE_TAG = 'zed-races';
const FOUR_HOURS = 4 * 60 * 60 * 1000;

interface CacheEntry {
  races: ZedRace[];
  cachedAt: number;
}

// Module-level cache — persists across requests within the same server process.
// No 2MB limit. On Vercel, warm function instances serve from this cache;
// cold starts re-fetch (the cron keeps the all-time + current month warm).
const store = new Map<string, CacheEntry>();

function isStale(entry: CacheEntry): boolean {
  return Date.now() - entry.cachedAt > FOUR_HOURS;
}

export async function getCachedAllRaces(): Promise<{ races: ZedRace[]; cachedAt: number }> {
  const key = 'all';
  const cached = store.get(key);
  if (cached && !isStale(cached)) return cached;

  const races = await getAllZedRaces();
  const entry: CacheEntry = { races, cachedAt: Date.now() };
  store.set(key, entry);
  return entry;
}

export async function getCachedMonthRaces(month: string): Promise<{ races: ZedRace[]; cachedAt: number }> {
  const key = `month-${month}`;
  const cached = store.get(key);
  if (cached && !isStale(cached)) return cached;

  const races = await getZedRaces(month);
  const entry: CacheEntry = { races, cachedAt: Date.now() };
  store.set(key, entry);
  return entry;
}

// Called by the cron endpoint to force-refresh specific keys.
export function bustCache(key?: string): void {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
}
