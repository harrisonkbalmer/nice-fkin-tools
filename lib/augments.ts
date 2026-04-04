// lib/augments.ts
import fs from 'fs';
import path from 'path';

export interface Augment {
  rank: number;
  acronym: string;
  cpu: string;
  cpuRaceQuarterWeighting: string;
  ram: string;
  ramRaceQuarterWeighting: string;
  hydraulic: string;
  hydraulicRaceQuarterWeighting: string;
  chanceNoChance: 'chance' | '100%';
  totalRaceQuarterWeighting: string;
  totalRaceWeight: number;
  avgRaceWeight: number;
}

let augmentsCache: Augment[] | null = null;

export function getAllAugments(): Augment[] {
  if (augmentsCache) return augmentsCache;

  const filePath = path.join(process.cwd(), 'lib/data/augments.csv');
  const csv = fs.readFileSync(filePath, 'utf8');

  const rows = csv.trim().split('\n');
  const headers = rows[0].split(',');

  const data: Augment[] = rows.slice(1).map((row) => {
    const values = row.split(',');
    return {
      rank: parseInt(values[0], 10),
      acronym: values[1],
      cpu: values[2],
      cpuRaceQuarterWeighting: values[3],
      ram: values[4],
      ramRaceQuarterWeighting: values[5],
      hydraulic: values[6],
      hydraulicRaceQuarterWeighting: values[7],
      chanceNoChance: values[8] as 'chance' | '100%',
      totalRaceQuarterWeighting: values[9],
      totalRaceWeight: parseFloat(values[10]),
      avgRaceWeight: parseFloat(values[11]),
    };
  });

  augmentsCache = data;
  return data;
}

// Bonus: quick helper if you ever want top N
export function getTopAugments(count = 20) {
  return getAllAugments().slice(0, count);
}