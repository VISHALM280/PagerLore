"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Database, RotateCcw, Clock, Sparkles } from "lucide-react";
import { MagneticLink } from "../common/MagneticButton";

export function TemporalFinalSection() {
  return (
    <section className="relative py-32 bg-[#FFFFFF] border-t border-[#E9E8DF] text-center overflow-hidden">
      {/* Subtle radial emerald & gold ambient glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[700px] h-[340px] bg-[#EAF2EC]/60 rounded-full blur-3xl opacity-80" />
        <div className="w-[400px] h-[200px] bg-[#B8A17A]/10 rounded-full blur-2xl opacity-60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-6 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>The Incident Time Machine</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#25352D] mb-6 leading-tight font-sans">
          Look back. Learn faster. <br />
          <span className="font-serif italic font-normal text-[#267B5B]">
            Move forward.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#788579] max-w-xl mx-auto mb-10 leading-relaxed font-sans font-normal">
          Every resolved incident becomes an opportunity to build a smarter, more resilient engineering system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticLink
            href="/command"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-[#267B5B]/20 transition-all duration-200"
          >
            <span>Explore the Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </MagneticLink>

          <MagneticLink
            href="/theatre"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#F8F7F2] hover:bg-[#F1F0E9] text-[#25352D] border border-[#E9E8DF] font-medium text-xs flex items-center justify-center gap-2 transition-all duration-200 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#267B5B]" />
            <span>Run Memory Benchmark</span>
          </MagneticLink>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#9A9C91]">
          <span>Grounded Retrieval</span>
          <span>·</span>
          <span>Zero Hallucination</span>
          <span>·</span>
          <span>Persistent Hindsight Memory</span>
          <span>·</span>
          <span>Human-in-the-Loop SRE</span>
        </div>
      </div>
    </section>
  );
}

