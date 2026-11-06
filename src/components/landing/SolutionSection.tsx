"use client";

import React, { useState } from "react";
import { Database, BrainCircuit, Sparkles, ArrowRight, CheckCircle2, History, ShieldCheck } from "lucide-react";

export function SolutionSection() {
  const [activeStep, setActiveStep] = useState(2); // default to Historical Recall

  const steps = [
    {
      id: 0,
      title: "01 · Past Incident",
      subtitle: "The Production Outage",
      badge: "INC-2024-089",
      description: "An expensive checkout outage occurs. Engineers spend hours isolating HikariCP connection pool exhaustion and pgBouncer timeout asymmetry.",
      detailHeader: "Captured Telemetry & Metrics",
      detailContent: "PSQLException: Connection is not available, request timed out after 30005ms. Pool saturation: 100%.",
      icon: History,
    },
    {
      id: 1,
      title: "02 · Retained Experience",
      subtitle: "Hindsight RETAIN",
      badge: "Core Operation",
      description: "Upon incident resolution, PagerLore extracts structured facts, verified root causes, and configuration relationships into an isolated Hindsight memory bank.",
      detailHeader: "Structured Extraction in Memory Bank",
      detailContent: "Fact: HikariCP maxLifetime must be strictly < pgBouncer server_idle_timeout (540s vs 600s).",
      icon: Database,
    },
    {
      id: 2,
      title: "03 · Historical Recall",
      subtitle: "Hindsight RECALL",
      badge: "Multi-Path RRF",
      description: "When a new incident exhibits connection wait spikes or deployment regressions, Hindsight executes semantic, keyword, graph, and temporal search in parallel.",
      detailHeader: "Multi-Strategy Retrieval Result",
      detailContent: "Relevance score: 0.96. Instant match: 'Identical pool starvation pattern resolved in INC-2024-089'.",
      icon: BrainCircuit,
    },
    {
      id: 3,
      title: "04 · New Investigation",
      subtitle: "Contextual Agent Reasoning",
      badge: "No Hallucination",
      description: "PagerLore correlates incoming git commit diffs with recalled historical memories, directly identifying the exact misconfigured parameter in seconds.",
      detailHeader: "Evidence-Backed Hypothesis",
      detailContent: "Commit a4f91e8 raised max-lifetime to 1800000ms, violating the documented pgBouncer boundary rule.",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "05 · Verified Resolution",
      subtitle: "Human-in-the-Loop Fix",
      badge: "SRE Verified",
      description: "The on-call engineer inspects the exact historical proof, verifies the low-risk remediation, approves execution, and resolves the incident in minutes.",
      detailHeader: "Approved Remediation Action",
      detailContent: "Hot-patched HIKARI_MAX_LIFETIME to 540000ms. Saturation dropped from 99% to 18% in 45s.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="solution" className="relative py-28 bg-[#07090e] border-t border-[#161f33] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Memory-Powered Loop</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Give your engineering team <br />
            <span className="text-gradient-cyan">a permanent memory.</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Powered by <strong>Hindsight</strong>, PagerLore bridges the gap between historical post-mortems and active incident response.
            Every outage leaves a verified lesson—indexed, interconnected, and ready the moment a symptom reappears.
          </p>
        </div>

        {/* Step Progression Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-[#111a2e] border-cyan-500 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-white"
                    : "bg-[#0b0f1a] border-[#1c263c] text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-cyan-950 text-cyan-300 border border-cyan-700/50" : "bg-slate-900 text-slate-500"
                  }`}>
                    {s.badge}
                  </span>
                </div>
                <div className="text-xs font-bold leading-tight truncate">{s.title}</div>
                <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{s.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Interactive Showcase Card */}
        <div className="rounded-2xl bg-[#0d1424] border border-[#1e2d4a] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <span>Phase {activeStep + 1} of 5</span>
                <span>·</span>
                <span>{steps[activeStep].subtitle}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {steps[activeStep].title.replace(/^\d+ · /, "")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xl">
                {steps[activeStep].description}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ground truth provenance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Zero hallucinated resolutions</span>
                </div>
              </div>
            </div>

            {/* Code / Telemetry Panel */}
            <div className="w-full lg:w-96 rounded-xl bg-[#07090e] border border-cyan-950/80 p-4 font-mono text-xs">
              <div className="text-[10px] uppercase text-cyan-400 tracking-wider font-semibold border-b border-[#1c263c] pb-2 mb-3">
                {steps[activeStep].detailHeader}
              </div>
              <div className="text-slate-300 bg-[#0c1220] p-3 rounded-lg border border-[#162136] leading-relaxed">
                {steps[activeStep].detailContent}
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                <span>Bank: pagerlore-production-bank</span>
                <span className="text-emerald-400">STATUS: VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
