// lib/get-zed-races.ts
import Papa from 'papaparse';

const BASE_URL = 'https://raw.githubusercontent.com/myblood-tempest/zed-champions-race-data/refs/heads/main';

export interface ZedRace {
  race_id: string;
  race_name?: string;
  race_date: string;
  stable_name: string;
  horse_name: string;
  bloodline: string;
  finish_time?: number;
  finish_position?: number;
  state?: string;
  rating?: number;
}

export async function getZedRaces(month: string = '2026-03'): Promise<ZedRace[]> {
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const allRaces: ZedRace[] = [];

  await Promise.all(
    days.map(async (day) => {
      const url = `${BASE_URL}/${month}/races_${month}-${day}.csv`;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
        for (const row of parsed.data) {
          allRaces.push({
            race_id: row.race_id as string,
            race_name: row.race_name as string | undefined,
            race_date: row.race_date as string,
            stable_name: row.stable_name as string,
            horse_name: row.horse_name as string,
            bloodline: row.bloodline as string,
            finish_time: row.finish_time as number | undefined,
            finish_position: row.finish_position as number | undefined,
            state: row.state as string | undefined,
            rating: row.rating as number | undefined,
          });
        }
      } catch (_) {}
    })
  );

  return allRaces.filter(r => 
    typeof r.finish_time === 'number' && r.finish_time > 35 && r.finish_position
  );
}