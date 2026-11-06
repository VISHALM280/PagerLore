"use client";

import React from "react";
import { CheckCircle2, CircleDashed, Database, Terminal, Cpu, Sparkles } from "lucide-react";

interface InvestigationProgressProps {
  currentStep: number; // 1 to 7
  isComplete: boolean;
  mode?: "with_memory" | "without_memory";
}

export function InvestigationProgress({ currentStep, isComplete, mode = "with_memory" }: InvestigationProgressProps) {
  const steps = [
    { num: 1, label: "01 — Receiving signals", sub: "Ingesting telemetry stream & traces" },
    { num: 2, label: "02 — Parsing incident data", sub: "Extracting error signatures & metrics" },
    { num: 3, label: "03 — Investigating symptoms", sub: "Correlating latency spikes with git diffs" },
    {
      num: 4,
      label: mode === "with_memory" ? "04 — Recalling historical experience" : "04 — Historical recall disabled",
      sub: mode === "with_memory" ? "Querying Hindsight memory bank via RRF" : "Operating without memory context",
      isHindsight: true,
    },
    { num: 5, label: "05 — Comparing related incidents", sub: "Ranking similarity against prior post-mortems" },
    { num: 6, label: "06 — Generating recommendations", sub: "Formulating evidence-backed remediation" },
    { num: 7, label: "07 — Presenting investigation results", sub: "Awaiting engineer verification & approval" },
  ];

  return (
    <div className="rounded-xl bg-[#080d17] border border-[#1c263c] p-4 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1c263c] pb-2.5 mb-3">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Investigation Progress Pipeline</span>
        </span>
        <span className="text-[10px] text-cyan-400">
          {isComplete ? "COMPLETED" : `STEP ${Math.min(currentStep, 7)} OF 7`}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((st) => {
          const isDone = isComplete || currentStep > st.num;
          const isCurrent = !isComplete && currentStep === st.num;

          return (
            <div
              key={st.num}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                isCurrent
                  ? "bg-[#111a2e] border border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                  : isDone
                  ? "bg-[#0b0f1a]/80 border border-emerald-950/40 text-slate-300"
                  : "bg-transparent text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <CircleDashed className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 inline-block flex-shrink-0" />
                )}
                <div>
                  <div
                    className={`font-semibold ${
                      isCurrent
                        ? "text-cyan-300"
                        : isDone
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {st.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">{st.sub}</div>
                </div>
              </div>

              {st.isHindsight && mode === "with_memory" && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Hindsight
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
