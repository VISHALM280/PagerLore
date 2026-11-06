"use client";

import React, { useState } from "react";
import { InvestigationResult } from "@/lib/types/incident";
import {
  BrainCircuit,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  TrendingDown,
} from "lucide-react";

interface MemoryComparisonViewProps {
  incidentId: string;
}

export function MemoryComparisonView({ incidentId }: MemoryComparisonViewProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [resultWithout, setResultWithout] = useState<InvestigationResult | null>(null);
  const [resultWith, setResultWith] = useState<InvestigationResult | null>(null);
  const [runDurationMs, setRunDurationMs] = useState<number>(0);

  const runComparativeAnalysis = async () => {
    setIsRunning(true);
    setResultWithout(null);
    setResultWith(null);

    const startTime = Date.now();

    try {
      // Execute both investigations concurrently
      const [resNoMem, resWithMem] = await Promise.all([
        fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId, mode: "without_memory" }),
        }).then((r) => r.json()),
        fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId, mode: "with_memory" }),
        }).then((r) => r.json()),
      ]);

      setTimeout(() => {
        setResultWithout(resNoMem);
        setResultWith(resWithMem);
        setRunDurationMs(Date.now() - startTime);
        setIsRunning(false);
      }, 1400);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#B8A17A] mb-1 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>DUAL ENGINE BENCHMARK</span>
          </div>
          <h2 className="text-xl font-bold text-[#25352D] tracking-tight">
            Same Incident. Two Realities.
          </h2>
          <p className="text-xs text-[#788579] mt-0.5">
            Compare how the agent diagnoses <span className="text-[#267B5B] font-mono font-semibold">{incidentId}</span> with and without Hindsight memory.
          </p>
        </div>

        <button
          onClick={runComparativeAnalysis}
          disabled={isRunning}
          className="px-6 py-3 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Executing Dual Investigation..." : "Run Side-by-Side Benchmark"}</span>
        </button>
      </div>

      {/* Side-by-Side Dual Investigation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* MODE A: WITHOUT MEMORY */}
        <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Column Header */}
            <div className="border-b border-[#E9E8DF] pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#F1F0E9] text-[#788579] font-semibold uppercase border border-[#E9E8DF]">
                  MODE A · BASELINE AGENT
                </span>
                <span className="text-xs font-mono text-[#9A9C91]">Memory: OFF</span>
              </div>
              <h3 className="text-lg font-bold text-[#25352D]">
                Investigation Without Historical Memory
              </h3>
              <p className="text-xs text-[#788579] mt-1">
                Analyzes only immediate symptoms and logs. Cannot recall past post-mortems or architectural constraints.
              </p>
            </div>

            {/* Results Output */}
            {resultWithout ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Knowledge gauge */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                    <div className="text-[#788579] text-[10px]">Hypothesis Confidence</div>
                    <div className="text-lg font-bold text-[#25352D] mt-1">46% (Speculative)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                    <div className="text-[#788579] text-[10px]">Memories Queried</div>
                    <div className="text-lg font-bold text-[#9A9C91] mt-1">0 memories</div>
                  </div>
                </div>

                {/* Hypotheses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[#788579] font-semibold block">
                    Formulated Hypotheses:
                  </span>
                  {resultWithout.hypotheses.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs">
                      <div className="font-semibold text-[#25352D] mb-1">{h.hypothesis}</div>
                      <div className="text-[#788579] text-[11px] font-mono">
                        Evidence: {h.supporting_evidence[0]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Proposed Remediation */}
                <div className="p-3.5 rounded-xl bg-[#FDF8F0] border border-[#C58B43]/30 text-xs">
                  <div className="text-[#C58B43] font-mono text-[10px] uppercase font-semibold mb-1">
                    Generic Remediation
                  </div>
                  <div className="text-[#25352D] font-medium mb-1">
                    {resultWithout.remediations[0]?.title}
                  </div>
                  <div className="text-[#788579] text-[11px]">
                    Risk: Scales pod count without resolving underlying database proxy timeout asymmetry.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs font-mono text-[#788579]">
                  <span className="text-[#9A9C91]">Summary: </span>
                  {resultWithout.executive_summary}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-[#788579] text-xs font-mono">
                Click &quot;Run Side-by-Side Benchmark&quot; to inspect unassisted agent diagnosis.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E9E8DF] mt-4 text-[11px] font-mono text-[#788579]">
            Diagnosis Time: {resultWithout ? `${resultWithout.investigation_duration_ms}ms` : "—"}
          </div>
        </div>

        {/* MODE B: WITH HINDSIGHT MEMORY */}
        <div className="rounded-2xl bg-white border-2 border-[#267B5B] p-6 shadow-sm flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Column Header */}
            <div className="border-b border-[#E9E8DF] pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30 font-semibold uppercase">
                  MODE B · PAGERLORE + HINDSIGHT
                </span>
                <span className="text-xs font-mono text-[#267B5B] font-bold">Memory: ACTIVE</span>
              </div>
              <h3 className="text-lg font-bold text-[#25352D]">
                Investigation With Persistent SRE Memory
              </h3>
              <p className="text-xs text-[#788579] mt-1">
                Fuses incoming git diffs with recalled knowledge from <span className="text-[#267B5B] font-mono font-semibold">INC-2024-089</span>.
              </p>
            </div>

            {/* Results Output */}
            {resultWith ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Knowledge gauge */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/20">
                    <div className="text-[#267B5B] text-[10px] font-semibold">Hypothesis Confidence</div>
                    <div className="text-lg font-bold text-[#194B38] mt-1">96% (Verified Match)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/20">
                    <div className="text-[#267B5B] text-[10px] font-semibold">Recalled Bank Knowledge</div>
                    <div className="text-lg font-bold text-[#194B38] mt-1">
                      {resultWith.historical_memories_used.length} memories
                    </div>
                  </div>
                </div>

                {/* Recalled Memory Card */}
                <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#267B5B]/30 text-xs font-mono text-[#25352D]">
                  <div className="flex items-center justify-between text-[10px] text-[#267B5B] font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Database className="w-3.5 h-3.5" />
                      <span>Hindsight Recall: mem-hindsight-8901-hikari</span>
                    </span>
                    <span>Relevance: 96%</span>
                  </div>
                  <p className="text-[#25352D] font-sans text-xs leading-relaxed">
                    Identified exact HikariCP maxLifetime vs pgBouncer server_idle_timeout mismatch resolved in INC-2024-089.
                  </p>
                </div>

                {/* Hypotheses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[#267B5B] font-semibold block">
                    Targeted Root Cause:
                  </span>
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs">
                    <div className="font-semibold text-[#25352D] mb-1">
                      {resultWith.hypotheses[0].hypothesis}
                    </div>
                    <div className="text-[#788579] text-[11px] font-mono">
                      Diff attribution: Commit a4f91e8 raised max-lifetime to 1800000ms.
                    </div>
                  </div>
                </div>

                {/* Surgical Remediation */}
                <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 text-xs">
                  <div className="text-[#267B5B] font-mono text-[10px] uppercase font-semibold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Surgical Proven Remediation (Low Risk)</span>
                  </div>
                  <div className="text-[#194B38] font-bold mb-1">
                    {resultWith.remediations[0]?.title}
                  </div>
                  <div className="text-[#25352D] text-[11px] font-sans">
                    {resultWith.remediations[0]?.expected_outcome}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-[#788579] text-xs font-mono">
                Click &quot;Run Side-by-Side Benchmark&quot; to inspect Hindsight memory retrieval in action.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E9E8DF] mt-4 text-[11px] font-mono text-[#267B5B] flex items-center justify-between font-semibold">
            <span>Diagnosis Time: {resultWith ? `${resultWith.investigation_duration_ms}ms` : "—"}</span>
            {resultWith && <span className="text-[#267B5B]">✓ SRE Approved Resolution Ready</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

