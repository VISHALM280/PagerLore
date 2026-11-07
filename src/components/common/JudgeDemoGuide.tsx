"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Tv,
  FileText,
  Layers,
  Activity,
  Terminal,
} from "lucide-react";

interface JudgeDemoGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeDemoGuide({ isOpen, onClose }: JudgeDemoGuideProps) {
  const [activeAct, setActiveAct] = useState<number>(1);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const acts = [
    {
      act: 1,
      title: "Act 1 — The Production Outage",
      subtitle: "Unfamiliar SEV-1 Outage on payments-service",
      description: "Checkout endpoint /v1/checkout/charge experiencing HTTP 500 error spikes and database pool saturation alarms immediately following deployment v2.8.1.",
      signals: ["Error Rate: 28.4%", "Pool Saturation: 98.6%", "Commit a4f91e8 deployed 14m ago"],
      route: "/incidents/INC-2024-142",
      actionText: "Open Incident Response Room",
    },
    {
      act: 2,
      title: "Act 2 — Baseline: Memory OFF",
      subtitle: "Evaluating logs without historical memory",
      description: "The baseline agent evaluates current logs in isolation. Formulates speculative 46% confidence hypotheses and recommends risky horizontal pod scaling that would worsen database proxy exhaustion.",
      signals: ["Confidence: 46% (Speculative)", "0 Memories Queried", "Risky Action: kubectl scale replicas=6"],
      route: "/theatre",
      actionText: "Open Benchmark Comparison",
    },
    {
      act: 3,
      title: "Act 3 — Grounded Recall: Memory ON",
      subtitle: "Hindsight multi-strategy retrieval in action",
      description: "PagerLore formulates a targeted symptom query to the Hindsight memory bank, matching resolved incident INC-2024-089 with 96% relevance. Pinpoints the exact git diff in commit a4f91e8 that bumped max-lifetime to 1800s, exceeding pgBouncer's 600s idle timeout.",
      signals: ["Relevance Match: 96%", "Correlated Diff: Commit a4f91e8", "Root Cause: Timeout Asymmetry"],
      route: "/investigate?incident=INC-2024-142",
      actionText: "Launch Autonomous Investigation",
    },
    {
      act: 4,
      title: "Act 4 — Human Authorization & Remediation",
      subtitle: "Evidence-backed hot-patch execution",
      description: "The on-call SRE reviews the empirical evidence and authorizes the proven hot-patch (HIKARI_MAX_LIFETIME=540000). Connection pool saturation normalizes from 98.6% to 18.4% within 45 seconds.",
      signals: ["Risk: LOW", "Expected Pool Saturation: 18.4%", "Verified by Lead SRE"],
      route: "/incidents/INC-2024-142",
      actionText: "Review & Apply Hot-Patch",
    },
    {
      act: 5,
      title: "Act 5 — The Learning Loop: RETAIN",
      subtitle: "Structured post-mortem knowledge extraction",
      description: "Upon incident resolution, a structured post-mortem extracts verified root causes, configuration constraints, and preventive rules into the permanent Hindsight memory bank via retain().",
      signals: ["Status: RETAINED to Bank", "Extraction: Root cause + rules", "Memory ID generated"],
      route: "/postmortems?incident=INC-2024-142",
      actionText: "Inspect Post-Mortem & Retain",
    },
    {
      act: 6,
      title: "Act 6 — Prove Persistence Across Resets!",
      subtitle: "Validating that institutional memory persists",
      description: "Reset active incident states while PRESERVING newly retained Hindsight memories. Launch a new investigation to prove that PagerLore immediately recalls the newly learned experience rather than replaying static slides.",
      signals: ["DataStore: Persistent on disk", "Retained memories survive reset", "True AI Agent Learning"],
      route: "/vault",
      actionText: "Inspect Knowledge Vault",
    },
  ];

  const currentActData = acts[activeAct - 1];

  const handleResetDemoState = async (preserveRetained: boolean) => {
    setIsResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch("/api/demo/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preserveRetainedMemories: preserveRetained }),
      });
      const data = await res.json();
      setResetMessage(
        preserveRetained
          ? `Reset completed: Preserved ${data.retainedPreservedCount || 0} newly retained memories in bank!`
          : "Hard factory reset completed."
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setResetMessage(`Reset failed: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E9E8DF] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F8F7F2] transition-colors absolute top-5 right-5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Hackathon Judge Tour (3–5 Min Flow)</span>
          </div>
          <h2 className="text-2xl font-bold text-[#25352D] tracking-tight">
            How PagerLore Proves Persistent SRE Learning
          </h2>
          <p className="text-xs text-[#788579] mt-1 font-sans">
            Follow this 6-act guided sequence to evaluate the core proposition: <span className="text-[#267B5B] font-semibold">&quot;The next incident shouldn&apos;t start from zero.&quot;</span>
          </p>
        </div>

        {/* Act Progress Stepper */}
        <div className="grid grid-cols-6 gap-1.5 p-1 bg-[#F1F0E9] rounded-xl border border-[#E9E8DF] text-[11px] font-mono text-center">
          {acts.map((a) => {
            const isCurrent = activeAct === a.act;
            return (
              <button
                key={a.act}
                onClick={() => setActiveAct(a.act)}
                className={`py-2 px-1 rounded-lg transition-all font-semibold ${
                  isCurrent
                    ? "bg-[#267B5B] text-white shadow-sm"
                    : "text-[#788579] hover:text-[#25352D] hover:bg-white"
                }`}
              >
                Act {a.act}
              </button>
            );
          })}
        </div>

        {/* Selected Act Card */}
        <div className="p-6 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E9E8DF] pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#267B5B]">
                Act {currentActData.act} of 6
              </span>
              <h3 className="text-lg font-bold text-[#25352D]">{currentActData.title}</h3>
              <p className="text-xs text-[#788579] mt-0.5">{currentActData.subtitle}</p>
            </div>
            <Link
              href={currentActData.route}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
            >
              <span>{currentActData.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-[#25352D] leading-relaxed font-sans">
            {currentActData.description}
          </p>

          {/* Observable Evidence Signals */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {currentActData.signals.map((sig, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-white border border-[#E9E8DF] text-[11px] font-mono text-[#25352D]"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>

        {/* Demo Persistence Validation Controls (Crucial for Act 6) */}
        <div className="pt-4 border-t border-[#E9E8DF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#788579] font-mono">
            <div><strong>Persistence Proof Controller:</strong></div>
            <div className="text-[11px] text-[#9A9C91]">Reset state on disk while preserving newly learned memories.</div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleResetDemoState(true)}
              disabled={isResetting}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8F7F2] border border-[#267B5B] text-[#267B5B] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>Reset State (Keep Memories)</span>
            </button>

            <button
              onClick={() => {
                if (confirm("Hard factory reset: clear all incidents and memories back to initial seed?")) {
                  handleResetDemoState(false);
                }
              }}
              disabled={isResetting}
              className="px-2.5 py-2 rounded-xl bg-white hover:bg-[#F8F7F2] border border-[#E9E8DF] text-[#788579] hover:text-[#C94F4F] text-[11px] font-mono transition-colors disabled:opacity-50"
              title="Factory hard reset"
            >
              Factory Reset
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="p-3 rounded-lg bg-[#EAF2EC] border border-[#BFD8C6] text-xs font-mono text-[#267B5B] font-semibold text-center">
            ✓ {resetMessage}
          </div>
        )}
      </div>
    </div>
  );
}

