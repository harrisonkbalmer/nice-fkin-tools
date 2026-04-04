// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-text-primary mb-6">
          Nice Fkin Tools
        </h1>
        <p className="text-xl text-text-secondary mb-10">
          NFTs for NFTs
        </p>
        
        <Link href="/home">
        <button
          className="mx-auto text-center text-1xl bg-accent-pink text-dark-card px-7 py-3 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition gap-2 shadow-lg shadow-accent-pink/30"
        >
          Fkin Get Started →
        </button>
        </Link>
      </div>
    </div>
  );
}