"use client";

import React from "react";
import { Clock, AlertCircle, FileSearch, RefreshCw } from "lucide-react";

export function ProblemSection() {
  return (
    <section id="problem" className="relative py-28 bg-[#FFFFFF] border-t border-[#E9E8DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCF6ED] border border-[#E8D3B6] text-[#C58B43] text-xs font-mono uppercase tracking-wider mb-4">
            <span>The Reality of Production Outages</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight">
            Teams solve the <br />
            <span className="italic font-serif font-normal text-[#C58B43]">same failures twice.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            When an outage strikes at 3 AM, the investigation usually begins from a blank page. The engineers who resolved the same failure six months ago have changed teams or shift rotations, and the post-mortem lives in a forgotten document.
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Six Months Ago */}
          <div className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] pb-3 border-b border-[#E9E8DF] mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B8A17A]" />
                  <span>02:14 AM — First Occurrence</span>
                </span>
                <span className="text-[#25352D] font-semibold">INC-2024-089</span>
              </div>

              <h3 className="text-xl font-bold text-[#25352D] mb-3">
                HikariCP Connection Pool Saturation
              </h3>

              <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                A configuration mismatch between HikariCP&apos;s connection lifetime (30m) and upstream pgBouncer&apos;s idle timeout (10m) drops connections silently, pinning database worker threads.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#FFFFFF] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] mb-0.5">Triage Experience</div>
                  <div className="text-[#25352D]">85 minutes spent debugging query plans, thread dumps, and database locks.</div>
                </div>
                <div className="p-3 rounded bg-[#FFFFFF] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] mb-0.5">Post-Incident Record</div>
                  <div className="text-[#788579]">Filed into a static wiki page. No automated retrieval at runtime.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9E8DF] text-[11px] font-mono text-[#788579]">
              Outcome: Lesson documented, but not connected to runtime systems.
            </div>
          </div>

          {/* Card 2: Tonight */}
          <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E8D3B6] p-8 flex flex-col justify-between shadow-editorial">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#C58B43] pb-3 border-b border-[#E8D3B6] mb-5 font-semibold">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#C58B43]" />
                  <span>03:42 AM — Tonight</span>
                </span>
                <span>INC-2024-142 (Active)</span>
              </div>

              <h3 className="text-xl font-bold text-[#25352D] mb-3">
                Identical Timeout Asymmetry Recurred
              </h3>

              <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                Deployment v2.8.1 inadvertently modified timeout thresholds. A different engineer on call sees the exact same PSQLException error signature.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#FCF6ED] border border-[#E8D3B6]">
                  <div className="text-[10px] uppercase text-[#C58B43] mb-0.5 font-semibold">The Cost of Amnesia</div>
                  <div className="text-[#25352D]">Without persistent memory, the team repeats the exact same failed diagnostic hypotheses.</div>
                </div>
                <div className="p-3 rounded bg-[#EAF2EC] border border-[#BFD8C6]">
                  <div className="text-[10px] uppercase text-[#267B5B] mb-0.5 font-semibold">With PagerLore</div>
                  <div className="text-[#194B38]">Recalls the exact resolution from INC-089 in 12s, cutting MTTR by 68%.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8D3B6] text-[11px] font-mono text-[#267B5B] font-semibold">
              Result: The engineering team leverages previous experience automatically.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
