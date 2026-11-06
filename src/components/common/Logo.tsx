"useEdge";
import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const sizeMap = {
    sm: { icon: 20, text: "text-base", sub: "text-[9px]" },
    md: { icon: 26, text: "text-lg", sub: "text-[10px]" },
    lg: { icon: 34, text: "text-2xl", sub: "text-xs" },
  };

  const current = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-90 ${className}`}>
      {/* Original Identity Icon: Signal Wave transforming into Interconnected Memory Nodes */}
      <div className="relative flex items-center justify-center p-1.5 rounded-lg bg-[#0d1424] border border-[#1e2d4a] group-hover:border-cyan-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Signal waveform entering from left */}
          <path
            d="M 3 16 L 8 16 L 11 9 L 15 23 L 18 13 L 21 16 L 24 16"
            stroke="#38bdf8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Transforming into branching memory nodes */}
          <circle cx="21" cy="16" r="2.5" fill="#00f0ff" />
          <path
            d="M 21 16 L 28 10"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <path
            d="M 21 16 L 28 22"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <circle cx="28" cy="10" r="2" fill="#38bdf8" />
          <circle cx="28" cy="22" r="2" fill="#22d3ee" />
          {/* Subtle persistent resonance halo */}
          <circle
            cx="21"
            cy="16"
            r="5"
            stroke="#00f0ff"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-white font-sans ${current.text}`}>
              Pager<span className="text-cyan-400 font-bold">Lore</span>
            </span>
            <span className="inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
              SRE
            </span>
          </div>
          <span className={`font-mono text-slate-400 tracking-wider uppercase ${current.sub}`}>
            Incident Memory
          </span>
        </div>
      )}
    </Link>
  );
}
