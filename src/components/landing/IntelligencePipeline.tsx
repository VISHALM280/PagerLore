"use client";

import React from "react";
import { Terminal, Cpu, Database, GitCompare, HelpCircle, CheckSquare, ArrowRight } from "lucide-react";

export function IntelligencePipeline() {
  const stages = [
    {
      num: "01",
      title: "Incident Ingestion",
      icon: Terminal,
      tag: "Real-time Telemetry",
      detail: "Ingests Prometheus metrics, Envoy ingress traces, application logs, and deployment webhook events.",
    },
    {
      num: "02",
      title: "Signal Extraction",
      icon: Cpu,
      tag: "Anomaly Detection",
      detail: "Identifies anomalous error rate spikes (28.4%), connection wait bottlenecks, and git commit diffs.",
    },
    {
      num: "03",
      title: "Hindsight Memory Recall",
      icon: Database,
      tag: "Vectorize Memory Bank",
      detail: "Executes parallel semantic, BM25, and graph queries against historical incidents to retrieve prior root causes.",
    },
    {
      num: "04",
      title: "Similarity Analysis",
      icon: GitCompare,
      tag: "RRF Scoring",
      detail: "Fuses similarity scores: identifies 96% match with INC-2024-089 (HikariCP vs pgBouncer timeout mismatch).",
    },
    {
      num: "05",
      title: "Root-Cause Hypotheses",
      icon: HelpCircle,
      tag: "Ranked Confidence",
      detail: "Formulates competing hypotheses with explicit supporting and contradicting evidence for each possibility.",
    },
    {
      num: "06",
      title: "Human-in-the-Loop Fix",
      icon: CheckSquare,
      tag: "Verified Action",
      detail: "Generates surgical remediation commands requiring explicit SRE sign-off before executing production changes.",
    },
  ];

  return (
    <section id="engine" className="relative py-28 bg-[#05070b] border-t border-[#161f33] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <span>The Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            From raw signals to <br />
            <span className="text-gradient-cyan">contextual answers.</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Unlike generic AI chatbots that guess at root causes or suggest hallucinated scripts,
            PagerLore runs a deterministic 6-stage investigation pipeline grounded in your system&apos;s real history.
          </p>
        </div>

        {/* 6-Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.num}
                className="relative rounded-xl bg-[#0b0f1a] border border-[#1c263c] hover:border-cyan-500/50 p-6 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                      STAGE {stage.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {stage.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#12192c] border border-[#1d2a45] text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {stage.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {stage.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#161f33] flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                  <span>Deterministic SRE Gate</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
