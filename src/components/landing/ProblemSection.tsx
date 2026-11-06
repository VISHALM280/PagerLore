"use client";

import React from "react";
import { AlertCircle, Clock, Search, HelpCircle, Flame, ServerCrash } from "lucide-react";

export function ProblemSection() {
  const painPoints = [
    {
      time: "02:14 AM — 6 Months Ago",
      title: "HikariCP Connection Pool Saturation",
      service: "payments-service",
      symptom: "HTTP 500 errors spike to 24%. p95 latency exceeds 3000ms after config change.",
      engineerReaction: "On-call engineer spends 85 minutes reading raw logs, rebooting pods, guessing at DB lock contention, and searching disconnected Slack channels.",
      resolution: "Finally discovers HikariCP maxLifetime was 30m while pgBouncer dropped connections at 10m.",
      memoryStored: "Lost in a forgotten Notion doc. No automated retrieval.",
      status: "pain",
    },
    {
      time: "03:42 AM — Tonight",
      title: "Identical Timeout Asymmetry Recurred",
      service: "payments-service",
      symptom: "v2.8.1 changes connection parameters. Immediate HTTP 500 spike and pool lockup.",
      engineerReaction: "A DIFFERENT engineer is on call. They start from a blank slate. They repeat the exact same failed diagnostic steps.",
      resolution: "The company pays another 90 minutes of outage downtime and abandoned customer carts.",
      memoryStored: "Without PagerLore, your team's hard-won experience resets on every shift rotation.",
      status: "critical",
    },
  ];

  return (
    <section id="problem" className="relative py-28 bg-[#05070b] border-t border-[#161f33] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-950/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>The Production Amnesia Cycle</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Same failures. <br />
            <span className="text-red-400">Different nights.</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            When production breaks, engineering teams repeatedly diagnose the same failure modes from scratch.
            Post-mortems are filed away in wikis, while on-call engineers search Slack at 3 AM hoping someone remembers what worked.
          </p>
        </div>

        {/* Before / After Timeline Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {painPoints.map((item, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                item.status === "critical"
                  ? "bg-[#0f1422] border-2 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                  : "bg-[#0b0f1a] border border-[#1c263c]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {item.time}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      item.status === "critical"
                        ? "bg-red-900/60 text-red-300 border border-red-700/60"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.service}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>

                <div className="p-3 rounded-lg bg-[#07090e] border border-slate-800/80 mb-4 font-mono text-xs text-red-300/90 leading-relaxed">
                  <span className="text-slate-500">Symptom: </span>
                  {item.symptom}
                </div>

                <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">The On-Call Experience: </strong>
                      {item.engineerReaction}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Search className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">Resolution Finding: </strong>
                      {item.resolution}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl text-xs font-mono ${
                  item.status === "critical"
                    ? "bg-red-950/40 border border-red-800/60 text-red-300"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400"
                }`}
              >
                ⚠️ {item.memoryStored}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#090d18] border border-[#1e2d4a] max-w-3xl mx-auto">
          <p className="text-sm text-slate-300 font-sans">
            Every incident is an expensive masterclass in how your system breaks.
            <span className="text-cyan-400 font-semibold"> PagerLore ensures your engineering organization retains the lesson forever.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
