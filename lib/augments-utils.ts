// Pure utilities + types (safe to import in Client Components)

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

export interface ParsedWeighting {
  quarters: [number, number, number, number];
  bonus: number;
  raw: string;
}

export const AUGMENT_NAMES = ['gxcore', 'crimson', 'midnight', 'darklight', 'void'] as const;
export type AugmentName = typeof AUGMENT_NAMES[number];

// Each augment type's colour palette — full strings so Tailwind JIT picks them up
export const AUGMENT_COLORS: Record<string, { text: string; bg: string; border: string; bar: string }> = {
  gxcore:    { text: 'text-cyan-400',      bg: 'bg-cyan-400/15',      border: 'border-cyan-400/30',      bar: 'bg-cyan-400' },
  crimson:   { text: 'text-red-400',       bg: 'bg-red-400/15',       border: 'border-red-400/30',       bar: 'bg-red-400' },
  midnight:  { text: 'text-amber-400',     bg: 'bg-amber-400/15',     border: 'border-amber-400/30',     bar: 'bg-amber-400' },
  darklight: { text: 'text-[#87A878]',     bg: 'bg-[#87A878]/15',     border: 'border-[#87A878]/30',     bar: 'bg-[#87A878]' },
  void:      { text: 'text-violet-400',    bg: 'bg-violet-400/15',    border: 'border-violet-400/30',    bar: 'bg-violet-400' },
};

export function getTier(weight: number): { label: string; text: string; bg: string; border: string } {
  if (weight >= 1.4) return { label: 'S', text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' };
  if (weight >= 1.0) return { label: 'A', text: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/30' };
  if (weight >= 0.7) return { label: 'B', text: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/30' };
  if (weight >= 0.4) return { label: 'C', text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' };
  return               { label: 'D', text: 'text-slate-400',  bg: 'bg-slate-400/10',  border: 'border-slate-400/30' };
}

export function parseWeighting(str: string): ParsedWeighting {
  const raw = str;
  const match = str.match(/^(.*?)\((.*?)\)$/);

  if (!match) {
    const nums = str.split('/').map(n => parseFloat(n.trim()) || 0);
    return {
      quarters: [nums[0] || 0, nums[1] || 0, nums[2] || 0, nums[3] || 0] as [number, number, number, number],
      bonus: 0,
      raw,
    };
  }

  const [, quartersStr, bonusStr] = match;
  const quarters = quartersStr.split('/').map(n => parseFloat(n.trim()) || 0) as [number, number, number, number];
  const bonus = parseFloat(bonusStr.trim()) || 0;

  return { quarters, bonus, raw };
}

export function combineWeightings(items: ParsedWeighting[]): ParsedWeighting {
  if (items.length === 0) return { quarters: [0, 0, 0, 0], bonus: 0, raw: '' };

  const quartersSum = items.reduce(
    (acc, item) => acc.map((val, i) => val + (item.quarters[i] || 0)) as [number, number, number, number],
    [0, 0, 0, 0] as [number, number, number, number]
  );

  return {
    quarters: quartersSum,
    bonus: items.reduce((sum, item) => sum + item.bonus, 0),
    raw: items.map(i => i.raw).join(' + '),
  };
}

export function formatWeighting(parsed: ParsedWeighting): string {
  const qStr = parsed.quarters
    .map(q => q.toFixed(3).replace(/\.?0+$/, '') || '0')
    .join('/');
  const bonusPart = parsed.bonus !== 0 ? `(${parsed.bonus.toFixed(3)})` : '';
  return `${qStr}${bonusPart}`;
}
