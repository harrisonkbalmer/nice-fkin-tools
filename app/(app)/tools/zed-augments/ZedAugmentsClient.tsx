'use client';

import { useState, useMemo } from 'react';
import type { Augment, ParsedWeighting } from '@/lib/augments-utils';
import {
  parseWeighting,
  combineWeightings,
  AUGMENT_COLORS,
  AUGMENT_NAMES,
  getTier,
  type AugmentName,
} from '@/lib/augments-utils';

const MAX_WEIGHT_3 = 1.825;
const MAX_QUARTER  = 0.88;

type FilterMode    = 'all' | 'chance' | '100%';
type AugmentOption = AugmentName | 'any';
type SlotCount     = 1 | 2 | 3;
type SlotLabel     = 'CPU' | 'RAM' | 'HYD';

interface SlotEntry {
  slot: SlotLabel;
  augment: string;
  weighting: string;
}

interface ComboRow {
  key: string;
  rank: number;
  acronym: string;
  slotEntries: SlotEntry[];
  total: ParsedWeighting;
  totalWeight: number;
  avgRaceWeight: number;
  chanceNoChance: 'chance' | '100%';
}

// ─── data builders ───────────────────────────────────────────────────────────

function r3(n: number) { return Math.round(n * 1000) / 1000; }

function totalFromParsed(p: ParsedWeighting) {
  return r3(p.quarters.reduce((s, q) => s + q, 0) + p.bonus);
}

function extractSlotData(augments: Augment[]) {
  const cpu = new Map<string, string>();
  const ram = new Map<string, string>();
  const hyd = new Map<string, string>();
  const chanceKeys = new Set<string>();
  for (const aug of augments) {
    cpu.set(aug.cpu, aug.cpuRaceQuarterWeighting);
    ram.set(aug.ram, aug.ramRaceQuarterWeighting);
    hyd.set(aug.hydraulic, aug.hydraulicRaceQuarterWeighting);
    if (aug.chanceNoChance === 'chance') {
      chanceKeys.add(`CPU:${aug.cpu}`);
      chanceKeys.add(`RAM:${aug.ram}`);
      chanceKeys.add(`HYD:${aug.hydraulic}`);
    }
  }
  return { cpu, ram, hyd, chanceKeys };
}

