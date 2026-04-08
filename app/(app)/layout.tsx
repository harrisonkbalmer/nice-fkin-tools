import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./../components/Icon";
import Footer from "./../components/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nice Fkin Tools",
  description: "Community tools for ZED Champions players",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-title" content="NFTS" />
      </head>
      <body className="inter_variable font-sans antialiased bg-dark-bg text-text-primary" suppressHydrationWarning>
        <div className="flex h-screen flex-col md:flex-row">
          
          {/* DESKTOP SIDEBAR (hidden on mobile) */}
          <aside className="hidden md:flex w-64 bg-dark-card border-r border-border-gray flex-col py-8 px-6">
            <div className="flex items-center gap-3 mb-10">
              <Link href="/">
              <Image
                src="/nicefkintools.svg"
                alt="Nice Fkin Tools"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              </Link>
              <Link href="/">
              <span className="text-1xl font-bold tracking-tighter text-accent-pink">NiceFkinTools</span>
              </Link>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              <Link href="/home" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all">
                <Icon name="house" className="w-6 h-6" />
                <span className="font-medium">Home</span>
              </Link>
              <Link href="/tools" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all">
                <Icon name="tools" className="w-6 h-6" />
                <span className="font-medium">Tools</span>
              </Link>
              <Link href="/learn" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all">
                <Icon name="school" className="w-6 h-6" />
                <span className="font-medium">Learn</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all">
                <Icon name="user" className="w-6 h-6" />
                <span className="font-medium">Profile</span>
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-border-gray">
              <Link href="/support">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:text-accent-pink transition-all">
                  <Icon name="cog" className="w-6 h-6" />
                  <span className="font-medium">Support</span>
                </button>
              </Link>
            </div>
          </aside>

          {/* MAIN AREA */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            
            {/* TOP HEADER (always visible) */}
            <header className="h-16 bg-dark-card border-b border-border-gray px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile logo */}
                <div className="md:hidden flex items-center gap-2">
                  <Image src="/nicefkintools.svg" alt="NFTS" width={40} height={40} className="w-10 h-10" />
                  <span className="text-1xl font-bold text-accent-pink">NiceFkinTools</span>
                </div>
                <h1 className="text-xl text-text-primary hidden md:block">Welcome, User</h1>
              </div>

              <div className="flex items-center gap-6">
                <Link href="/sign-in" className="text-xs bg-accent-pink text-dark-card px-4 py-2 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition flex items-center gap-2 shadow-lg shadow-accent-pink/30">
                  <span>FkinLogin</span>
                  <span className="text-xs">→</span>
                </Link>
              </div>
            </header>

            {/* PAGE CONTENT */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {children}
              <Footer/>
            </main>

            {/* MOBILE BOTTOM NAV */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-border-gray h-16 flex items-center justify-around z-50">
              <Link href="/home" className="flex flex-col items-center gap-1 text-text-secondary active:text-accent-pink">
                <Icon name="house" className="w-7 h-7" />
                <span className="text-[10px]">Home</span>
              </Link>
              <Link href="/tools" className="flex flex-col items-center gap-1 text-text-secondary active:text-accent-pink">
                <Icon name="tools" className="w-7 h-7" />
                <span className="text-[10px]">Tools</span>
              </Link>
              <Link href="/learn" className="flex flex-col items-center gap-1 text-text-secondary active:text-accent-pink">
                <Icon name="school" className="w-7 h-7" />
                <span className="text-[10px]">Learn</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center gap-1 text-text-secondary active:text-accent-pink">
                <Icon name="user" className="w-7 h-7" />
                <span className="text-[10px]">Me</span>
              </Link>
              <Link href="/support" className="flex flex-col items-center gap-1 text-text-secondary active:text-accent-pink">
                <Icon name="cog" className="w-7 h-7" />
                <span className="text-[10px]">Support</span>
              </Link>
            </nav>
          </div>
        </div>
      </body>
    </html>
  );
}