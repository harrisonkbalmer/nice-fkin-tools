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
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
        allRaces.push(...(parsed.data as ZedRace[]));
      } catch (_) {}
    })
  );

  return allRaces.filter(r => 
    typeof r.finish_time === 'number' && r.finish_time > 35 && r.finish_position
  );
}