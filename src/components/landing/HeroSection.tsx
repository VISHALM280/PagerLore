"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles, Activity, ShieldCheck, Database } from "lucide-react";
import { animateWordByWord, animateNumber, prefersReducedMotion } from "@/lib/animations";
import { MagneticLink } from "@/components/common/MagneticButton";

// Lazy-load the Three.js 3D scene to preserve performance
const Hero3DScene = dynamic(
  () => import("./Hero3DScene").then((mod) => mod.Hero3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-xl aspect-[4/3] rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm flex flex-col items-center justify-center font-mono text-xs text-[#788579] animate-pulse">
        <span className="w-3 h-3 rounded-full bg-[#21845F] mb-2 animate-ping" />
        <span>Initializing 3D Memory Mesh...</span>
      </div>
    ),
  }
);

export function HeroSection() {
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);

  // Animated stat values
  const [mttrValue, setMttrValue] = useState(0);
  const [confidenceValue, setConfidenceValue] = useState(0);

  useEffect(() => {
    // 1. Eyebrow badge entrance
    if (eyebrowRef.current) {
      eyebrowRef.current.style.opacity = "0";
      eyebrowRef.current.style.transform = "translateY(12px)";
      setTimeout(() => {
        if (eyebrowRef.current) {
          eyebrowRef.current.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
          eyebrowRef.current.style.opacity = "1";
          eyebrowRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }

    // 2. Word-by-word blur-to-sharp upward reveal
    if (headlineRef.current) {
      setTimeout(() => {
        if (headlineRef.current) {
          animateWordByWord(headlineRef.current, () => {
            // 3. Reveal description with a slight delay
            if (textRef.current) {
              textRef.current.style.opacity = "1";
              textRef.current.style.transform = "translateY(0)";
            }
            // 4. Animate CTA buttons
            if (ctaRef.current) {
              ctaRef.current.style.opacity = "1";
              ctaRef.current.style.transform = "translateY(0)";
            }
          });
        }
      }, 250);
    }

    // 5. Introduce 3D graph with subtle scale & depth animation
    if (graphRef.current) {
      graphRef.current.style.opacity = "0";
      graphRef.current.style.transform = "scale(0.96) translateY(20px)";
      setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.style.transition = "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
          graphRef.current.style.opacity = "1";
          graphRef.current.style.transform = "scale(1) translateY(0)";
        }
      }, 400);
    }

    // 6. Number counter animations
    const mttrObj = { value: 0 };
    animateNumber(mttrObj, 26, (val) => setMttrValue(val), 1400);

    const confObj = { value: 0 };
    animateNumber(confObj, 96, (val) => setConfidenceValue(val), 1600);
  }, []);

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center pt-28 pb-16 overflow-hidden bg-ivory-grid">
      {/* Soft warm ivory ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#EAF2EC]/60 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[350px] bg-[#F7F3EC]/70 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow Pill */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EAF2EC] border border-[#21845F]/20 mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#21845F] animate-pulse" />
              <span className="text-xs font-mono text-[#194B38] font-bold tracking-wide">
                Hindsight 3D Incident Memory Engine
              </span>
            </div>

            {/* Main Editorial Headline with word-by-word reveal */}
            <h1
              ref={headlineRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#24352D] leading-[1.05] mb-6"
            >
              <span className="hero-word inline-block mr-3">Engineering</span>
              <br />
              <span className="hero-word inline-block text-[#21845F] italic font-serif font-normal">
                remembers.
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              ref={textRef}
              style={{
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              }}
              className="text-base sm:text-lg text-[#788579] max-w-xl mb-10 leading-relaxed font-normal"
            >
              Every production incident leaves a lesson. PagerLore connects the knowledge of past failures with today&apos;s active investigations—grounding AI agents in verified post-mortems so your on-call engineers never have to start diagnosing from zero again.
            </p>

            {/* Magnetic CTA Buttons */}
            <div
              ref={ctaRef}
              style={{
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <MagneticLink
                href="/command"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#21845F] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(33,132,95,0.25)] transition-all transform active:scale-95"
              >
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MagneticLink>

              <MagneticLink
                href="#problem"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#F8F7F2] text-[#24352D] border border-[#E9E8DF] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Explore How It Works</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#788579]" />
              </MagneticLink>
            </div>

            {/* Minimal Animated Stat Footnotes */}
            <div className="mt-12 pt-6 border-t border-[#E9E8DF] flex flex-wrap items-center gap-8 text-xs font-mono text-[#788579]">
              <div>
                <span className="text-[#24352D] font-bold text-sm">{mttrValue}m</span> MTTR with Memory
              </div>
              <span className="text-[#D9D7CB]">|</span>
              <div>
                <span className="text-[#21845F] font-bold text-sm">{confidenceValue}%</span> Diagnostic Confidence
              </div>
              <span className="text-[#D9D7CB]">|</span>
              <div className="text-[#B8A17A] font-semibold">
                88% Recurrence Mitigation
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Hero Canvas (5 cols) */}
          <div ref={graphRef} className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <Hero3DScene />
          </div>
        </div>
      </div>
    </section>
  );
}
