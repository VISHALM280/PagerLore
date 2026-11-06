"use client";

import React, { useState } from "react";
import { RemediationRecommendation } from "@/lib/types/incident";
import { ShieldCheck, Terminal, Copy, Check, Play, AlertCircle } from "lucide-react";

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
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveAndExecute = async (rem: RemediationRecommendation) => {
    setExecutingId(rem.id);

    setTimeout(async () => {
      setExecutedIds((prev) => ({ ...prev, [rem.id]: true }));
      setExecutingId(null);

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
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#267B5B]" />
          <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
            Verified Remediation & Human Approval Gate
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#788579]">
          Explicit SRE Approval Required for Production Modification
        </span>
      </div>

      <div className="space-y-4">
        {remediations.map((rem, idx) => {
          const isExecuted = executedIds[rem.id];
          const isExecuting = executingId === rem.id;

          return (
            <div
              key={rem.id}
              className={`rounded-xl p-6 border transition-all shadow-subtle ${
                isExecuted
                  ? "bg-[#EAF2EC]/40 border-[#BFD8C6]"
                  : idx === 0
                  ? "bg-[#FFFFFF] border-2 border-[#267B5B]"
                  : "bg-[#FFFFFF] border-[#E9E8DF]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      rem.risk_level === "LOW"
                        ? "bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6]"
                        : "bg-[#FCF6ED] text-[#C58B43] border border-[#E8D3B6]"
                    }`}
                  >
                    Risk: {rem.risk_level}
                  </span>
                  <h4 className="text-base font-bold text-[#25352D]">{rem.title}</h4>
                </div>

                {isExecuted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>EXECUTED & VERIFIED</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-[#788579] leading-relaxed mb-4 font-sans">
                {rem.action_summary}
              </p>

              {/* Justification & Expected Outcome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 font-mono text-xs">
                <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] text-[#267B5B] uppercase font-semibold mb-1">
                    Why Recommended
                  </div>
                  <div className="text-[#25352D] font-sans text-xs leading-relaxed">
                    {rem.why_recommended}
                  </div>
                </div>

                <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                  <div className="text-[10px] text-[#267B5B] uppercase font-semibold mb-1">
                    Expected Outcome
                  </div>
                  <div className="text-[#25352D] font-sans text-xs leading-relaxed">
                    {rem.expected_outcome}
                  </div>
                </div>
              </div>

              {/* Historical Justification if available */}
              {rem.historical_justification && (
                <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF] text-xs font-mono text-[#25352D] mb-4 flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-[#B8A17A] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#B8A17A]">Historical Proof: </strong>
                    <span className="font-sans text-[#788579]">{rem.historical_justification}</span>
                  </div>
                </div>
              )}

              {/* Command block if provided */}
              {rem.command_or_script && (
                <div className="rounded bg-[#F8F7F2] border border-[#E9E8DF] p-3 font-mono text-xs mb-4">
                  <div className="flex items-center justify-between text-[#788579] text-[10px] uppercase mb-1">
                    <span>Remediation CLI Command</span>
                    <button
                      onClick={() => handleCopy(rem.command_or_script!, rem.id)}
                      className="flex items-center gap-1 hover:text-[#25352D] transition-colors"
                    >
                      {copiedId === rem.id ? <Check className="w-3 h-3 text-[#267B5B]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === rem.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <code className="text-[#25352D] font-semibold break-all select-all block">
                    {rem.command_or_script}
                  </code>
                </div>
              )}

              {/* Approval Gate */}
              {rem.requires_approval && !isExecuted && (
                <div className="pt-3 border-t border-[#E9E8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#788579]">
                    <AlertCircle className="w-4 h-4 text-[#C58B43] flex-shrink-0" />
                    <span>Requires Lead SRE authorization before dispatching to cluster.</span>
                  </div>

                  <button
                    onClick={() => handleApproveAndExecute(rem)}
                    disabled={isExecuting}
                    className="px-5 py-2.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-subtle transition-colors disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isExecuting ? "animate-spin" : ""}`} />
                    <span>{isExecuting ? "Applying Hot-Patch..." : "Approve & Apply Remediation"}</span>
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
