"use client";

import React, { useState } from "react";
import { Database, CheckCircle2, ArrowRight, BookOpen, Layers } from "lucide-react";

export function SolutionSection() {
  const [activeStep, setActiveStep] = useState(2); // default to Historical Recall

  const steps = [
    {
      step: "01",
      title: "Previous Incident",
      subtitle: "The Production Outage",
      summary: "A critical service degrades. Engineers identify the root cause after painstaking diagnostics.",
      detail: "INC-2024-089: HikariCP connection pool starvation caused by pgBouncer 10-minute idle drop.",
    },
    {
      step: "02",
      title: "Retained Knowledge",
      subtitle: "Structured Facts in Bank",
      summary: "Upon resolution, verified findings and preventive rules are committed to the memory bank.",
      detail: "Rule retained: HikariCP maxLifetime must be strictly less than pgBouncer server_idle_timeout.",
    },
    {
      step: "03",
      title: "Historical Recall",
      subtitle: "Multi-Strategy Search",
      summary: "When a new symptom emerges, PagerLore retrieves relevant memories via semantic and graph search.",
      detail: "Relevance score 0.96: Matched connection pool saturation signature with 96% confidence.",
    },
    {
      step: "04",
      title: "Current Investigation",
      subtitle: "Contextual Grounding",
      summary: "The investigation agent correlates live git diffs with historical facts, avoiding speculation.",
      detail: "Pinpointed commit a4f91e8 diff that accidentally raised max-lifetime to 1800000ms.",
    },
    {
      step: "05",
      title: "Informed Resolution",
      subtitle: "Verified SRE Fix",
      summary: "The on-call engineer reviews the proven remediation, authorizes the patch, and restores SLO.",
      detail: "Hot-patched HIKARI_MAX_LIFETIME=540000. Pool saturation normalized from 98% to 18% in 45s.",
    },
  ];

  return (
    <section id="solution" className="relative py-28 bg-[#F8F7F2] border-t border-[#E9E8DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4">
            <span>The Memory-Powered Loop</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight">
            What if your engineering <br />
            <span className="italic font-serif font-normal text-[#267B5B]">team remembered?</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            PagerLore turns post-mortems from static archive documents into active operational memory.
            Every resolved outage contributes to an interconnected knowledge graph ready to assist the next investigation.
          </p>
        </div>

        {/* Step Navigation Pill Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-lg text-left border transition-all text-xs font-mono ${
                  isSelected
                    ? "bg-[#FFFFFF] border-[#267B5B] shadow-editorial text-[#25352D]"
                    : "bg-[#F1F0E9] border-[#E9E8DF] text-[#788579] hover:bg-[#FFFFFF]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                    {s.step}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />}
                </div>
                <div className="font-sans font-semibold text-xs leading-tight truncate">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-8 shadow-editorial">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 flex-1">
              <div className="text-xs font-mono text-[#267B5B] font-semibold uppercase tracking-wider">
                Phase {steps[activeStep].step} · {steps[activeStep].subtitle}
              </div>
              <h3 className="text-2xl font-bold text-[#25352D]">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm text-[#788579] leading-relaxed max-w-xl">
                {steps[activeStep].summary}
              </p>
            </div>

            <div className="w-full lg:w-96 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF] p-4 font-mono text-xs space-y-2">
              <div className="text-[10px] uppercase text-[#788579] tracking-wider font-semibold border-b border-[#E9E8DF] pb-1.5">
                Observed System Evidence
              </div>
              <div className="text-[#25352D] leading-relaxed font-sans text-xs pt-1">
                {steps[activeStep].detail}
              </div>
              <div className="pt-2 border-t border-[#E9E8DF] flex items-center justify-between text-[10px] text-[#788579]">
                <span>Status: VERIFIED</span>
                <span className="text-[#267B5B] font-semibold">Grounded Memory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
