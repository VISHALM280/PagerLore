"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { MemoryNetworkVisualizer } from "./MemoryNetworkVisualizer";
import { animateHeadline, animateStagger } from "@/lib/animations";

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (headlineRef.current) {
      animateHeadline(headlineRef.current);
    }
    if (textRef.current && ctaRef.current) {
      animateStagger([textRef.current, ctaRef.current], 120);
    }
  }, []);

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center pt-28 pb-16 overflow-hidden bg-ivory-grid">
      {/* Soft warm ivory ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#EAF2EC]/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-[#F7F3EC]/60 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />
              <span className="text-xs font-mono text-[#194B38] font-medium tracking-wide">
                Persistent Incident Memory
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1
              ref={headlineRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#25352D] leading-[1.05] mb-6"
            >
              Engineering <br />
              <span className="text-[#267B5B] italic font-serif font-normal">remembers.</span>
            </h1>

            {/* Supporting Text */}
            <p
              ref={textRef}
              className="text-base sm:text-lg text-[#788579] max-w-xl mb-10 leading-relaxed font-normal"
            >
              Every incident leaves a lesson. PagerLore connects the knowledge of past failures with today&apos;s investigations, helping engineering teams move forward with experience rather than starting from zero.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/command"
                className="w-full sm:w-auto px-6 py-3.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center justify-center gap-2.5 shadow-subtle transition-all duration-150"
              >
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="#problem"
                className="w-full sm:w-auto px-5 py-3.5 rounded bg-[#FFFFFF] hover:bg-[#F1F0E9] text-[#25352D] border border-[#E9E8DF] font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150"
              >
                <span>Explore How It Works</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#788579]" />
              </Link>
            </div>

            {/* Minimal Stat Footnote */}
            <div className="mt-12 pt-6 border-t border-[#E9E8DF] flex items-center gap-8 text-xs font-mono text-[#788579]">
              <div>
                <span className="text-[#25352D] font-bold">26m</span> MTTR with Memory
              </div>
              <span className="text-[#D9D7CB]">|</span>
              <div>
                <span className="text-[#267B5B] font-bold">96%</span> Diagnostic Confidence
              </div>
            </div>
          </div>

          {/* Right Column: Connected Memory Network (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <MemoryNetworkVisualizer />
          </div>
        </div>
      </div>
    </section>
  );
}
