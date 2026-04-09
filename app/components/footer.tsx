// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 mb-16 md:mb-1 border-t border-border-gray bg-dark-card rounded-3xl p-3 md:p-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">

        {/* Navigation Buttons */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          <Link href="/home" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Home
            </button>
          </Link>
          <Link href="/tools" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Tools
            </button>
          </Link>
          <Link href="/learn" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Learn
            </button>
          </Link>
          <Link href="/profile" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Profile
            </button>
          </Link>
          <Link href="/support" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Support
            </button>
          </Link>

          <Link href="https://www.balmer.estate" target="_blank" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              BES
            </button>
          </Link>
          <Link href="https://www.yevey.co.uk" target="_blank" className="group">
            <button className="w-full text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              YVY
            </button>
          </Link>

        </div>

        {/* Branding + Copyright */}
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            Nice Fkin Tools (Niftos | NFTs) • Built by YEVEY &amp; Balmer Estate
          </p>
          <p className="text-[11px] text-text-secondary/60">
            © 2026 NiceFkinTools • All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}