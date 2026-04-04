// components/Footer.tsx
import Link from "next/link";

export default function FooterMin() {
  return (
    <footer className="mt-16 md:mb-1 mb-16 border-t border-border-gray bg-dark-card rounded-3xl p-3 md:p-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-2">

        {/* Thin separator */}
        <div className="w-12 h-px bg-border-gray my-1" />

        {/* Sponsor Links */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="https://www.balmer.estate" target="_blank" className="group">
            <button className="text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              Balmer Estate
            </button>
          </Link>
          <Link href="https://www.yevey.co.uk" target="_blank" className="group">
            <button className="text-xs bg-accent-pink text-dark-bg px-5 py-2.5 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition-all shadow-lg shadow-accent-pink/30">
              YEVEY LTD
            </button>
          </Link>
        </div>

        {/* Branding + Copyright */}
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">
            Nice Fkin Tools (NFTs) • Built by Balmer Estate &amp; YEVEY LTD
          </p>
          <p className="text-[11px] text-text-secondary/60">
            © 2026 NiceFkinTools • All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}