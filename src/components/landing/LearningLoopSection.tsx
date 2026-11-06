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
    <section className="relative py-28 bg-[#F8F7F2] border-t border-[#E9E8DF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#267B5B]/30 text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Accumulated Institutional Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#25352D] tracking-tight leading-tight">
            Every resolution changes <br />
            <span className="text-[#267B5B]">what happens next.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            As your systems evolve, PagerLore grows smarter with every resolved outage.
            Post-mortems don&apos;t rot in Google Docs—they become executable diagnostic instinct for the next on-call shift.
          </p>
        </div>

        {/* Connected Timeline */}
        <div className="relative border-l border-[#E9E8DF] ml-4 sm:ml-32 space-y-12">
          {loopEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#267B5B] group-hover:scale-125 transition-transform shadow-sm" />

              {/* Timestamp label on left for larger screens */}
              <div className="hidden sm:block absolute -left-36 top-1 text-xs font-mono text-[#788579] w-28 text-right font-semibold">
                {evt.date}
              </div>

              <div className="rounded-xl bg-white border border-[#E9E8DF] p-5 hover:border-[#267B5B]/50 transition-all shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-[#25352D] group-hover:text-[#267B5B] transition-colors">
                    {evt.incident}
                  </h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30 w-fit font-semibold">
                    {evt.service}
                  </span>
                </div>

                <p className="text-xs text-[#25352D] font-sans leading-relaxed mb-3">
                  {evt.retainedKnowledge}
                </p>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#267B5B] font-semibold">
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

