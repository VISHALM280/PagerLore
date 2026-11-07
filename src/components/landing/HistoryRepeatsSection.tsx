"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Database,
  ShieldCheck,
  TrendingDown,
  Layers,
  GitBranch,
  Repeat,
} from "lucide-react";
import { TiltCard } from "../common/TiltCard";

export function HistoryRepeatsSection() {
  const [activePattern, setActivePattern] = useState<number>(0);

  const patterns = [
    {
      id: "pat-1",
      title: "Connection Pool & Proxy Timeout Asymmetry",
      service: "payments-service",
      rootCause: "Client maxLifetime exceeds proxy server_idle_timeout, leaving dead TCP sockets in pool.",
      firstIncident: {
        id: "INC-2024-089",
        date: "August 14 (5 months ago)",
        downtime: "26 minutes",
        triage: "Painstaking multi-hour diagnostic ruled out query locks, eventually finding pgBouncer TCP drops.",
        resolution: "Set HikariCP maxLifetime to 540s (below pgBouncer 600s). Documented in post-mortem.",
      },
      recurrenceIncident: {
        id: "INC-2024-142",
        date: "Present Day (Deployment v2.8.1)",
        trigger: "New engineer unwittingly bumped max-lifetime back to 1800s in application.yml.",
        outcomeWithoutMemory: "48 minutes downtime, trial-and-error pod restarts, $86,400 in abandoned carts.",
        outcomeWithPagerLore: "4 minutes to resolution: Hindsight immediately recalled INC-089 with 96% match.",
      },
    },
    {
      id: "pat-2",
      title: "Synchronized Cache Key Expiration Stampede",
      service: "auth-service",
      rootCause: "Top-of-hour session token expiry without randomized TTL jitter saturates database replicas.",
      firstIncident: {
        id: "INC-2024-118",
        date: "October 12 (2 months ago)",
        downtime: "35 minutes",
        triage: "Database connection pool pinned at 100% due to 85,000 keys concurrently expiring in Redis.",
        resolution: "Applied 15% random TTL jitter (+/- 540s) and implemented Go singleflight request deduplication.",
      },
      recurrenceIncident: {
        id: "INC-2024-168",
        date: "Present Day (Deployment v3.5.0)",
        trigger: "Refactored token manager removed random jitter to enforce strict 1-hour expiry.",
        outcomeWithoutMemory: "504 Gateway Timeout cascade affecting 11,000 active sessions across all mobile clients.",
        outcomeWithPagerLore: "Instant recall: surfaces singleflight and jitter rule before engineers restart Redis.",
      },
    },
    {
      id: "pat-3",
      title: "Consumer STW GC Pauses Breaking Kafka Membership",
      service: "order-processor",
      rootCause: "Heavy memory allocation during batch operations triggers GC pauses exceeding max.poll.interval.ms.",
      firstIncident: {
        id: "INC-2024-102",
        date: "September 02 (3 months ago)",
        downtime: "48 minutes",
        triage: "Continuous consumer group rebalances; scaling worker pods doubled partition rebalance storms.",
        resolution: "Decoupled PDF invoice generation to async worker pool and increased max.poll.interval.ms to 600s.",
      },
      recurrenceIncident: {
        id: "INC-2024-155",
        date: "Present Day (Deployment v1.20.1)",
        trigger: "Inline email attachment feature introduced synchronous byte array rendering back into consumer thread.",
        outcomeWithoutMemory: "Order fulfillment backlog surged to 18,500 messages while engineers guessed network failure.",
        outcomeWithPagerLore: "PagerLore isolates the 7.9s GC pause and links directly to the async worker pattern from INC-102.",
      },
    },
  ];

  const current = patterns[activePattern];

  return (
    <section id="history-repeats" className="relative py-28 bg-[#F8F7F2] text-[#25352D] border-t border-[#E9E8DF]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <Repeat className="w-3.5 h-3.5" />
            <span>The Reality of Tribal Knowledge Loss</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight font-sans">
            Systems forget. <br />
            <span className="font-serif italic font-normal text-[#267B5B]">
              Engineers shouldn&apos;t have to.
            </span>
          </h2>

          <p className="mt-4 text-base text-[#788579] font-sans leading-relaxed">
            Every software engineering organization suffers from knowledge evaporation: on-call engineers rotate, post-mortems get buried in wiki silos, and months later the same architectural flaw strikes production again.
          </p>
        </div>

        {/* Pattern Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {patterns.map((p, idx) => {
            const isSelected = activePattern === idx;
            return (
              <button
                key={p.id}
                onClick={() => setActivePattern(idx)}
                className={`p-4 rounded-xl text-left border transition-all text-xs font-mono ${
                  isSelected
                    ? "bg-[#FFFFFF] border-[#267B5B] shadow-sm text-[#25352D]"
                    : "bg-[#F1F0E9] border-[#E9E8DF] text-[#788579] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                    PATTERN 0{idx + 1}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />}
                </div>
                <div className="font-sans font-bold text-sm text-[#25352D] leading-tight">
                  {p.title}
                </div>
                <div className="text-[11px] text-[#788579] mt-1 truncate">
                  Affected: {p.service}
                </div>
              </button>
            );
          })}
        </div>

        {/* Comparison Board: The Past Lesson vs The Recurring Outage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: The Original Outage (Past Lesson) */}
          <TiltCard maxTilt={3} glare={false} className="rounded-2xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F0E9] text-[#788579] font-bold uppercase">
                    PAST INCIDENT
                  </span>
                  <h3 className="text-lg font-bold text-[#25352D] mt-1 font-sans">
                    {current.firstIncident.id}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#788579]">
                  {current.firstIncident.date}
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#788579] block mb-1 font-bold">
                    Systemic Root Cause Discovered:
                  </span>
                  <p className="text-[#25352D] leading-relaxed p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] font-mono text-xs">
                    {current.rootCause}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-[#788579] block mb-1 font-bold">
                    Painstaking Triage Effort:
                  </span>
                  <p className="text-[#788579] leading-relaxed">
                    {current.firstIncident.triage}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-[#267B5B] block mb-1 font-bold">
                    Verified Resolution & Rule:
                  </span>
                  <p className="text-[#194B38] leading-relaxed p-3 rounded-xl bg-[#EAF2EC] border border-[#BFD8C6]">
                    {current.firstIncident.resolution}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E8DF] mt-6 flex items-center justify-between text-xs font-mono text-[#788579]">
              <span>Original MTTR: {current.firstIncident.downtime}</span>
              <span className="text-[#267B5B] font-semibold">Buried in Post-Mortem Wiki</span>
            </div>
          </TiltCard>

          {/* Right Card: The Recurrence (Without vs With PagerLore) */}
          <TiltCard maxTilt={3} glare={false} className="rounded-2xl bg-[#FFFFFF] border-2 border-[#267B5B] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAF2EC] text-[#267B5B] font-bold uppercase border border-[#BFD8C6]">
                    IDENTICAL RECURRENCE
                  </span>
                  <h3 className="text-lg font-bold text-[#25352D] mt-1 font-sans">
                    {current.recurrenceIncident.id}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#267B5B] font-semibold">
                  {current.recurrenceIncident.date}
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#C94F4F] block mb-1 font-bold">
                    How The Regression Happened:
                  </span>
                  <p className="text-[#25352D] leading-relaxed p-3 rounded-xl bg-[#FAF0F0] border border-[#E8BABA]">
                    {current.recurrenceIncident.trigger}
                  </p>
                </div>

                {/* The Divergence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#FAF0F0] border border-[#E8BABA] space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#C94F4F] block">
                      WITHOUT MEMORY
                    </span>
                    <p className="text-[#25352D] text-xs leading-relaxed">
                      {current.recurrenceIncident.outcomeWithoutMemory}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#BFD8C6] space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#267B5B] block">
                      WITH PAGERLORE
                    </span>
                    <p className="text-[#194B38] text-xs leading-relaxed font-semibold">
                      {current.recurrenceIncident.outcomeWithPagerLore}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E8DF] mt-6 flex items-center justify-between text-xs font-mono">
              <span className="text-[#788579]">Downtime Eliminated: -92%</span>
              <Link
                href="/theatre"
                className="text-[#267B5B] hover:text-[#194B38] font-bold flex items-center gap-1 transition-colors"
              >
                <span>Run A/B Benchmark →</span>
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
