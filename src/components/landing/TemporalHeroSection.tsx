"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, RotateCcw, Database, ShieldCheck, Activity, Sparkles, ChevronDown } from "lucide-react";
import { MagneticLink } from "../common/MagneticButton";

// Dynamic load for 3D astronomical clock (disables SSR for Three.js WebGL canvas)
const TemporalClock3D = dynamic(
  () => import("./TemporalClock3D").then((mod) => mod.TemporalClock3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] flex items-center justify-center font-mono text-xs text-[#267B5B] animate-pulse">
        Initializing Astronomical Clockwork...
      </div>
    ),
  }
);

export function TemporalHeroSection() {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <section className="relative min-h-[92vh] bg-[#0A1210] text-[#F8F7F2] overflow-hidden pt-28 pb-20 flex flex-col justify-between">
      {/* Cinematic Background Atmosphere (Radial Midnight Nebula & Emerald Horizon) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial emerald focal glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#267B5B]/18 rounded-full blur-[140px]" />
        {/* Warm gold rim accent glow */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[350px] bg-[#B8A17A]/12 rounded-full blur-[120px]" />
        {/* Technical Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Top Eyebrow Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#13231E] border border-[#267B5B]/40 text-[#267B5B] text-xs font-mono tracking-wider font-semibold shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#267B5B] animate-pulse" />
            <span className="text-[11px] uppercase">THE INCIDENT TIME MACHINE · PERSISTENT SRE MEMORY</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[#788579]">
            <span className="flex items-center gap-1.5 text-[#C94F4F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C94F4F] animate-ping" />
              <span>INC-142 Inactive Triage</span>
            </span>
            <span>·</span>
            <span className="text-[#267B5B]">Hindsight Recall: 96% Grounded</span>
          </div>
        </div>

        {/* Main Grid: Left Editorial Typography, Right 3D Astronomical Clock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#F8F7F2] leading-[1.08] font-sans"
            >
              WHAT IF YOU COULD <br />
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#267B5B] via-[#48A580] to-[#B8A17A]">
                REWIND EVERY FAILURE?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A3B2A8] font-sans leading-relaxed max-w-xl font-normal">
              Every incident leaves a trace. PagerLore retrieves the lessons hidden in your engineering history and uses them to solve what happens next.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <MagneticLink
                href="/command"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#267B5B] hover:bg-[#1E664A] text-white font-medium text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-[#267B5B]/25 transition-all duration-200"
              >
                <span>Explore PagerLore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticLink>

              <MagneticLink
                href="#time-reversal"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#13231E] hover:bg-[#1A3029] text-[#F8F7F2] border border-[#267B5B]/30 font-medium text-xs flex items-center justify-center gap-2 font-mono transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#267B5B]" />
                <span>See how memory works</span>
              </MagneticLink>
            </div>

            {/* Real-time Temporal Proof Metrics */}
            <div className="pt-6 border-t border-[#ffffff10] grid grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#788579] uppercase tracking-wider">Historical Recall</div>
                <div className="text-xl font-bold text-[#267B5B] mt-0.5">96%</div>
                <div className="text-[10px] text-[#A3B2A8]">RRF-Grounded</div>
              </div>
              <div>
                <div className="text-[10px] text-[#788579] uppercase tracking-wider">MTTR Reduction</div>
                <div className="text-xl font-bold text-[#F8F7F2] mt-0.5">4m <span className="text-xs text-[#788579] font-normal">vs 48m</span></div>
                <div className="text-[10px] text-[#267B5B]">-92% Outage Time</div>
              </div>
              <div>
                <div className="text-[10px] text-[#788579] uppercase tracking-wider">Knowledge Leakage</div>
                <div className="text-xl font-bold text-[#B8A17A] mt-0.5">Zero</div>
                <div className="text-[10px] text-[#A3B2A8]">Persistent Vault</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Astronomical Clock Time Machine */}
          <div className="lg:col-span-6 relative">
            <TemporalClock3D />
          </div>
        </div>
      </div>

      {/* Downward Transition Anchor to Time Reversal Experience */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-8 flex items-center justify-between text-xs font-mono text-[#788579]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#267B5B]" />
          <span>Look Backward. Move Forward.</span>
        </div>
        <a
          href="#time-reversal"
          className="flex items-center gap-1.5 hover:text-[#267B5B] transition-colors"
        >
          <span>Scroll to reverse time</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

