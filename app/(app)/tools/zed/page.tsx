'use client'; // Client component for interactivity

import { useState } from 'react';

interface HorseData {
  data?: {
    horse?: {
      id: string;
      name: string;
      bloodline: string;
      generation: number;
      gender: string;
      color: string; // hexColor
      state: string;
      completeRating: number;
      speedRating: number;
      sprintRating: number;
      enduranceRating: number;
      racePool?: { points: number; balance: number };
      user?: { stableName: string; walletAddress: string };
      father?: any; // Simplified
      mother?: any;
    };
  };
  errors?: any[];
}

export default function Zed() {
  const [horseId, setHorseId] = useState('');
  const [result, setResult] = useState<HorseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horseId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const maxAttempts = 10;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch(`./api/zed/horse?id=${encodeURIComponent(horseId.trim())}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch');
        }

        // Success! Show the result immediately and stop
        setResult(data);
        setLoading(false);
        return;
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, err.message);

        // Small delay between attempts (feel free to remove or adjust)
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    }

    // If we get here, all 10 attempts failed
    setError(`Failed after trying ${maxAttempts} times. ${lastError?.message || 'Something went wrong'}`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Search Horse by ID</h2>
      <p className="text-text-secondary">
        Enter a ZED Champions horse ID to view details (e.g., 95d58207-819b-4317-bb3f-12923d4cf851).
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={horseId}
          onChange={(e) => setHorseId(e.target.value)}
          placeholder="Horse ID (e.g., ef9e277a...)"
          className="flex-1 bg-dark-card border border-border-gray rounded-md px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cyan"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-cyan text-dark-bg px-6 py-3 rounded-md font-medium hover:bg-accent-cyan/90 transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {result && result.data?.horse && (
        <div className="bg-dark-card p-6 rounded-md space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold">{result.data.horse.name || 'Unnamed Horse'}</h3>
            <span className="text-accent-cyan font-semibold">
              {result.data.horse.gender} • Gen {result.data.horse.generation}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-text-secondary">Bloodline</p>
              <p className="font-medium">{result.data.horse.bloodline}</p>
            </div>
            <div>
              <p className="text-text-secondary">Color</p>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded-full border border-border-gray"
                  style={{ backgroundColor: result.data.horse.color }}
                />
                <p>{result.data.horse.color}</p>
              </div>
            </div>
            <div>
              <p className="text-text-secondary">Complete Rating</p>
              <p className="font-medium">{result.data.horse.completeRating}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-text-secondary text-sm">Speed</p>
                <p>{result.data.horse.speedRating}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Sprint</p>
                <p>{result.data.horse.sprintRating}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Endurance</p>
                <p>{result.data.horse.enduranceRating}</p>
              </div>
            </div>
          </div>

          {result.data.horse.user && (
            <div>
              <p className="text-text-secondary">Owner Stable</p>
              <p className="font-medium">{result.data.horse.user.stableName}</p>
              <p className="text-sm text-text-secondary break-all">
                {result.data.horse.user.walletAddress}
              </p>
            </div>
          )}

          {/* Add more sections for father/mother/racePool as needed */}
        </div>
      )}

      {result && !result.data?.horse && !error && (
        <p className="text-text-secondary">No horse found with that ID.</p>
      )}
    </div>
  );
}