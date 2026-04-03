// lib/get-all-zed-races.ts
import Papa from 'papaparse';
import type { ZedRace } from './get-zed-races';

const BASE_URL = 'https://raw.githubusercontent.com/myblood-tempest/zed-champions-race-data/refs/heads/main';

const ALL_MONTHS = [
  '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09',
  '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03',
  // Add future months here when they appear in the repo
];

export async function getAllZedRaces(): Promise<ZedRace[]> {
  const allRaces: ZedRace[] = [];

  console.log(`[ZED] Fetching ALL-TIME data from ${ALL_MONTHS.length} months...`);

  // Fetch every month in parallel (fast enough for this use case)
  await Promise.all(
    ALL_MONTHS.map(async (month) => {
      const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

      await Promise.all(
        days.map(async (day) => {
          const url = `${BASE_URL}/${month}/races_${month}-${day}.csv`;
          try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return;
            const text = await res.text();
            const parsed = Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              dynamicTyping: true,
            });
            allRaces.push(...(parsed.data as ZedRace[]));
          } catch (_) {}
        })
      );
    })
  );

  const filtered = allRaces.filter(
    (r) =>
      typeof r.finish_time === 'number' &&
      r.finish_time > 35 &&
      r.finish_position
  );

  console.log(`[ZED] All-time data loaded — ${filtered.length} valid races`);
  return filtered;
}