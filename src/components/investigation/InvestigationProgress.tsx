"use client";

import React from "react";
import { CheckCircle2, CircleDashed, Terminal } from "lucide-react";

interface InvestigationProgressProps {
  currentStep: number;
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
    <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-5 font-mono text-xs shadow-subtle">
      <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3 mb-3">
        <span className="text-[10px] text-[#788579] uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#267B5B]" />
          <span>Investigation Pipeline</span>
        </span>
        <span className="text-[10px] text-[#267B5B] font-bold">
          {isComplete ? "COMPLETED" : `STEP ${Math.min(currentStep, 7)} OF 7`}
        </span>
      </div>

      <div className="space-y-1.5">
        {steps.map((st) => {
          const isDone = isComplete || currentStep > st.num;
          const isCurrent = !isComplete && currentStep === st.num;

          return (
            <div
              key={st.num}
              className={`flex items-center justify-between p-2 rounded transition-colors ${
                isCurrent
                  ? "bg-[#EAF2EC] border border-[#BFD8C6]"
                  : isDone
                  ? "bg-[#F8F7F2] text-[#25352D]"
                  : "text-[#9A9C91]"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#267B5B] flex-shrink-0" />
                ) : isCurrent ? (
                  <CircleDashed className="w-3.5 h-3.5 text-[#267B5B] animate-spin flex-shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-[#D9D7CB] inline-block flex-shrink-0" />
                )}
                <div>
                  <div className={`font-semibold ${isCurrent ? "text-[#194B38]" : isDone ? "text-[#25352D]" : "text-[#9A9C91]"}`}>
                    {st.label}
                  </div>
                  <div className="text-[10px] text-[#788579] font-sans">{st.sub}</div>
                </div>
              </div>

              {st.isHindsight && mode === "with_memory" && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6] font-semibold">
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
