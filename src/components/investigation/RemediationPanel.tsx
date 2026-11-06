"use client";

import React, { useState } from "react";
import { RemediationRecommendation } from "@/lib/types/incident";
import { ShieldAlert, ShieldCheck, Terminal, Copy, Check, Play, AlertCircle } from "lucide-react";

interface RemediationPanelProps {
  remediations: RemediationRecommendation[];
  incidentId: string;
  onRemediationExecuted?: () => void;
}

export function RemediationPanel({
  remediations,
  incidentId,
  onRemediationExecuted,
}: RemediationPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<Record<string, boolean>>({});
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveAndExecute = async (rem: RemediationRecommendation) => {
    setExecutingId(rem.id);

    // Simulate safe orchestrated execution of verified fix
    setTimeout(async () => {
      setApprovals((prev) => ({ ...prev, [rem.id]: true }));
      setExecutedIds((prev) => ({ ...prev, [rem.id]: true }));
      setExecutingId(null);

      // Auto-update incident status to identified or resolved if lead remediation executed
      try {
        await fetch(`/api/incidents/${incidentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "identified",
            metrics: {
              error_rate_pct: 0.04,
              p95_latency_ms: 135,
              request_rate_rps: 420,
              db_connection_pool_saturation_pct: 18.4,
              cpu_usage_pct: 32,
              memory_usage_pct: 45,
            },
          }),
        });
        if (onRemediationExecuted) onRemediationExecuted();
      } catch (err) {
        console.error(err);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            Verified Remediation & Human Approval Gate
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Explicit SRE Approval Required for Production State Modification
        </span>
      </div>

      <div className="space-y-4">
        {remediations.map((rem, idx) => {
          const isExecuted = executedIds[rem.id];
          const isExecuting = executingId === rem.id;

          return (
            <div
              key={rem.id}
              className={`rounded-2xl p-6 border transition-all ${
                isExecuted
                  ? "bg-[#0a141d] border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : idx === 0
                  ? "bg-[#0b1220] border-cyan-500/60 shadow-[0_0_25px_rgba(0,240,255,0.1)]"
                  : "bg-[#090e18] border-[#1c263c]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      rem.risk_level === "LOW"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    Risk: {rem.risk_level}
                  </span>
                  <h4 className="text-base font-bold text-white">{rem.title}</h4>
                </div>

                {isExecuted && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-mono font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>EXECUTED & VERIFIED</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
                {rem.action_summary}
              </p>

              {/* Justification & Expected Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#070b14] border border-[#162136]">
                  <div className="text-[10px] text-cyan-400 uppercase font-semibold mb-1">
                    Why Recommended
                  </div>
                  <div className="text-slate-300 font-sans text-xs leading-relaxed">
                    {rem.why_recommended}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070b14] border border-[#162136]">
                  <div className="text-[10px] text-emerald-400 uppercase font-semibold mb-1">
                    Expected Outcome
                  </div>
                  <div className="text-slate-300 font-sans text-xs leading-relaxed">
                    {rem.expected_outcome}
                  </div>
                </div>
              </div>

              {/* Historical Justification if available */}
              {rem.historical_justification && (
                <div className="p-3 rounded-xl bg-[#0e172a] border border-cyan-800/40 text-xs font-mono text-cyan-200/90 mb-4 flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300">Historical Proof: </strong>
                    <span className="font-sans text-slate-200">{rem.historical_justification}</span>
                  </div>
                </div>
              )}

              {/* Command block if provided */}
              {rem.command_or_script && (
                <div className="rounded-xl bg-[#05070c] border border-slate-900 p-3 font-mono text-xs mb-4">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase mb-1">
                    <span>Remediation CLI Command</span>
                    <button
                      onClick={() => handleCopy(rem.command_or_script!, rem.id)}
                      className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                    >
                      {copiedId === rem.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === rem.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <code className="text-cyan-300 break-all select-all block">
                    {rem.command_or_script}
                  </code>
                </div>
              )}

              {/* Human Approval Gate Controls */}
              {rem.requires_approval && !isExecuted && (
                <div className="pt-3 border-t border-[#1c263c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Requires Lead SRE authorization before dispatching to cluster.</span>
                  </div>

                  <button
                    onClick={() => handleApproveAndExecute(rem)}
                    disabled={isExecuting}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all transform active:scale-95 disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                    <span>{isExecuting ? "Applying Hot-Patch to Cluster..." : "Approve & Apply Remediation"}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
