"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Activity, Database, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";
import { StatusBadge } from "../common/StatusBadge";

export function ProductPreviewSection() {
  return (
    <section className="relative py-28 bg-[#F8F7F2] border-t border-[#E9E8DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4">
            <span>Operational Interface</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight">
            Designed for clarity <br />
            <span className="italic font-serif font-normal text-[#267B5B]">under pressure.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            Minimal, information-dense, and built with deliberate hierarchy. The command center presents actionable telemetry and recalled history without decorative clutter.
          </p>
        </div>

        {/* Live Interface Preview Window */}
        <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-elevated overflow-hidden">
          {/* Mock Browser Header */}
          <div className="h-10 bg-[#F1F0E9] border-b border-[#E9E8DF] px-4 flex items-center justify-between text-xs font-mono text-[#788579]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="ml-3 text-[11px] text-[#25352D] font-medium">pagerlore.internal / command</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#267B5B]" />
              <span className="text-[11px]">Bank: pagerlore-production</span>
            </div>
          </div>

          {/* Inner Command Center Preview */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Active Outage Banner */}
            <div className="rounded-lg bg-[#FAF0F0] border border-[#E8BABA] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <SeverityBadge severity="SEV-1" size="sm" />
                  <span className="text-[#C94F4F] font-bold">INC-2024-142</span>
                  <span className="text-[#9A9C91]">·</span>
                  <span className="text-[#25352D]">payments-service</span>
                  <span className="text-[#9A9C91]">·</span>
                  <span className="text-[#788579]">14m duration</span>
                </div>
                <div className="text-sm font-bold text-[#25352D]">
                  Payments Service 500 Internal Server Errors following v2.8.1 Release
                </div>
                <div className="text-xs text-[#788579] font-mono">
                  Matched Memory: <strong className="text-[#267B5B]">INC-2024-089 (96% Confidence)</strong> · HikariCP maxLifetime mismatch
                </div>
              </div>

              <Link
                href="/investigate?incident=INC-2024-142"
                className="px-4 py-2 rounded bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-medium font-sans flex items-center justify-center gap-1.5 self-start md:self-auto transition-colors"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF]">
                <div className="text-[10px] uppercase text-[#788579]">Error Rate</div>
                <div className="text-xl font-bold text-[#C94F4F] mt-1">28.4%</div>
                <div className="text-[10px] text-[#9A9C91] mt-0.5">SLO Target: &lt; 0.05%</div>
              </div>

              <div className="p-4 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF]">
                <div className="text-[10px] uppercase text-[#788579]">p95 Latency</div>
                <div className="text-xl font-bold text-[#C94F4F] mt-1">2,840ms</div>
                <div className="text-[10px] text-[#9A9C91] mt-0.5">Baseline: 145ms</div>
              </div>

              <div className="p-4 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF]">
                <div className="text-[10px] uppercase text-[#788579]">DB Pool Saturation</div>
                <div className="text-xl font-bold text-[#C58B43] mt-1">98.6%</div>
                <div className="text-[10px] text-[#9A9C91] mt-0.5">50/50 Connections Pinned</div>
              </div>

              <div className="p-4 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF]">
                <div className="text-[10px] uppercase text-[#788579]">MTTR Reduction</div>
                <div className="text-xl font-bold text-[#267B5B] mt-1">-68%</div>
                <div className="text-[10px] text-[#267B5B] mt-0.5">With Hindsight Memory</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

