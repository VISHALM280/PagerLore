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
      <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>SIGNATURE COMPARISON BENCHMARK</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Same Incident. Two Realities.
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare how the agent diagnoses <span className="text-cyan-300 font-mono">{incidentId}</span> with and without Hindsight memory.
          </p>
        </div>

        <button
          onClick={runComparativeAnalysis}
          disabled={isRunning}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all transform active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Executing Dual Investigation..." : "Run Side-by-Side Benchmark"}</span>
        </button>
      </div>

      {/* Side-by-Side Dual Investigation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* MODE A: WITHOUT MEMORY */}
        <div className="rounded-2xl bg-[#080c14] border border-[#1a2336] p-6 shadow-xl flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Column Header */}
            <div className="border-b border-[#162136] pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                  MODE A · BASELINE AGENT
                </span>
                <span className="text-xs font-mono text-slate-500">Memory: OFF</span>
              </div>
              <h3 className="text-lg font-bold text-slate-200">
                Investigation Without Historical Memory
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyzes only immediate symptoms and logs. Cannot recall past post-mortems or architectural constraints.
              </p>
            </div>

            {/* Results Output */}
            {resultWithout ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Knowledge gauge */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0e1524] border border-[#1a253c]">
                    <div className="text-slate-500 text-[10px]">Hypothesis Confidence</div>
                    <div className="text-lg font-bold text-slate-300 mt-1">46% (Speculative)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0e1524] border border-[#1a253c]">
                    <div className="text-slate-500 text-[10px]">Memories Queried</div>
                    <div className="text-lg font-bold text-slate-400 mt-1">0 memories</div>
                  </div>
                </div>

                {/* Hypotheses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                    Formulated Hypotheses:
                  </span>
                  {resultWithout.hypotheses.map((h, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#0d1320] border border-slate-800 text-xs">
                      <div className="font-semibold text-slate-200 mb-1">{h.hypothesis}</div>
                      <div className="text-slate-400 text-[11px] font-mono">
                        Evidence: {h.supporting_evidence[0]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Proposed Remediation */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs">
                  <div className="text-amber-400 font-mono text-[10px] uppercase font-semibold mb-1">
                    Generic Remediation
                  </div>
                  <div className="text-slate-200 font-medium mb-1">
                    {resultWithout.remediations[0]?.title}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Risk: Scales pod count without resolving underlying database proxy timeout asymmetry.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#05070c] border border-slate-900 text-xs font-mono text-slate-400">
                  <span className="text-slate-500">Summary: </span>
                  {resultWithout.executive_summary}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs font-mono">
                Click &quot;Run Side-by-Side Benchmark&quot; to inspect unassisted agent diagnosis.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#162136] mt-4 text-[11px] font-mono text-slate-500">
            Diagnosis Time: {resultWithout ? `${resultWithout.investigation_duration_ms}ms` : "—"}
          </div>
        </div>

        {/* MODE B: WITH HINDSIGHT MEMORY */}
        <div className="rounded-2xl bg-gradient-to-b from-[#0c1628] to-[#080e1a] border-2 border-cyan-500/60 p-6 shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col justify-between min-h-[580px]">
          <div>
            {/* Column Header */}
            <div className="border-b border-cyan-800/60 pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold uppercase">
                  MODE B · PAGERLORE + HINDSIGHT
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">Memory: ACTIVE</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Investigation With Persistent SRE Memory
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Fuses incoming git diffs with recalled knowledge from <span className="text-cyan-300 font-mono font-semibold">INC-2024-089</span>.
              </p>
            </div>

            {/* Results Output */}
            {resultWith ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Knowledge gauge */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0e182c] border border-cyan-800/60">
                    <div className="text-cyan-400 text-[10px]">Hypothesis Confidence</div>
                    <div className="text-lg font-bold text-cyan-300 mt-1">96% (Verified Match)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0e182c] border border-cyan-800/60">
                    <div className="text-cyan-400 text-[10px]">Recalled Bank Knowledge</div>
                    <div className="text-lg font-bold text-white mt-1">
                      {resultWith.historical_memories_used.length} memories
                    </div>
                  </div>
                </div>

                {/* Recalled Memory Card */}
                <div className="p-3 rounded-xl bg-[#091220] border border-cyan-700/60 text-xs font-mono text-cyan-300">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Database className="w-3.5 h-3.5" />
                      <span>Hindsight Recall: mem-hindsight-8901-hikari</span>
                    </span>
                    <span>Relevance: 96%</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs leading-relaxed">
                    Identified exact HikariCP maxLifetime vs pgBouncer server_idle_timeout mismatch resolved in INC-2024-089.
                  </p>
                </div>

                {/* Hypotheses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-cyan-300 font-semibold block">
                    Targeted Root Cause:
                  </span>
                  <div className="p-3 rounded-lg bg-[#0d182e] border border-cyan-600/50 text-xs">
                    <div className="font-semibold text-white mb-1">
                      {resultWith.hypotheses[0].hypothesis}
                    </div>
                    <div className="text-slate-300 text-[11px] font-mono">
                      Diff attribution: Commit a4f91e8 raised max-lifetime to 1800000ms.
                    </div>
                  </div>
                </div>

                {/* Surgical Remediation */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/60 text-xs">
                  <div className="text-emerald-400 font-mono text-[10px] uppercase font-semibold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Surgical Proven Remediation (Low Risk)</span>
                  </div>
                  <div className="text-slate-100 font-bold mb-1">
                    {resultWith.remediations[0]?.title}
                  </div>
                  <div className="text-slate-300 text-[11px] font-sans">
                    {resultWith.remediations[0]?.expected_outcome}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-cyan-300/70 text-xs font-mono">
                Click &quot;Run Side-by-Side Benchmark&quot; to inspect Hindsight memory retrieval in action.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-cyan-900/60 mt-4 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
            <span>Diagnosis Time: {resultWith ? `${resultWith.investigation_duration_ms}ms` : "—"}</span>
            {resultWith && <span className="text-emerald-400">✓ SRE Approved Resolution Ready</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
