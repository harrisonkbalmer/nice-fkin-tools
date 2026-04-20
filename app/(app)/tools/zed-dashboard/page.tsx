// app/tools/zed-vault/page.tsx
'use client';

import type { Metadata } from "next";
import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Icon } from '../../../components/Icon';

type Horse = {
  Name: string;
  Link: string;
  Gen: string;
  Bloodline: string;
  'Complete Rating': string;
  'Speed Rating': string;
  'Sprint Rating': string;
  'Endurance Rating': string;
  'Matchmaking Rating': string;
  'Latest Odds': string;
  'Win Percentage': string;
  'AVG Time': string;
  'Best Time': string;
  'Q1 Pos x/8': string;
  'Q2 Pos x/8': string;
  'Q3 Pos x/8': string;
  'Q4 Pos x/8': string;
};

export default function ZedVaultPage() {
  const [data, setData] = useState<Horse[]>([]);
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [bloodlineFilter, setBloodlineFilter] = useState('all');
  const [minCompleteFilter, setMinCompleteFilter] = useState('all');

  // Load CSV on mount
  useEffect(() => {
    fetch('/horses.csv')
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data as Horse[]);
          },
        });
      });
  }, []);

  // Numeric Value Score (for sorting + display)
  const getNumericValueScore = (h: Horse): number => {
    const mmr = parseFloat(h['Matchmaking Rating']) || 0;
    const complete = parseFloat(h['Complete Rating']) || 1;
    const q1 = parseFloat(h['Q1 Pos x/8']) || 4.5;
    const q2 = parseFloat(h['Q2 Pos x/8']) || 4.5;
    const q3 = parseFloat(h['Q3 Pos x/8']) || 4.5;
    const q4 = parseFloat(h['Q4 Pos x/8']) || 4.5;
    const avgPosition = (q1 + q2 + q3 + q4) / 4;
    return ((mmr * complete) / avgPosition) /10;
  };

  const getValueScore = (h: Horse) => getNumericValueScore(h).toFixed(2);

  // NEW: Average Position helper (exactly what you asked for)
  const getAvgPosition = (h: Horse): string => {
    const q1 = parseFloat(h['Q1 Pos x/8']) || 4.5;
    const q2 = parseFloat(h['Q2 Pos x/8']) || 4.5;
    const q3 = parseFloat(h['Q3 Pos x/8']) || 4.5;
    const q4 = parseFloat(h['Q4 Pos x/8']) || 4.5;
    return ((q1 + q2 + q3 + q4) / 4).toFixed(2);
  };

  // Filtered + Sorted data (highest Value Score first)
  const sortedFilteredData = useMemo(() => {
    let filtered = data.filter(
      (h) =>
        (bloodlineFilter === 'all' || h.Bloodline === bloodlineFilter) &&
        (minCompleteFilter === 'all' ||
          parseFloat(h['Complete Rating'] || '0') >= parseFloat(minCompleteFilter)) &&
        (h.Name.toLowerCase().includes(globalFilter.toLowerCase()) ||
         h.Bloodline.toLowerCase().includes(globalFilter.toLowerCase()))
    );

    filtered.sort((a, b) => getNumericValueScore(b) - getNumericValueScore(a));
    return filtered;
  }, [data, bloodlineFilter, minCompleteFilter, globalFilter]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col mb-10">
        <div className="mb-2">
          <span className="text-3xl font-bold text-accent-pink">ZED Dashboard</span>
        </div>
        <p className="text-lg text-text-secondary max-w-md">
          " Know your horses ... like the back of your hand "
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search horses or bloodlines..."
            className="w-full bg-dark-card border border-border-gray rounded-3xl px-6 py-4 pl-12 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan transition-all"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <Icon name="search" className="w-5 h-5 text-text-secondary" />
          </div>
        </div>

        <select
          value={bloodlineFilter}
          onChange={(e) => setBloodlineFilter(e.target.value)}
          className="bg-dark-card border border-border-gray rounded-3xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-cyan transition-all"
        >
          <option value="all">All Bloodlines</option>
          <option value="NAKAMOTO">NAKAMOTO</option>
          <option value="SZABO">SZABO</option>
          <option value="FINNEY">FINNEY</option>
          <option value="BUTERIN">BUTERIN</option>
        </select>

        <select
          value={minCompleteFilter}
          onChange={(e) => setMinCompleteFilter(e.target.value)}
          className="bg-dark-card border border-border-gray rounded-3xl px-6 py-4 text-text-primary focus:outline-none focus:border-accent-cyan transition-all"
        >
          <option value="all">Any Complete Rating</option>
          <option value="3.0">3.0+</option>
          <option value="3.5">3.5+</option>
          <option value="4.0">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="5.0">5.0+</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-text-secondary text-sm mb-4 pl-1">
        {sortedFilteredData.length} horses • sorted by Value Score ↓
      </div>

      {/* Horse Grid – Odds replaced with Avg Position */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2   ">
        {sortedFilteredData.map((horse, i) => (
          <div
            key={i}
            onClick={() => setSelectedHorse(horse)}
            className="group bg-dark-card border border-border-gray rounded-3xl p-6 hover:border-accent-pink transition-all duration-300 hover:shadow-2xl hover:shadow-accent-pink/10 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-xl text-text-primary">{horse.Name}</p>
                <p className="text-xs text-text-secondary font-mono">Gen {horse.Gen}</p>
              </div>
              <span className="px-4 py-1 text-xs font-medium bg-dark-bg rounded-2xl text-accent-cyan">
                {horse.Bloodline}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-text-secondary text-xs">Complete</p>
                <p className="font-bold text-2xl text-text-primary">{horse['Complete Rating']}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">MMR</p>
                <p className="font-bold text-2xl text-text-primary">{horse['Matchmaking Rating']}</p>
              </div>
              {/* CHANGED: Odds → Avg Position */}
              <div>
                <p className="text-text-secondary text-xs">Avg Pos</p>
                <p className="font-bold text-2xl text-text-primary">{getAvgPosition(horse)}</p>
              </div>
              <div>
                <p className="text-text-secondary text-xs">Value Score</p>
                <p className="font-bold text-2xl text-accent-cyan">{getValueScore(horse)}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-gray text-xs flex items-center justify-between text-text-secondary">
              <span>Win {horse['Win Percentage']}</span>
              <span className="text-accent-pink group-hover:underline">Click for full vault →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedFilteredData.length === 0 && (
        <div className="text-center py-16">
          <Icon name="question" className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <p className="text-text-secondary">No horses match your filters.</p>
        </div>
      )}

      {/* MODAL (unchanged) */}
      {selectedHorse && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedHorse(null)}
        >
          <div
            className="bg-dark-card border border-border-gray rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopImmediatePropagation()}
          >
            <div className="px-8 pt-8 pb-4 border-b border-border-gray flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-text-primary">{selectedHorse.Name}</h2>
                <span className="px-5 py-1.5 bg-dark-bg rounded-3xl text-sm font-medium text-accent-cyan">
                  {selectedHorse.Bloodline} • Gen {selectedHorse.Gen}
                </span>
              </div>
              <button
                onClick={() => setSelectedHorse(null)}
                className="text-text-secondary hover:text-accent-pink transition-colors text-3xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div className="bg-dark-bg/60 rounded-3xl p-6">
                  <h3 className="text-text-secondary mb-4 text-sm font-medium">RATINGS RADAR</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart
                      data={[
                        { subject: 'Complete', A: parseFloat(selectedHorse['Complete Rating']) || 0 },
                        { subject: 'Speed', A: parseFloat(selectedHorse['Speed Rating']) || 0 },
                        { subject: 'Sprint', A: parseFloat(selectedHorse['Sprint Rating']) || 0 },
                        { subject: 'Endurance', A: parseFloat(selectedHorse['Endurance Rating']) || 0 },
                      ]}
                    >
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis angle={-45} dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <PolarRadiusAxis angle={45} domain={[0,5]} tick={{ fill: '#94a3b8', fontSize: 14 }} />
                      <Radar
                        name="Rating"
                        dataKey="A"
                        stroke="#00f5d4"
                        fill="#00f5d4"
                        fillOpacity={0.25}
                        strokeWidth={3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pace Profile */}
                <div className="bg-dark-bg/60 rounded-3xl p-6">
                  <h3 className="text-text-secondary mb-6 text-sm font-medium">PACE PROFILE (lower = better position)</h3>
                  <div className="space-y-8">
                    {[
                      { label: 'Q1 Start', value: parseFloat(selectedHorse['Q1 Pos x/8']) || 0 },
                      { label: 'Q2', value: parseFloat(selectedHorse['Q2 Pos x/8']) || 0 },
                      { label: 'Q3', value: parseFloat(selectedHorse['Q3 Pos x/8']) || 0 },
                      { label: 'Q4 Finish', value: parseFloat(selectedHorse['Q4 Pos x/8']) || 0 },
                    ].map((q, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-text-primary">{q.label}</span>
                          <span className="font-mono text-accent-cyan">{q.value.toFixed(1)}/8</span>
                        </div>
                        <div className="h-3 bg-border-gray rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent-cyan to-accent-pink rounded-r-full"
                            style={{ width: `${(q.value / 8) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-dark-bg/60 rounded-3xl p-6 text-center">
                  <p className="text-xs text-text-secondary">Best Time</p>
                  <p className="text-4xl font-mono font-bold text-text-primary mt-2">{selectedHorse['Best Time']}</p>
                </div>
                <div className="bg-dark-bg/60 rounded-3xl p-6 text-center">
                  <p className="text-xs text-text-secondary">Win %</p>
                  <p className="text-4xl font-mono font-bold text-text-primary mt-2">{selectedHorse['Win Percentage']}</p>
                </div>
                <div className="bg-dark-bg/60 rounded-3xl p-6 text-center">
                  <p className="text-xs text-text-secondary">MMR</p>
                  <p className="text-4xl font-mono font-bold text-text-primary mt-2">{selectedHorse['Matchmaking Rating']}</p>
                </div>
                <div className="bg-dark-bg/60 rounded-3xl p-6 text-center">
                  <p className="text-xs text-text-secondary">Value Score</p>
                  <p className="text-4xl font-mono font-bold text-accent-cyan mt-2">{getValueScore(selectedHorse)}</p>
                </div>
              </div>

              <a
                href={selectedHorse.Link}
                target="_blank"
                className="block w-full mt-10 text-center bg-accent-pink hover:bg-accent-pink/90 text-dark-bg font-semibold py-4 rounded-3xl transition-all"
              >
                OPEN ON ZED CHAMPIONS →
              </a>
            </div>
          </div>
        </div>
      )}
        <p className="text-xs text-text-secondary text-center mt-14">
            Not in anyway related to the original ' Know your horses '. Enjoy our completely seperate tool'.
        </p>
    </div>
  );
}