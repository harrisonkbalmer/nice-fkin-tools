// app/tools/page.tsx
import Link from "next/link";
import { Icon } from "./../../components/Icon";

const tools = [
  {
    title: "Zed Stats",
    href: "/tools/zedstats",
    icon: "tools" as const,
  },
  {
    title: "Zed Augments",
    href: "/tools/zed-augments",
    icon: "hammer" as const,
  },
  {
    title: "Zed Accountant",
    href: "/tools/zed-accountant",
    icon: "wallet" as const,
  },
  {
    title: "Zed Bundles",
    href: "/tools/zed-bundles",
    icon: "gift" as const,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
  {
    title: "Coming Soon",
    href: "#",
    icon: "question" as const,
    disabled: true,
  },
];

export default function ToolsPage() {
  return (
    <div>
      {/* Hero-style header to keep the same energy as the old placeholder */}
      <div className="flex flex-col mb-12">
        <div className="mb-2">
          <span className="text-3xl font-bold text-accent-pink">Tools</span>
        </div>
        <p className="text-lg text-text-secondary max-w-md">
          Nice Fkin Tools. NFTs for NFTs.
        </p>
      </div>

      {/* Exact 5-column grid that stays 5 columns even on mobile (per your spec) */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className={`group ${tool.disabled ? "pointer-events-none" : ""}`}
          >
            <div
              className={`
                bg-dark-card border border-border-gray rounded-3xl aspect-square 
                flex flex-col items-center justify-center p-4 min-h-6 
                hover:border-accent-pink transition-all duration-300
                ${tool.disabled 
                  ? "opacity-60" 
                  : "hover:scale-105 hover:shadow-2xl hover:shadow-accent-pink/20"
                }
              `}
            >
              {/* Square background icon area */}
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-bg/80">
                <Icon
                  name={tool.icon}
                  className={`w-10 h-10 transition-colors ${
                    tool.disabled 
                      ? "text-text-secondary" 
                      : "text-accent-cyan group-hover:text-accent-pink"
                  }`}
                />
              </div>

              {/* Tool name */}
              <span className="text-center font-semibold text-xs tracking-tighter text-text-primary">
                {tool.title}
              </span>

              {/* Coming soon badge */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}