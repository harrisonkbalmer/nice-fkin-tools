import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex gap-4 items-center justify-center text-text-secondary">
      <span>
      <div className="mb-7">
        <p className="text-8xl">Tools</p>
      </div>
      <div className="mt-2 flex justify-center">
      <Link href="/tools/zedstats">
      <button className="mx-auto w-50 text-center text-xs bg-accent-pink text-dark-card px-4 py-2 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition gap-2 shadow-lg shadow-accent-pink/30">
        Zed Stats
      </button>
      </Link>
      </div>
      <div className="mt-2 flex justify-center">
      <Link href="/tools/zed-augments">
      <button className="mx-auto w-50 text-center text-xs bg-accent-pink text-dark-card px-4 py-2 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition gap-2 shadow-lg shadow-accent-pink/30">
        Zed Augments
      </button>
      </Link>
      </div>
      </span>
    </div>
  );
}