function buildCombos(augments: Augment[], slotCount: SlotCount): ComboRow[] {
  if (slotCount === 3) {
    return augments.map(aug => ({
      key: `3:${aug.rank}`,
      rank: aug.rank,
      acronym: aug.acronym,
      slotEntries: [
        { slot: 'CPU' as SlotLabel, augment: aug.cpu, weighting: aug.cpuRaceQuarterWeighting },
        { slot: 'RAM' as SlotLabel, augment: aug.ram, weighting: aug.ramRaceQuarterWeighting },
        { slot: 'HYD' as SlotLabel, augment: aug.hydraulic, weighting: aug.hydraulicRaceQuarterWeighting },
      ],
      total: parseWeighting(aug.totalRaceQuarterWeighting),
      totalWeight: aug.totalRaceWeight,
      avgRaceWeight: aug.avgRaceWeight,
      chanceNoChance: aug.chanceNoChance,
    }));
  }

  const { cpu, ram, hyd, chanceKeys } = extractSlotData(augments);

  if (slotCount === 1) {
    const rows: ComboRow[] = [];
    const slots: [SlotLabel, Map<string, string>][] = [['CPU', cpu], ['RAM', ram], ['HYD', hyd]];
    for (const [slot, map] of slots) {
      for (const [augName, weighting] of map) {
        const total = parseWeighting(weighting);
        const totalWeight = totalFromParsed(total);
        rows.push({
          key: `1:${slot}:${augName}`,
          rank: 0,
          acronym: augName.charAt(0).toUpperCase(),
          slotEntries: [{ slot, augment: augName, weighting }],
          total,
          totalWeight,
          avgRaceWeight: totalWeight,
          chanceNoChance: chanceKeys.has(`${slot}:${augName}`) ? 'chance' : '100%',
        });
      }
    }
    rows.sort((a, b) => b.totalWeight - a.totalWeight);
    rows.forEach((r, i) => (r.rank = i + 1));
    return rows;
  }

  // slotCount === 2
  const rows: ComboRow[] = [];
  const pairs: [SlotLabel, Map<string, string>, SlotLabel, Map<string, string>][] = [
    ['CPU', cpu, 'RAM', ram],
    ['CPU', cpu, 'HYD', hyd],
    ['RAM', ram, 'HYD', hyd],
  ];
  for (const [slotA, mapA, slotB, mapB] of pairs) {
    for (const [augA, wA] of mapA) {
      for (const [augB, wB] of mapB) {
        const total = combineWeightings([parseWeighting(wA), parseWeighting(wB)]);
        const totalWeight = totalFromParsed(total);
        rows.push({
          key: `2:${slotA}:${augA}:${slotB}:${augB}`,
          rank: 0,
          acronym: `${augA.charAt(0).toUpperCase()}${augB.charAt(0).toUpperCase()}`,
          slotEntries: [
            { slot: slotA, augment: augA, weighting: wA },
            { slot: slotB, augment: augB, weighting: wB },
          ],
          total,
          totalWeight,
          avgRaceWeight: r3(totalWeight / 2),
          chanceNoChance: (chanceKeys.has(`${slotA}:${augA}`) || chanceKeys.has(`${slotB}:${augB}`))
            ? 'chance' : '100%',
        });
      }
    }
  }
  rows.sort((a, b) => b.totalWeight - a.totalWeight);
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

// ─── small reusable pieces ───────────────────────────────────────────────────

function AugmentChip({ name }: { name: string }) {
  const c = AUGMENT_COLORS[name] ?? AUGMENT_COLORS.void;
  return (
    <span className={`px-2.5 py-0.5 rounded-xl text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {name}
    </span>
  );
}

function WeightBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-1.5 bg-border-gray rounded-full overflow-hidden flex-1">
      <div
        className="h-full rounded-full bg-accent-cyan transition-all"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );
}

function QuarterBreakdown({ label, augment, weighting }: { label: string; augment: string; weighting: string }) {
  const parsed = parseWeighting(weighting);
  const c = AUGMENT_COLORS[augment] ?? AUGMENT_COLORS.void;
  const LABELS = ['Q1', 'Q2', 'Q3', 'Q4'];
  return (
    <div className={`rounded-2xl p-4 border ${c.bg} ${c.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-text-secondary font-medium">{label}</span>
        <AugmentChip name={augment} />
      </div>
      <div className="space-y-2">
        {parsed.quarters.map((q, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-text-secondary w-5 shrink-0">{LABELS[i]}</span>
            <div className="h-1.5 bg-black/30 rounded-full flex-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${c.bar}`}
                style={{ width: q > 0 ? `${Math.min((q / MAX_QUARTER) * 100, 100)}%` : '0%' }}
              />
            </div>
            <span className="text-xs font-mono text-text-secondary w-10 text-right">
              {q > 0 ? q.toFixed(3) : '—'}
            </span>
          </div>
        ))}
        {parsed.bonus > 0 && (
          <div className="mt-2 pt-2 border-t border-black/20 flex items-center justify-between">
            <span className="text-xs text-text-secondary">Bonus</span>
            <span className={`text-sm font-mono font-semibold ${c.text}`}>+{parsed.bonus.toFixed(3)}</span>
          </div>
        )}
        {parsed.bonus === 0 && parsed.quarters.every(q => q === 0) && (
          <p className="text-xs text-text-secondary/50 italic">No direct weighting</p>
        )}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function ZedAugmentsClient({ initialAugments }: { initialAugments: Augment[] }) {
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [cpuFilter, setCpuFilter]   = useState<AugmentOption>('any');
  const [ramFilter, setRamFilter]   = useState<AugmentOption>('any');
  const [hydFilter, setHydFilter]   = useState<AugmentOption>('any');
  const [expanded, setExpanded]     = useState<Set<string>>(new Set());
  const [slotCount, setSlotCount]   = useState<SlotCount>(3);

  const allCombos = useMemo(() => buildCombos(initialAugments, slotCount), [initialAugments, slotCount]);
  const maxWeight = MAX_WEIGHT_3 * (slotCount / 3);

  const filtered = useMemo(() => {
    return allCombos.filter(row => {
      if (filterMode !== 'all' && row.chanceNoChance !== filterMode) return false;
      if (cpuFilter !== 'any' && !row.slotEntries.some(e => e.slot === 'CPU' && e.augment === cpuFilter)) return false;
      if (ramFilter !== 'any' && !row.slotEntries.some(e => e.slot === 'RAM' && e.augment === ramFilter)) return false;
      if (hydFilter !== 'any' && !row.slotEntries.some(e => e.slot === 'HYD' && e.augment === hydFilter)) return false;
      return true;
    });
  }, [allCombos, filterMode, cpuFilter, ramFilter, hydFilter]);

  const stats = useMemo(() => {
    const chance     = allCombos.filter(r => r.chanceNoChance === 'chance');
    const guaranteed = allCombos.filter(r => r.chanceNoChance === '100%');
    return {
      total: allCombos.length,
      chanceCount: chance.length,
      guaranteedCount: guaranteed.length,
      bestChance: chance[0],
      bestGuaranteed: guaranteed[0],
    };
  }, [allCombos]);

  const toggleExpand = (key: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });

  const clearFilters = () => { setCpuFilter('any'); setRamFilter('any'); setHydFilter('any'); };
  const hasActiveFilters = cpuFilter !== 'any' || ramFilter !== 'any' || hydFilter !== 'any';

  const selectCls = 'w-full bg-dark-bg border border-border-gray rounded-2xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-pink transition-all';

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">ZED Augments</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          All combos ranked by weighted impact. Data is hypothetical & estimated.
        </p>
      </div>

      {/* Slot count selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-text-secondary">Augment slots:</span>
        <div className="flex bg-dark-card border border-border-gray rounded-2xl p-1">
          {([1, 2, 3] as SlotCount[]).map(n => (
            <button
              key={n}
              onClick={() => { setSlotCount(n); setExpanded(new Set()); }}
              className={`px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
                slotCount === n
                  ? 'bg-accent-pink text-dark-bg shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary">
          {allCombos.length} combos · {slotCount} slot{slotCount !== 1 ? 's' : ''} filled
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-dark-card border border-border-gray rounded-2xl p-4">
          <p className="text-xs text-text-secondary mb-1">Total Combos</p>
          <p className="text-2xl font-mono font-bold text-text-primary">{stats.total}</p>
        </div>
        <div className="bg-dark-card border border-border-gray rounded-2xl p-4">
          <p className="text-xs text-text-secondary mb-1">Chance Combos</p>
          <p className="text-2xl font-mono font-bold text-emerald-400">{stats.chanceCount}</p>
        </div>
        <div className="bg-dark-card border border-border-gray rounded-2xl p-4">
          <p className="text-xs text-text-secondary mb-1">Guaranteed</p>
          <p className="text-2xl font-mono font-bold text-violet-400">{stats.guaranteedCount}</p>
        </div>
        <div className="bg-dark-card border border-border-gray rounded-2xl p-4">
          <p className="text-xs text-text-secondary mb-1">Top Weight</p>
          <p className="text-2xl font-mono font-bold text-accent-cyan">
            {(stats.bestChance ?? stats.bestGuaranteed)?.totalWeight}
          </p>
        </div>
      </div>

      {/* Best-in-class callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {stats.bestChance && (
          <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-2xl font-mono font-bold text-emerald-400">{stats.bestChance.acronym}</div>
            <div>
              <p className="text-xs text-emerald-400 font-medium">Best Chance Combo</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {stats.bestChance.slotEntries.map(e => <AugmentChip key={e.slot} name={e.augment} />)}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-mono font-bold text-text-primary">{stats.bestChance.totalWeight}</p>
              <p className="text-xs text-text-secondary">weight</p>
            </div>
          </div>
        )}
        {stats.bestGuaranteed && (
          <div className="bg-violet-400/5 border border-violet-400/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-2xl font-mono font-bold text-violet-400">{stats.bestGuaranteed.acronym}</div>
            <div>
              <p className="text-xs text-violet-400 font-medium">Best Guaranteed Combo</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {stats.bestGuaranteed.slotEntries.map(e => <AugmentChip key={e.slot} name={e.augment} />)}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-mono font-bold text-text-primary">{stats.bestGuaranteed.totalWeight}</p>
              <p className="text-xs text-text-secondary">weight</p>
            </div>
          </div>
        )}
      </div>

      {/* Augment colour legend */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-text-secondary">Legend:</span>
        {AUGMENT_NAMES.map(name => <AugmentChip key={name} name={name} />)}
      </div>

      {/* Combo finder */}
      <div className="bg-dark-card border border-border-gray rounded-2xl p-4 space-y-3">
        <p className="text-xs text-accent-pink font-medium uppercase tracking-wider">Find My Combo</p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { label: 'CPU', value: cpuFilter, set: setCpuFilter },
              { label: 'RAM', value: ramFilter, set: setRamFilter },
              { label: 'HYD', value: hydFilter, set: setHydFilter },
            ] as { label: string; value: AugmentOption; set: (v: AugmentOption) => void }[]
          ).map(({ label, value, set }) => (
            <div key={label}>
              <p className="text-xs text-text-secondary mb-1">{label}</p>
              <select value={value} onChange={e => set(e.target.value as AugmentOption)} className={selectCls}>
                <option value="any">Any</option>
                {AUGMENT_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-secondary">
            {hasActiveFilters
              ? `${filtered.length} combo${filtered.length !== 1 ? 's' : ''} match`
              : 'Select augments above to filter'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-text-secondary hover:text-accent-pink transition-colors">
              Clear filters ×
            </button>
          )}
        </div>
      </div>

      {/* Mode filter + result count */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex bg-dark-card border border-border-gray rounded-2xl p-1">
          {(['all', 'chance', '100%'] as FilterMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2 text-sm font-medium rounded-[14px] transition-all ${
                filterMode === mode
                  ? 'bg-accent-pink text-dark-bg shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {mode === 'all' ? 'All' : mode === '100%' ? '100% Guaranteed' : 'Chance'}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary">{filtered.length} results</p>
      </div>

      {/* Main list */}
      <div className="space-y-2">
        {filtered.map(row => {
          const isExpanded = expanded.has(row.key);
          const tier       = getTier(row.totalWeight);
          const QUARTERS   = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
          const gridCols   =
            row.slotEntries.length === 1 ? 'grid-cols-1 sm:grid-cols-2' :
            row.slotEntries.length === 2 ? 'grid-cols-1 sm:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

          return (
            <div key={row.key} className="bg-dark-card border border-border-gray rounded-3xl overflow-hidden">

              {/* Clickable row */}
              <div
                onClick={() => toggleExpand(row.key)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-white/2 transition-colors"
              >
                {/* Rank + Tier */}
                <div className="flex items-center gap-2 shrink-0 sm:w-24">
                  <div className="w-7 h-7 bg-accent-pink text-dark-bg rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                    {row.rank}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${tier.text} ${tier.bg} ${tier.border}`}>
                    {tier.label}
                  </span>
                </div>

                {/* Acronym + slot-labelled augment chips */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="font-bold text-lg text-text-primary font-mono w-10 shrink-0">
                    {row.acronym}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {row.slotEntries.map(e => (
                      <div key={e.slot} className="flex items-center gap-1">
                        <span className="text-xs text-text-secondary/60">{e.slot}</span>
                        <AugmentChip name={e.augment} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Mini quarter column chart */}
                  <div className="hidden sm:flex items-end gap-0.5 h-6">
                    {row.total.quarters.map((q, i) => (
                      <div
                        key={i}
                        title={`${QUARTERS[i]}: ${q}`}
                        className="w-2 rounded-sm bg-accent-cyan transition-all"
                        style={{
                          height: q > 0 ? `${Math.max(Math.round((q / MAX_QUARTER) * 24), 3)}px` : '3px',
                          opacity: q > 0 ? 1 : 0.2,
                        }}
                      />
                    ))}
                    {row.total.bonus > 0 && (
                      <div
                        title={`Bonus: ${row.total.bonus}`}
                        className="w-2 rounded-sm bg-accent-pink ml-0.5"
                        style={{ height: '24px' }}
                      />
                    )}
                  </div>

                  {/* Total weight */}
                  <div className="text-right min-w-13">
                    <div className="text-lg font-mono font-semibold text-text-primary leading-tight">
                      {row.totalWeight}
                    </div>
                    <div className="text-xs text-text-secondary">
                      avg {row.avgRaceWeight.toFixed(3)}
                    </div>
                  </div>

                  {/* Chance / 100% badge */}
                  <div className={`text-xs font-medium px-3 py-1 rounded-xl whitespace-nowrap border ${
                    row.chanceNoChance === '100%'
                      ? 'bg-violet-400/10 text-violet-400 border-violet-400/20'
                      : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                  }`}>
                    {row.chanceNoChance === '100%' ? '100%' : 'CHANCE'}
                  </div>

                  {/* Chevron */}
                  <div className={`text-text-secondary text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-4 border-t border-border-gray space-y-4">

                  {/* Overall weight bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary shrink-0 w-24">Total Weight</span>
                    <WeightBar value={row.totalWeight} max={maxWeight} />
                    <span className="text-xs font-mono text-text-primary w-10 text-right">
                      {row.totalWeight}
                    </span>
                  </div>

                  {/* Per-slot breakdowns + combined profile */}
                  <div className={`grid ${gridCols} gap-3`}>
                    {row.slotEntries.map(e => (
                      <QuarterBreakdown key={e.slot} label={e.slot} augment={e.augment} weighting={e.weighting} />
                    ))}

                    {/* Combined quarter profile — always last column */}
                    <div className="bg-black/30 rounded-2xl p-4 border border-border-gray flex flex-col">
                      <p className="text-xs text-text-secondary font-medium mb-3">Combined Profile</p>
                      <div className="flex items-end gap-1.5 flex-1 min-h-20">
                        {row.total.quarters.map((q, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div
                              className="w-full rounded-sm bg-accent-cyan"
                              style={{
                                height: q > 0 ? `${Math.max(Math.round((q / MAX_QUARTER) * 64), 4)}px` : '4px',
                                opacity: q > 0 ? 1 : 0.15,
                              }}
                            />
                            <span className="text-xs text-text-secondary">{QUARTERS[i]}</span>
                          </div>
                        ))}
                        {row.total.bonus > 0 && (
                          <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                            <div className="w-full rounded-sm bg-accent-pink" style={{ height: '64px' }} />
                            <span className="text-xs text-accent-pink">+{row.total.bonus.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chance note */}
                  {row.chanceNoChance === 'chance' && (
                    <p className="text-xs text-emerald-400/70 text-center">
                      Bonus activation is probabilistic — weight reflects expected value, not a guarantee.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-secondary">No combos match your filters.</div>
      )}
    </div>
  );
}
