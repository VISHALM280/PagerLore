"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Database, Sparkles } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="relative py-28 bg-[#040609] border-t border-[#161f33] overflow-hidden text-center">
      {/* Ambient center flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          The next incident is <br />
          <span className="text-gradient-cyan">not a blank page.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Stop solving the same database connection exhaustion, cache stampede, and queue storm every quarter.
          Equip your SRE and platform teams with persistent incident memory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/command"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] flex items-center justify-center gap-3 group transform active:scale-95"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/theatre"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#0d1424] hover:bg-[#141f38] text-slate-200 border border-[#1e2d4a] hover:border-cyan-500/50 text-sm font-medium transition-all flex items-center justify-center gap-2 font-mono"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Launch Demo Theatre</span>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-xs font-mono text-slate-500">
          <span>Hindsight v1 Native</span>
          <span>·</span>
          <span>Zero Hallucinations</span>
          <span>·</span>
          <span>Human-in-the-Loop</span>
        </div>
      </div>
    </section>
  );
}
