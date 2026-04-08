'use client';

import { useState } from 'react';

export default function StableAccountant() {
  const [wallet, setWallet] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const round = (val: any) => Math.round(Number(val) || 0);

  const handleSearch = async () => {
    if (!wallet) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/zed/zed-accountant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to fetch');

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Stable Accountant by BES</h1>
        <p className="text-sm text-text-secondary mt-1">"Never ignore the numbers!"</p>
      </div>

      {/* Search */}
      <div className="bg-dark-card border border-border-gray rounded-3xl p-6">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x0000...0000"
          className="bg-dark-bg border border-border-gray rounded-2xl px-5 py-4 text-text-primary font-mono text-sm focus:outline-none focus:border-accent-pink w-full"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 w-full bg-accent-pink text-dark-bg py-4 rounded-2xl font-semibold hover:bg-accent-pink/90 transition text-lg disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Wallet'}
        </button>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-dark-card border border-border-gray rounded-2xl p-6">
            <h2 className="text-accent-pink text-sm mb-6">ZED Token</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-xs text-text-secondary">Current Balance</p>
                  <p className="text-xl font-mono font-semibold text-blue-400 mt-1">{round(data.token)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Spent on Breeding</p>
                  <p className="font-mono text-red-400">{round(data.tokenHorseOut)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Spent on Staking</p>
                  <p className="font-mono text-yellow-400">{round(data.tokenStakeOut)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Retirment Returns & Breeding Refunds</p>
                  <p className="font-mono text-green-400">{round(data.tokenHorseIn)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Staking Returns</p>
                  <p className="font-mono text-green-400">{round(data.tokenStakeIn)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-border-gray rounded-2xl p-6">
            <h2 className="text-accent-pink text-sm mb-6">ReZED Token</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-xs text-text-secondary">Current Balance</p>
                  <p className="text-xl font-mono font-semibold text-blue-400 mt-1">{round(data.rewardToken)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Airdropped</p>
                  <p className="font-mono text-green-400">{round(data.rewardIncomingNull)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Spent on Breeding</p>
                  <p className="font-mono text-red-400">{round(data.rewardHorseOut)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Spent on Staking</p>
                  <p className="font-mono text-orange-400">{round(data.rewardStakeOut)}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Breeding Refunds Total</p>
                  <p className="font-mono text-green-400">{round(data.rewardHorseIn)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* NFT CARD */}
          <div className="bg-dark-card border border-border-gray rounded-2xl p-6">
            <h2 className="text-accent-pink text-sm mb-6">Horses</h2>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-text-secondary">Horses (Current)</p>
                <p className="text-xl font-mono font-semibold text-blue-400">{data.currentHorses}</p>
              </div>
              <div>
                <p className="text-text-secondary">Horses from Breeding</p>
                <p className="font-mono font-semibold text-green-400">
                  {data.incomingNft - ((data.currentHorses + data.archivedNft + data.transferredNft) - data.incomingNft) }
                </p>
              </div>
              <div>
                <p className="text-text-secondary">Horses from Airdrops</p> 
                <p className="font-mono font-semibold text-green-400">
                  {(data.currentHorses + data.archivedNft + data.transferredNft) - data.incomingNft}
                </p>
              </div>
              <div>
                <p className="text-text-secondary">Horses Archived</p>
                <p className="font-mono font-semibold text-red-400">{data.archivedNft}</p>
              </div>
              <div>
                <p className="text-text-secondary">Horses Transferred</p>
                <p className="font-mono font-semibold text-yellow-400">{data.transferredNft}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}