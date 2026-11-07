"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Activity, Database, CheckCircle2, AlertTriangle, ShieldCheck, Tv, LayoutDashboard, BrainCircuit } from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";
import { StatusBadge } from "../common/StatusBadge";
import { TiltCard } from "../common/TiltCard";

// Dynamic load for 3D vault
const Vault3DScene = dynamic(
  () => import("./Vault3DScene").then((m) => m.Vault3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] rounded-2xl bg-white border border-[#E9E8DF] flex items-center justify-center font-mono text-xs text-[#788579] animate-pulse">
        Loading 3D Vault Mesh...
      </div>
    ),
  }
);

export function ProductPreviewSection() {
  const [activeTab, setActiveTab] = useState<"command" | "benchmark" | "vault3d">("command");

  return (
    <section className="relative py-28 bg-[#F8F7F2] border-t border-[#E9E8DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#21845F]/20 text-[#21845F] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
              <span>Operational Systems</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#24352D] leading-tight">
              Designed for clarity <br />
              <span className="italic font-serif font-normal text-[#21845F]">under pressure.</span>
            </h2>
            <p className="mt-4 text-base text-[#788579] leading-relaxed">
              Minimal, information-dense, and built with deliberate hierarchy. The command center presents actionable telemetry and recalled history without decorative clutter.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="inline-flex rounded-xl bg-white border border-[#E9E8DF] p-1.5 shadow-sm text-xs font-mono">
            <button
              onClick={() => setActiveTab("command")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "command"
                  ? "bg-[#EAF2EC] text-[#21845F] font-bold shadow-sm"
                  : "text-[#788579] hover:text-[#24352D]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </button>
            <button
              onClick={() => setActiveTab("benchmark")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "benchmark"
                  ? "bg-[#EAF2EC] text-[#21845F] font-bold shadow-sm"
                  : "text-[#788579] hover:text-[#24352D]"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Memory Benchmark</span>
            </button>
            <button
              onClick={() => setActiveTab("vault3d")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "vault3d"
                  ? "bg-[#EAF2EC] text-[#21845F] font-bold shadow-sm"
                  : "text-[#788579] hover:text-[#24352D]"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>3D Knowledge Vault</span>
            </button>
          </div>
        </div>

        {/* Live Interface Preview Window */}
        <TiltCard maxTilt={3} glare={false} className="rounded-2xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
          {/* Mock Browser Header */}
          <div className="h-11 bg-[#F1F0E9] border-b border-[#E9E8DF] px-4 flex items-center justify-between text-xs font-mono text-[#788579]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0D5C3]" />
              <span className="ml-3 text-[11px] text-[#24352D] font-bold">
                pagerlore.internal / {activeTab}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#21845F] animate-pulse" />
              <span className="text-[11px]">Hindsight Bank: Connected (Live)</span>
            </div>
          </div>

          {/* TAB 1: COMMAND CENTER PREVIEW */}
          {activeTab === "command" && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Active Outage Banner */}
              <div className="rounded-xl bg-[#FAF0F0] border border-[#E8BABA] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <SeverityBadge severity="SEV-1" size="sm" />
                    <span className="text-[#C94F4F] font-bold">INC-2024-142</span>
                    <span className="text-[#9A9C91]">·</span>
                    <span className="text-[#24352D] font-bold">payments-service</span>
                    <span className="text-[#9A9C91]">·</span>
                    <span className="text-[#788579]">14m duration</span>
                  </div>
                  <div className="text-sm font-bold text-[#24352D]">
                    Payments Service 500 Internal Server Errors following v2.8.1 Release
                  </div>
                  <div className="text-xs text-[#788579] font-mono">
                    Matched Memory: <strong className="text-[#21845F]">INC-2024-089 (96% Confidence)</strong> · HikariCP maxLifetime mismatch
                  </div>
                </div>

                <Link
                  href="/investigate?incident=INC-2024-142"
                  className="px-4 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#194B38] text-white text-xs font-semibold flex items-center justify-center gap-1.5 self-start md:self-auto transition-all shadow-sm"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Investigate with Memory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] font-semibold">Error Rate</div>
                  <div className="text-xl font-bold text-[#C94F4F] mt-1">28.4%</div>
                  <div className="text-[10px] text-[#9A9C91] mt-0.5">SLO Target: &lt; 0.05%</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] font-semibold">p95 Latency</div>
                  <div className="text-xl font-bold text-[#C94F4F] mt-1">2,840ms</div>
                  <div className="text-[10px] text-[#9A9C91] mt-0.5">Baseline: 145ms</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] font-semibold">DB Pool Saturation</div>
                  <div className="text-xl font-bold text-[#C58B43] mt-1">98.6%</div>
                  <div className="text-[10px] text-[#9A9C91] mt-0.5">50/50 Connections Pinned</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] font-semibold">MTTR Reduction</div>
                  <div className="text-xl font-bold text-[#21845F] mt-1">-68%</div>
                  <div className="text-[10px] text-[#21845F] mt-0.5 font-bold">With Hindsight Memory</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMORY BENCHMARK PREVIEW */}
          {activeTab === "benchmark" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch font-mono text-xs">
                {/* Mode A */}
                <div className="p-6 rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E8DF]">
                    <span className="font-bold text-[#788579] uppercase">Mode A · Without Memory</span>
                    <span className="text-[10px] text-[#9A9C91]">Isolated Baseline</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#24352D]">46%</div>
                    <div className="text-xs text-[#788579] mt-0.5">Hypothesis Confidence (Speculative)</div>
                  </div>
                  <p className="text-xs font-sans text-[#788579] leading-relaxed">
                    Agent diagnoses symptoms without historical context. Recommends scaling pods from 3 to 6 instances, which would double connection load on pgBouncer and crash the service.
                  </p>
                  <div className="p-3 rounded-xl bg-[#FCF6ED] border border-[#E8D3B6] text-[#C58B43]">
                    Proposed: Restart service / Scale Pods (Dangerous)
                  </div>
                </div>

                {/* Mode B */}
                <div className="p-6 rounded-2xl bg-white border-2 border-[#21845F] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#21845F]/20">
                    <span className="font-bold text-[#21845F] uppercase">Mode B · With Hindsight</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#21845F] text-[10px] font-bold">
                      VERIFIED MATCH
                    </span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#21845F]">96%</div>
                    <div className="text-xs text-[#21845F] mt-0.5 font-bold">Ground Truth Match Confidence</div>
                  </div>
                  <p className="text-xs font-sans text-[#24352D] leading-relaxed">
                    Recalls INC-2024-089 in 12s. Identifies exact HikariCP maxLifetime vs pgBouncer idle timeout mismatch. Prescribes surgical hot-patch with zero downtime.
                  </p>
                  <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#21845F]/30 text-[#194B38] font-semibold flex items-center justify-between">
                    <span>Hot-Patch HIKARI_MAX_LIFETIME=540000</span>
                    <ShieldCheck className="w-4 h-4 text-[#21845F]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/theatre"
                  className="px-5 py-2.5 rounded-xl bg-[#21845F] hover:bg-[#194B38] text-white text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>Launch Live Comparator Theatre</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: 3D VAULT ORBIT VIEW */}
          {activeTab === "vault3d" && (
            <div className="p-4 sm:p-6 space-y-4">
              <Vault3DScene />
              <div className="flex justify-between items-center text-xs font-mono px-2">
                <span className="text-[#788579]">Persistent memory bank: <strong>pagerlore-production-bank</strong></span>
                <Link
                  href="/vault"
                  className="text-[#21845F] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Open Full Memory Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </TiltCard>
      </div>
    </section>
  );
}
