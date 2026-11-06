import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const sizeMap = {
    sm: { icon: 20, text: "text-sm", sub: "text-[9px]" },
    md: { icon: 24, text: "text-base", sub: "text-[10px]" },
    lg: { icon: 30, text: "text-xl", sub: "text-xs" },
  };

  const current = sizeMap[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Refined Minimal Emblem: Signal Wave transforming into Interconnected Memory Traces */}
      <div className="flex items-center justify-center p-1 rounded-md bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle group-hover:border-[#267B5B]/40 transition-colors duration-200">
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Signal waveform entering from left in deep emerald */}
          <path
            d="M 4 16 L 8 16 L 11 10 L 15 22 L 18 13 L 21 16 L 23 16"
            stroke="#267B5B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Transition node */}
          <circle cx="21" cy="16" r="2" fill="#267B5B" />
          
          {/* Subtle connecting lines to memory points in muted gold */}
          <path
            d="M 21 16 L 27 10"
            stroke="#B8A17A"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <path
            d="M 21 16 L 27 22"
            stroke="#B8A17A"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          
          {/* Memory nodes */}
          <circle cx="27" cy="10" r="1.8" fill="#B8A17A" />
          <circle cx="27" cy="22" r="1.8" fill="#267B5B" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-[#25352D] font-sans ${current.text}`}>
              Pager<span className="text-[#267B5B]">Lore</span>
            </span>
          </div>
          <span className={`font-mono text-[#788579] tracking-wider uppercase ${current.sub}`}>
            Engineering Remembers
          </span>
        </div>
      )}
    </Link>
  );
}
