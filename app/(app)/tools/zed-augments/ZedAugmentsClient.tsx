'use client';

import { useState } from 'react';
import { type Augment } from '@/lib/augments';

export default function ZedAugmentsClient({ initialAugments }: { initialAugments: Augment[] }) {
  const [filter, setFilter] = useState<'all' | 'chance' | '100%'>('all');

  const filteredAugments = initialAugments.filter((aug) => {
    if (filter === 'all') return true;
    return aug.chanceNoChance === filter;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">ZED Augments</h1>
          <p className="text-xs">Best combos ranked by weighted impact & chance.</p>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex bg-dark-card border border-border-gray rounded-2xl p-1 w-full sm:w-auto">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
            filter === 'all' ? 'bg-accent-pink text-dark-bg shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('100%')}
          className={`flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
            filter === '100%' ? 'bg-accent-pink text-dark-bg shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          100% Usage
        </button>
        <button
          onClick={() => setFilter('chance')}
          className={`flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
            filter === 'chance' ? 'bg-accent-pink text-dark-bg shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Chance Usage
        </button>
      </div>

      {/* Vertical Leaderboard */}
      <div className="space-y-3">
        <h2 className="text-sm text-accent-pink mb-2">
          Top Augment Combos • {filteredAugments.length} results
        </h2>

        {filteredAugments.map((aug) => (
          <div
            key={aug.rank}
            className="bg-dark-card border border-border-gray rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* Left: Rank + Acronym */}
            <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
              <div className="w-8 h-8 bg-accent-pink text-dark-bg rounded-2xl flex items-center justify-center font-bold text-sm">
                {aug.rank}
              </div>
              <div className="font-semibold text-xl text-text-primary">{aug.acronym}</div>
              <div className="text-xs text-text-secondary hidden sm:block">/125</div>
            </div>

            {/* Middle: Components - single line on desktop, stacked on mobile */}
            <div className="flex-1 grid grid-cols-3 gap-4 text-sm min-w-0">
              <div>
                <span className="text-text-secondary text-xs">CPU</span>
                <p className="text-text-primary truncate">{aug.cpu}</p>
              </div>
              <div>
                <span className="text-text-secondary text-xs">RAM</span>
                <p className="text-text-primary truncate">{aug.ram}</p>
              </div>
              <div>
                <span className="text-text-secondary text-xs">HYD</span>
                <p className="text-text-primary truncate">{aug.hydraulic}</p>
              </div>
            </div>

            {/* Right: Chance + Weight */}
            <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
              <div
                className={`text-xs font-medium px-4 py-1.5 rounded-2xl whitespace-nowrap ${
                  aug.chanceNoChance === 'chance'
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-rose-400/10 text-rose-400'
                }`}
              >
                {aug.chanceNoChance === '100%' ? '100%' : 'CHANCE'}
              </div>

              <div className="text-right">
                <div className="text-xl font-mono font-semibold text-text-primary">
                  {aug.totalRaceWeight}
                </div>
                <div className="text-xs text-text-secondary">avg {aug.avgRaceWeight}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-secondary text-center">
        All data regarding augments is hypothetical, estimated & not liable to blame.
      </p>
    </div>
  );
}