"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 bg-[#FFFFFF] border-t border-[#E9E8DF] text-center">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-6">
          <Database className="w-3.5 h-3.5" />
          <span>Persistent Reliability Intelligence</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#25352D] mb-6 leading-tight">
          Make every incident <br />
          <span className="italic font-serif font-normal text-[#267B5B]">count.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#788579] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Stop solving the same database connection exhaustion, cache stampede, and queue storm every quarter.
          Equip your engineering team with persistent institutional memory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/command"
            className="w-full sm:w-auto px-8 py-3.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center justify-center gap-2.5 shadow-subtle transition-all duration-150"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/theatre"
            className="w-full sm:w-auto px-6 py-3.5 rounded bg-[#F8F7F2] hover:bg-[#F1F0E9] text-[#25352D] border border-[#E9E8DF] font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 font-mono"
          >
            <span>Run Memory Benchmark</span>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 text-xs font-mono text-[#9A9C91]">
          <span>Grounded Retrieval</span>
          <span>·</span>
          <span>Human-in-the-Loop</span>
          <span>·</span>
          <span>Zero Decorative AI Buzzwords</span>
        </div>
      </div>
    </section>
  );
}
