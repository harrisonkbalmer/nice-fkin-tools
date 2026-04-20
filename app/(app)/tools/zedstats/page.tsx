'use client';

import { useState, useEffect } from 'react';
import type { ZedRace } from '@/lib/get-zed-races';
import Footer from '@/app/components/footer';

const months = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2025-12', label: 'December 2025' },
  { value: '2025-11', label: 'November 2025' },
  { value: '2025-10', label: 'October 2025' },
  { value: '2025-09', label: 'September 2025' },
  { value: '2025-08', label: 'August 2025' },
  { value: '2025-07', label: 'July 2025' },
  { value: '2025-06', label: 'June 2025' },
  { value: '2025-05', label: 'May 2025' },
  { value: '2025-04', label: 'April 2025' },
];

export default function ZedStats() {
  const [viewMode, setViewMode] = useState<'month' | 'alltime'>('month');
  const [month, setMonth] = useState('2026-04');
  const [races, setRaces] = useState<ZedRace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const url = viewMode === 'alltime'
        ? '/api/zed/races?mode=alltime'
        : `/api/zed/races?month=${month}`;
      const res = await fetch(url);
      const { races } = await res.json();
      setRaces(races);
      setLoading(false);
    };

    fetchData();
  }, [month, viewMode]);

  const validRaces = races.filter(r => typeof r.finish_time === 'number' && r.finish_time > 35 && r.finish_position);

  const fastest = validRaces.reduce((prev, curr) => !prev || curr.finish_time! < prev.finish_time! ? curr : prev, null as ZedRace | null);
  const slowest = validRaces.reduce((prev, curr) => !prev || curr.finish_time! > prev.finish_time! ? curr : prev, null as ZedRace | null);

  const stableStats = validRaces.reduce((acc, race) => {
      const name = race.stable_name;
      if (!acc[name]) acc[name] = { wins: 0, entries: 0 };
      acc[name].entries += 1;
      if (race.finish_position === 1) acc[name].wins += 1;
      return acc;
    }, {} as Record<string, { wins: number; entries: number; winRate?: number }>);   // ← updated type

    Object.keys(stableStats).forEach(key => {
      const s = stableStats[key];
      s.winRate = s.entries > 0 ? Math.round((s.wins / s.entries) * 1000) / 10 : 0;
    });

  const mostWinningStable = Object.entries(stableStats).sort(([,a], [,b]) => b.wins - a.wins)[0];

  const totalRacesCount = new Set(validRaces.map(r => r.race_id)).size;
  const uniqueHorses = new Set(validRaces.map(r => r.horse_name)).size;

  const bloodlineWins = validRaces
    .filter(r => r.finish_position === 1)
    .reduce((acc, r) => { acc[r.bloodline] = (acc[r.bloodline] || 0) + 1; return acc; }, {} as Record<string, number>);

  const bloodlineWinList = Object.entries(bloodlineWins)
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins);

  const bloodlineFastest: Record<string, ZedRace> = {};
  validRaces.forEach(race => {
    const key = race.bloodline;
    if (key && (!bloodlineFastest[key] || race.finish_time! < bloodlineFastest[key].finish_time!)) {
      bloodlineFastest[key] = race;
    }
  });

  const starFastest: Record<string, ZedRace> = {};
  validRaces.forEach(race => {
    const key = race.rating?.toFixed(1) || '';
    if (key && (!starFastest[key] || race.finish_time! < starFastest[key].finish_time!)) {
      starFastest[key] = race;
    }
  });

  const starRatings = ['2.5', '3.0', '3.5', '4.0', '4.5', '5.0'];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-text-primary">
        <p className="text-xl">Loading ZEDSTATS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + Toggle + Month Picker */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">ZED Stats by BES</h1>
          <p className="text-xs">*Data scraped by MyBlood Tempest</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-dark-card border border-border-gray rounded-2xl p-1 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
              viewMode === 'month'
                ? 'bg-accent-pink text-dark-bg shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setViewMode('alltime')}
            className={`flex-1 sm:flex-none px-5 py-2 text-sm font-medium rounded-[14px] transition-all ${
              viewMode === 'alltime'
                ? 'bg-accent-pink text-dark-bg shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Month selector – only visible in month mode */}
        {viewMode === 'month' && (
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="bg-dark-card border border-border-gray rounded-2xl px-5 py-3 text-text-primary font-medium focus:outline-none focus:border-accent-pink w-full sm:w-auto"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* High Achievements */}
      <div>
        <h2 className="text-sm text-accent-pink mb-2">High Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          <div className="bg-dark-card border border-border-gray rounded-3xl p-5">
            <p className="text-emerald-400 text-sm mb-1">Monster</p>
            <p className="text-xl font-mono text-text-primary">{fastest?.finish_time?.toFixed(4) || '—.———'}s</p>
            <p className="text-sm text-text-secondary mt-1 line-clamp-1">{fastest?.horse_name}</p>
            <p className="text-sm text-text-secondary/70">{fastest?.stable_name}</p>
          </div>

          <div className="bg-dark-card border border-border-gray rounded-3xl p-5">
            <p className="text-rose-400 text-sm mb-1">Donkey</p>
            <p className="text-xl font-mono text-text-primary">{slowest?.finish_time?.toFixed(4) || '—.———'}s</p>
            <p className="text-sm text-text-secondary mt-1 line-clamp-1">{slowest?.horse_name}</p>
            <p className="text-sm text-text-secondary/70">{slowest?.stable_name}</p>
          </div>

          <div className="bg-dark-card border border-border-gray rounded-3xl p-5">
            <p className="text-accent-pink text-sm mb-1">Top Stable</p>
            <p className="text-xl font-semibold text-text-primary line-clamp-1">
              {mostWinningStable?.[0] || '—'}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {mostWinningStable?.[1]?.wins || 0} wins{' '}
              <span className="text-accent-pink">({mostWinningStable?.[1]?.winRate || 0}%)</span>
            </p>
          </div>

          <div className="bg-dark-card border border-border-gray rounded-3xl p-5">
            <p className="text-cyan-400 text-sm mb-1">Unique Racers</p>
            <p className="text-xl font-mono text-text-primary">{uniqueHorses}</p>
          </div>

          <div className="bg-dark-card border border-border-gray rounded-3xl p-5">
            <p className="text-amber-400 text-sm mb-1">Total Races</p>
            <p className="text-xl font-mono text-text-primary">{totalRacesCount}</p>
          </div>
        </div>
      </div>

      {/* LEADERBOARDS */}
      <div className="space-y-4">
        {/* Wins by Bloodline */}
        <div>
          <h3 className="text-sm text-accent-pink mb-2">Wins by Bloodline</h3>
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {bloodlineWinList.slice(0, 4).map((item, i) => (
              <div
                key={i}
                className="min-w-[200px] flex-shrink-0 bg-dark-card border border-border-gray rounded-3xl p-5 snap-start"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-pink text-dark-bg rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary text-xl">{item.name}</div>
                    <div className="text-sm text-text-secondary">{item.wins} wins</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fastest Horse by Bloodline */}
        <div>
          <h3 className="text-sm text-accent-pink mb-2">Fastest Horse by Bloodline</h3>
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {Object.entries(bloodlineFastest).map(([bloodline, entry]) => (
              <div
                key={bloodline}
                className="min-w-[220px] flex-shrink-0 bg-dark-card border border-border-gray rounded-3xl p-5 snap-start"
              >
                <div className="text-sm font-medium text-text-secondary mb-1">{bloodline}</div>
                <div className="text-xl font-mono font-semibold text-text-primary mb-2">
                  {entry.finish_time?.toFixed(3)}s
                </div>
                <div className="text-sm text-text-secondary line-clamp-1">{entry.horse_name}</div>
                <div className="text-sm text-text-secondary/70">{entry.stable_name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fastest Horse by Stars */}
        <div>
          <h3 className="text-sm text-accent-pink mb-2">Fastest Horse by Stars</h3>
          <div className="flex gap-2 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {starRatings.map(rating => {
              const entry = starFastest[rating];
              return (
                <div
                  key={rating}
                  className="min-w-[200px] flex-shrink-0 bg-dark-card border border-border-gray rounded-3xl p-5 snap-start"
                >
                  <div className="text-amber-400 font-bold text-xl mb-2">★ {rating}</div>
                  <div className="text-xl font-mono font-semibold text-text-primary mb-2">
                    {entry ? `${entry.finish_time?.toFixed(4)}s` : '—'}
                  </div>
                  <div className="text-sm text-text-secondary line-clamp-1">
                    {entry ? entry.horse_name : 'No data'}
                  </div>
                  <div className="text-sm text-text-secondary/70">
                    {entry ? entry.stable_name : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}