"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Database, GitBranch, Shield } from "lucide-react";

export function LearningLoopSection() {
  const loopEvents = [
    {
      date: "August 2024",
      incident: "INC-2024-089: HikariCP / pgBouncer Desynchronization",
      service: "payments-service",
      retainedKnowledge: "Rule retained: HikariCP maxLifetime must be <= pgBouncer server_idle_timeout - 60s.",
      retentionStatus: "Retained in Hindsight Bank",
    },
    {
      date: "September 2024",
      incident: "INC-2024-102: Kafka Consumer Rebalance Cascade",
      service: "order-processor",
      retainedKnowledge: "Decoupled heavy PDF invoice rendering from main Kafka poll loop; doubled max.poll.interval.ms.",
      retentionStatus: "Retained in Hindsight Bank",
    },
    {
      date: "October 2024",
      incident: "INC-2024-118: Redis Token Thundering Herd Stampede",
      service: "auth-service",
      retainedKnowledge: "Added 15% random TTL jitter and implemented Go singleflight request deduplication on cache misses.",
      retentionStatus: "Retained in Hindsight Bank",
    },
    {
      date: "Today (Live)",
      incident: "INC-2024-142: Payments Latency Surge post-v2.8.1",
      service: "payments-service",
      retainedKnowledge: "Instant recall of INC-089 rule. Identified commit regression in 12s. Remediation executed safely.",
      retentionStatus: "Active Memory Retrieval in Action",
    },
  ];

  return (
    <section className="relative py-28 bg-[#07090e] border-t border-[#161f33] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Accumulated Institutional Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Every resolution changes <br />
            <span className="text-gradient-cyan">what happens next.</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            As your systems evolve, PagerLore grows smarter with every resolved outage.
            Post-mortems don&apos;t rot in Google Docs—they become executable diagnostic instinct for the next on-call shift.
          </p>
        </div>

        {/* Connected Timeline */}
        <div className="relative border-l border-[#1e2d4a] ml-4 sm:ml-32 space-y-12">
          {loopEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0d1627] border-2 border-cyan-400 group-hover:scale-125 transition-transform shadow-[0_0_10px_#00f0ff]" />

              {/* Timestamp label on left for larger screens */}
              <div className="hidden sm:block absolute -left-36 top-1 text-xs font-mono text-slate-500 w-28 text-right">
                {evt.date}
              </div>

              <div className="rounded-xl bg-[#0b0f1a] border border-[#1c263c] p-5 hover:border-cyan-500/50 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {evt.incident}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12192c] text-cyan-400 border border-cyan-800/40 w-fit">
                    {evt.service}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                  {evt.retainedKnowledge}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                  <Database className="w-3.5 h-3.5" />
                  <span>{evt.retentionStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
