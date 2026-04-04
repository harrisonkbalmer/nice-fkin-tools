import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex gap-4 items-center justify-center text-text-secondary">
      <span>
      <div>
        <p className="text-8xl">NiceFkinTools</p>
      </div>
      
      <div className="mt-7 flex justify-center">
      <Link href="/sign-in">
      <button className="mx-auto text-center text-xs bg-accent-pink text-dark-card px-4 py-2 rounded-2xl hover:scale-105 hover:bg-accent-pink/90 transition gap-2 shadow-lg shadow-accent-pink/30">
        Get Started / Sign In / Sign Up
      </button>
      </Link>
      </div>
      </span>
    </div>
  );
}