// app/tools/zed-bundles/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../../../components/Icon';

interface Bundle {
  id: string;
  seller: string;
  stableName: string;
  horsesCount: number;
  totalZed: number;
  avgZedPerHorse: number;
  description?: string;
}

const mockBundles: Bundle[] = [
  {
    id: 'bundle-1',
    seller: '0x1234...abcd',
    stableName: 'Neon Stables',
    horsesCount: 8,
    totalZed: 1240,
    avgZedPerHorse: 155,
    description: 'Gen 2-3 speed beasts',
  },
  {
    id: 'bundle-2',
    seller: '0x5678...efgh',
    stableName: 'Crypto Colts',
    horsesCount: 5,
    totalZed: 875,
    avgZedPerHorse: 175,
    description: 'Endurance bloodline mix',
  },
  {
    id: 'bundle-3',
    seller: '0x9abc...ijkl',
    stableName: 'Shadow Runners',
    horsesCount: 12,
    totalZed: 1680,
    avgZedPerHorse: 140,
    description: 'Sprint specialists',
  },
  {
    id: 'bundle-4',
    seller: '0xdef0...mnop',
    stableName: 'Balmer Bloodlines',
    horsesCount: 3,
    totalZed: 720,
    avgZedPerHorse: 240,
    description: 'Premium Gen 1s',
  },
];

export default function ZedBundlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bundles] = useState<Bundle[]>(mockBundles);

  const filteredBundles = bundles.filter(
    (b) =>
      b.stableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header – same energy as Tools and Zed pages */}
      <div className="flex flex-col mb-10">
        <div className="mb-2">
          <span className="text-3xl font-bold text-accent-pink">Zed Bundles (WIP)</span>
        </div>
        <p className="text-lg text-text-secondary max-w-md">
          Curated horse bundles from the community. Buy in bulk, save big.
        </p>
      </div>

      {/* Search + CTA bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bundles or stables..."
            className="w-full bg-dark-card border border-border-gray rounded-3xl px-6 py-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-cyan transition-all"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Icon name="filter" className="w-5 h-5 text-text-secondary" />
          </div>
        </div>

        <Link href="/tools/zed-bundles/create">
          <button className="bg-accent-pink text-dark-bg px-8 py-4 rounded-3xl font-semibold hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30 flex items-center gap-2 whitespace-nowrap">
            <Icon name="gift" className="w-5 h-5" />
            LIST YOUR BUNDLE
          </button>
        </Link>
      </div>

      {/* Grid of bundles – responsive, clean cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBundles.map((bundle) => (
          <div
            key={bundle.id}
            className="group bg-dark-card border border-border-gray rounded-3xl overflow-hidden hover:border-accent-pink transition-all duration-300 hover:shadow-2xl hover:shadow-accent-pink/10"
          >
            {/* Card header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">{bundle.stableName}</p>
                  <p className="text-xs text-text-secondary font-mono tracking-tighter">
                    {bundle.seller}
                  </p>
                </div>
                <div className="bg-dark-bg/80 text-accent-cyan text-xs font-medium px-3 py-1 rounded-2xl">
                  {bundle.horsesCount} HORSES
                </div>
              </div>
            </div>

            {/* Main visual / price area */}
            <div className="px-6 pb-6">
              <div className="bg-dark-bg/60 rounded-2xl p-5 text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-accent-cyan tracking-tighter">
                    {bundle.totalZed}
                  </span>
                  <span className="text-2xl font-medium text-text-secondary">ZED</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  ~{bundle.avgZedPerHorse} ZED / horse
                </p>
              </div>

              {/* Short description */}
              {bundle.description && (
                <p className="text-text-secondary text-sm line-clamp-2 text-center">
                  {bundle.description}
                </p>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-border-gray px-6 py-4 flex items-center justify-between bg-dark-bg/30">
              <button className="text-xs font-medium text-accent-pink hover:text-accent-cyan transition-colors">
                VIEW DETAILS
              </button>
              <button className="bg-accent-pink text-dark-bg text-xs font-semibold px-6 py-2 rounded-2xl hover:scale-105 transition-all">
                BUY BUNDLE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredBundles.length === 0 && (
        <div className="text-center py-16">
          <Icon name="question" className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <p className="text-text-secondary">No bundles match your search.</p>
        </div>
      )}

      {/* Future note (partnership vibe) */}
      <p className="text-center text-text-secondary/60 text-sm mt-16">
        Bundles listed here are at the liability & discrepancy of the stable whom listed, no responsibility lies with Niftos.xyz/NFTs in any capacity.
      </p>
    </div>
  );
}