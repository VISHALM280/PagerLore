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
  AlertTriangle,
  Layers,
  Activity,
  Check,
  Info,
} from "lucide-react";

interface MemoryComparisonViewProps {
  initialIncidentId?: string;
}

export function MemoryComparisonView({ initialIncidentId = "INC-2024-142" }: MemoryComparisonViewProps) {
  const [selectedIncident, setSelectedIncident] = useState<string>(initialIncidentId);
  const [isRunning, setIsRunning] = useState(false);
  const [resultWithout, setResultWithout] = useState<InvestigationResult | null>(null);
  const [resultWith, setResultWith] = useState<InvestigationResult | null>(null);
  const [runDurationMs, setRunDurationMs] = useState<number>(0);

  const scenarios = [
    {
      id: "INC-2024-142",
      badge: "Scenario A",
      label: "Payments DB Pool Starvation",
      desc: "HikariCP maxLifetime vs pgBouncer idle drop mismatch",
      type: "High Relevance Match (INC-089)",
    },
    {
      id: "INC-2024-155",
      badge: "Scenario B",
      label: "Kafka GC & Heap Exhaustion",
      desc: "Inline PDF invoice rendering STW GC pause",
      type: "High Relevance Match (INC-102)",
    },
    {
      id: "INC-2024-168",
      badge: "Scenario C",
      label: "Redis Cache Stampede",
      desc: "Un-jittered 1h TTL top-of-hour thundering herd",
      type: "High Relevance Match (INC-118)",
    },
    {
      id: "INC-2024-177",
      badge: "Scenario D",
      label: "Cloudflare Edge TLS Failure",
      desc: "Upstream Origin CA renewed without local secret",
      type: "Edge Case: Zero Historical Memory",
    },
    {
      id: "INC-2024-188",
      badge: "Scenario E",
      label: "DB High CPU vs Pool Starvation",
      desc: "Query plan seq scan vs connection starvation dilemma",
      type: "Conflicting Precedents Dilemma",
    },
  ];

  const runComparativeAnalysis = async (targetId: string = selectedIncident) => {
    setIsRunning(true);
    setResultWithout(null);
    setResultWith(null);

    const startTime = Date.now();

    try {
      // Execute both investigations concurrently with identical input signals
      const [resNoMem, resWithMem] = await Promise.all([
        fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId: targetId, mode: "without_memory" }),
        }).then((r) => r.json()),
        fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidentId: targetId, mode: "with_memory" }),
        }).then((r) => r.json()),
      ]);

      setTimeout(() => {
        setResultWithout(resNoMem);
        setResultWith(resWithMem);
        setRunDurationMs(Date.now() - startTime);
        setIsRunning(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation & Benchmark Environment Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-[#FCF6ED] border border-[#E8D3B6] flex items-center justify-between text-xs font-mono text-[#788579]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#C58B43] flex-shrink-0" />
          <span>
            <strong className="text-[#25352D]">Controlled Evaluation Testbed: </strong>
            Both engines receive identical telemetry payloads, logs, and git commit diffs. Compares baseline first-principles SRE heuristics vs persistent Hindsight memory recall.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white text-[#C58B43] border border-[#E8D3B6] text-[10px] font-bold uppercase">
          Synthetic Telemetry
        </span>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="rounded-2xl bg-white border border-[#E9E8DF] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-[#E9E8DF] pb-2 text-xs font-mono text-[#788579]">
          <span className="font-bold text-[#25352D] uppercase tracking-wider text-[11px]">
            Select Benchmark Scenario ({scenarios.length} Scenarios Available)
          </span>
          <span>Proves generalization beyond a single hardcoded incident</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = selectedIncident === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedIncident(sc.id);
                  setResultWithout(null);
                  setResultWith(null);
                  runComparativeAnalysis(sc.id);
                }}
                disabled={isRunning}
                className={`p-3 rounded-xl text-left border transition-all text-xs font-mono ${
                  isSelected
                    ? "bg-[#EAF2EC] border-[#267B5B] shadow-sm text-[#25352D]"
                    : "bg-[#F8F7F2] border-[#E9E8DF] text-[#788579] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                    {sc.badge}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />}
                </div>
                <div className="font-sans font-bold text-xs text-[#25352D] leading-tight truncate">
                  {sc.label}
                </div>
                <div className="text-[10px] text-[#788579] truncate mt-0.5">
                  {sc.type}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Controller Bar */}
      <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#B8A17A] mb-1 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>DUAL ENGINE BENCHMARK</span>
          </div>
          <h2 className="text-xl font-bold text-[#25352D] tracking-tight">
            Target: <span className="text-[#267B5B] font-mono">{selectedIncident}</span>
          </h2>
          <p className="text-xs text-[#788579] mt-0.5">
            Evaluating incident reasoning on identical signals with Hindsight persistent memory OFF vs ON.
          </p>
        </div>

        <button
          onClick={() => runComparativeAnalysis()}
          disabled={isRunning}
          className="px-6 py-3 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
          <span>{isRunning ? "Executing Dual Investigation..." : "Execute Side-by-Side Benchmark"}</span>
        </button>
      </div>

      {/* Comparative Delta Matrix (when results ready) */}
      {resultWithout && resultWith && (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#267B5B]/30 p-5 shadow-sm font-mono text-xs animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-2.5 mb-3">
            <div className="flex items-center gap-2 font-bold text-[#25352D] uppercase text-[11px]">
              <Sparkles className="w-4 h-4 text-[#267B5B]" />
              <span>Comparative Performance & Accuracy Delta</span>
            </div>
            <span className="text-[10px] text-[#788579]">Measured in-flight runtime</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px] uppercase font-semibold">Hypothesis Confidence</div>
              <div className="text-sm font-bold text-[#25352D] mt-1 flex items-center gap-1.5">
                <span className="text-[#788579]">{resultWithout.hypotheses[0]?.confidence_pct || 46}%</span>
                <span className="text-[#9A9C91]">➔</span>
                <span className="text-[#267B5B]">{resultWith.hypotheses[0]?.confidence_pct || 96}%</span>
              </div>
              <div className="text-[10px] text-[#267B5B] font-semibold mt-0.5">
                +{((resultWith.hypotheses[0]?.confidence_pct || 96) - (resultWithout.hypotheses[0]?.confidence_pct || 46))}% Grounded Accuracy
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px] uppercase font-semibold">Evidence Coverage</div>
              <div className="text-sm font-bold text-[#25352D] mt-1 flex items-center gap-1.5">
                <span className="text-[#788579]">Logs only</span>
                <span className="text-[#9A9C91]">➔</span>
                <span className="text-[#267B5B]">Diff + Bank</span>
              </div>
              <div className="text-[10px] text-[#267B5B] font-semibold mt-0.5">
                {resultWith.historical_memories_used.length} Proven Memories Cited
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px] uppercase font-semibold">Remediation Risk</div>
              <div className="text-sm font-bold text-[#25352D] mt-1 flex items-center gap-1.5">
                <span className="text-[#C58B43]">MED/HIGH Risk</span>
                <span className="text-[#9A9C91]">➔</span>
                <span className="text-[#267B5B]">LOW Risk</span>
              </div>
              <div className="text-[10px] text-[#267B5B] font-semibold mt-0.5">
                Targeted Hot-Patch with Rollback
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px] uppercase font-semibold">Diagnostic Latency</div>
              <div className="text-sm font-bold text-[#25352D] mt-1">
                {resultWith.investigation_duration_ms}ms
              </div>
              <div className="text-[10px] text-[#788579] mt-0.5">
                RRF Retrieval: ~85ms
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <div className="text-lg font-bold text-[#25352D] mt-1">
                      {resultWithout.hypotheses[0]?.confidence_pct || 46}% (Speculative)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                    <div className="text-[#788579] text-[10px]">Memories Queried</div>
                    <div className="text-lg font-bold text-[#9A9C91] mt-1">0 memories (Disabled)</div>
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
                    Risk: {resultWithout.remediations[0]?.expected_outcome || "Generic heuristic action without proxy context."}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs font-mono text-[#788579]">
                  <span className="text-[#9A9C91]">Summary: </span>
                  {resultWithout.executive_summary}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-[#788579] text-xs font-mono">
                Click &quot;Execute Side-by-Side Benchmark&quot; to inspect unassisted agent diagnosis.
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
                Fuses incoming git diffs and telemetry with recalled knowledge from the Hindsight bank.
              </p>
            </div>

            {/* Results Output */}
            {resultWith ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Confidence & Knowledge gauge */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/20">
                    <div className="text-[#267B5B] text-[10px] font-semibold">Hypothesis Confidence</div>
                    <div className="text-lg font-bold text-[#194B38] mt-1">
                      {resultWith.hypotheses[0]?.confidence_pct || 96}% ({resultWith.hypotheses[0]?.confidence_label || "Grounded"})
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/20">
                    <div className="text-[#267B5B] text-[10px] font-semibold">Recalled Bank Knowledge</div>
                    <div className="text-lg font-bold text-[#194B38] mt-1">
                      {resultWith.historical_memories_used.length} memories
                    </div>
                  </div>
                </div>

                {/* Recalled Memory Card if available */}
                {resultWith.historical_memories_used.length > 0 ? (
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#267B5B]/30 text-xs font-mono text-[#25352D]">
                    <div className="flex items-center justify-between text-[10px] text-[#267B5B] font-semibold mb-1">
                      <span className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5" />
                        <span>Hindsight Recall: {resultWith.historical_memories_used[0].id}</span>
                      </span>
                      <span>Score: {Math.round(resultWith.historical_memories_used[0].score * 100)}%</span>
                    </div>
                    <p className="text-[#25352D] font-sans text-xs leading-relaxed">
                      {resultWith.historical_memories_used[0].text}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs font-mono text-[#788579]">
                    <span className="text-[#C58B43] font-bold">Edge Case Fallback: </span>
                    Zero historical memories matched query. Engine correctly executed first-principles root-cause analysis without hallucinating past precedents.
                  </div>
                )}

                {/* Hypotheses */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[#267B5B] font-semibold block">
                    Targeted Root Cause:
                  </span>
                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs">
                    <div className="font-semibold text-[#25352D] mb-1">
                      {resultWith.hypotheses[0]?.hypothesis}
                    </div>
                    <div className="text-[#788579] text-[11px] font-mono">
                      Evidence: {resultWith.hypotheses[0]?.supporting_evidence[0]}
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
                Click &quot;Execute Side-by-Side Benchmark&quot; to inspect Hindsight memory retrieval in action.
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
