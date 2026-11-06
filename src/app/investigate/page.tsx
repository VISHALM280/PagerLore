"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { InvestigationProgress } from "@/components/investigation/InvestigationProgress";
import { HypothesisCard } from "@/components/investigation/HypothesisCard";
import { RemediationPanel } from "@/components/investigation/RemediationPanel";
import { MemoryCitationViewer } from "@/components/investigation/MemoryCitationViewer";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { Incident, InvestigationResult } from "@/lib/types/incident";
import {
  BrainCircuit,
  Database,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowRight,
  Tv,
} from "lucide-react";

function InvestigationContent() {
  const searchParams = useSearchParams();
  const requestedIncidentId = searchParams.get("incident") || "INC-2024-142";

  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(requestedIncidentId);
  const [mode, setMode] = useState<"with_memory" | "without_memory">("with_memory");

  const [isInvestigating, setIsInvestigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data.incidents || []);
        if (data.incidents?.length > 0 && !selectedIncidentId) {
          setSelectedIncidentId(data.incidents[0].id);
        }
      });
  }, [selectedIncidentId]);

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const handleStartInvestigation = async () => {
    if (!activeIncident) return;
    setIsInvestigating(true);
    setInvestigationResult(null);
    setCurrentStep(1);

    // Step sequence with realistic operational progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 6) {
          clearInterval(stepInterval);
          return 7;
        }
        return prev + 1;
      });
    }, 450);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          mode,
        }),
      });
      const data = await res.json();
      setTimeout(() => {
        clearInterval(stepInterval);
        setCurrentStep(7);
        setIsInvestigating(false);
        setInvestigationResult(data);
      }, 3200);
    } catch (err) {
      console.error(err);
      setIsInvestigating(false);
      clearInterval(stepInterval);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1 font-semibold">
                <BrainCircuit className="w-4 h-4" />
                <span>ROOT-CAUSE REASONING ENGINE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Contextual Root-Cause Analysis
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
                Synthesize live telemetry, git commit diffs, and persistent Hindsight memory to isolate root causes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/theatre"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#25352D] text-xs font-mono flex items-center gap-2 shadow-sm transition-colors"
              >
                <Tv className="w-3.5 h-3.5 text-[#267B5B]" />
                <span>Compare With vs Without Memory</span>
              </Link>
            </div>
          </div>

          {/* Configuration & Incident Target Selector */}
          <div className="rounded-2xl bg-white border border-[#E9E8DF] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Target Incident */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-mono text-[#788579]">Target Incident:</span>
              <select
                value={selectedIncidentId}
                onChange={(e) => {
                  setSelectedIncidentId(e.target.value);
                  setInvestigationResult(null);
                  setCurrentStep(0);
                }}
                className="bg-[#F8F7F2] text-xs font-mono text-[#25352D] border border-[#E9E8DF] rounded-xl px-3 py-2 focus:outline-none focus:border-[#267B5B] cursor-pointer"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} — {inc.title.substring(0, 48)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Memory Mode Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-mono text-[#788579]">Memory Mode:</span>
              <div className="inline-flex rounded-xl bg-[#F1F0E9] p-1 border border-[#E9E8DF]">
                <button
                  onClick={() => setMode("with_memory")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    mode === "with_memory"
                      ? "bg-[#267B5B] text-white shadow-sm font-semibold"
                      : "text-[#788579] hover:text-[#25352D]"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>WITH HINDSIGHT</span>
                </button>
                <button
                  onClick={() => setMode("without_memory")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    mode === "without_memory"
                      ? "bg-white text-[#25352D] border border-[#E9E8DF] font-semibold shadow-sm"
                      : "text-[#788579] hover:text-[#25352D]"
                  }`}
                >
                  <span>WITHOUT MEMORY</span>
                </button>
              </div>
            </div>

            {/* Launch Investigation Button */}
            <button
              onClick={handleStartInvestigation}
              disabled={isInvestigating}
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isInvestigating ? "animate-spin" : ""}`} />
              <span>{isInvestigating ? "Executing Investigation..." : "Investigate with PagerLore"}</span>
            </button>
          </div>

          {/* Current Target Overview */}
          {activeIncident && (
            <div className="p-4 rounded-xl bg-white border border-[#E9E8DF] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={activeIncident.severity} size="sm" />
                <span className="font-bold text-[#25352D]">{activeIncident.id}</span>
                <span className="text-[#9A9C91]">·</span>
                <span className="text-[#267B5B] font-semibold">{activeIncident.affected_service}</span>
                <span className="text-[#9A9C91]">·</span>
                <span className="text-[#788579]">{activeIncident.title}</span>
              </div>
              <div className="flex items-center gap-4 text-[#788579]">
                <span>Err Rate: <strong className="text-[#C94F4F]">{activeIncident.metrics.error_rate_pct}%</strong></span>
                <span>p95: <strong className="text-[#C94F4F]">{activeIncident.metrics.p95_latency_ms}ms</strong></span>
                <span>Pool Saturation: <strong className="text-[#C58B43]">{activeIncident.metrics.db_connection_pool_saturation_pct || 22}%</strong></span>
              </div>
            </div>
          )}

          {/* Investigation Progress Visualization (shown during or after run) */}
          {(isInvestigating || investigationResult) && (
            <InvestigationProgress
              currentStep={currentStep}
              isComplete={!isInvestigating && Boolean(investigationResult)}
              mode={mode}
            />
          )}

          {/* Investigation Results Presentation */}
          {investigationResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Summary Card */}
              <div className="rounded-2xl bg-white border border-[#267B5B]/30 border-l-4 border-l-[#267B5B] p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] uppercase tracking-wider mb-2 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive Findings & Historical Attribution</span>
                </div>
                <p className="text-sm text-[#25352D] font-sans leading-relaxed">
                  {investigationResult.executive_summary}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-[#788579] pt-3 border-t border-[#E9E8DF]">
                  <span>Signals Analyzed: {investigationResult.signals_analyzed_count}</span>
                  <span>·</span>
                  <span>Duration: {investigationResult.investigation_duration_ms}ms</span>
                  <span>·</span>
                  <span className="text-[#267B5B] font-semibold">
                    Memories Recalled: {investigationResult.historical_memories_used.length}
                  </span>
                </div>
              </div>

              {/* Hypotheses Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-2">
                  <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
                    Root-Cause Hypotheses & Diagnostic Evidence
                  </h3>
                  <span className="text-[10px] font-mono text-[#788579]">
                    Ranked by empirical evidence & historical pattern match
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {investigationResult.hypotheses.map((hyp, idx) => (
                    <HypothesisCard key={hyp.id} hypothesis={hyp} rank={idx + 1} />
                  ))}
                </div>
              </div>

              {/* Verified Remediation Panel */}
              <RemediationPanel
                remediations={investigationResult.remediations}
                incidentId={selectedIncidentId}
                onRemediationExecuted={() => {
                  fetch(`/api/incidents/${selectedIncidentId}`)
                    .then((r) => r.json())
                    .then((updated) => {
                      setIncidents((prev) =>
                        prev.map((i) => (i.id === updated.id ? updated : i))
                      );
                    });
                }}
              />

              {/* Recalled Memory Citations */}
              {investigationResult.mode === "with_memory" && (
                <MemoryCitationViewer memories={investigationResult.historical_memories_used} />
              )}
            </div>
          )}

          {/* Idle state helper callout */}
          {!isInvestigating && !investigationResult && (
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="p-3.5 rounded-full bg-[#EAF2EC] border border-[#267B5B]/20 w-fit mx-auto text-[#267B5B]">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#25352D]">Ready to Investigate</h3>
              <p className="text-xs text-[#788579] leading-relaxed">
                Click &quot;Investigate with PagerLore&quot; above to trigger live diagnostic analysis,
                query the Hindsight memory bank, and generate evidence-backed hypotheses for{" "}
                <span className="text-[#267B5B] font-mono font-semibold">{selectedIncidentId}</span>.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function InvestigationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F7F2] text-[#788579] flex items-center justify-center font-mono text-xs">Loading Investigation Workspace...</div>}>
      <InvestigationContent />
    </Suspense>
  );
}
