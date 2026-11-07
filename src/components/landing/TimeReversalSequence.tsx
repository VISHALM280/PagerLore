"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight,
  Database,
  ShieldCheck,
  CheckCircle2,
  Clock,
  GitCommit,
  Terminal,
  Activity,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "../common/TiltCard";

interface PhaseData {
  phase: number;
  timeTag: string;
  title: string;
  subtitle: string;
  statusBadge: string;
  statusColor: string;
  summary: string;
  primaryMetric: { label: string; value: string; color: string };
  codeOrDiff?: string;
  evidenceCallout: string;
}

export function TimeReversalSequence() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const sequenceRef = useRef<HTMLDivElement | null>(null);

  const phases: PhaseData[] = [
    {
      phase: 1,
      timeTag: "T-0m · PRESENT OUTAGE",
      title: "Active Outage Detected: Connection Pool Saturation",
      subtitle: "The Production Alarm Fires",
      statusBadge: "SEV-1 ACTIVE",
      statusColor: "bg-[#C94F4F]/20 text-[#C94F4F] border-[#C94F4F]/40",
      summary: "Checkout endpoint /v1/checkout/charge experiences a severe HTTP 500 spike and latency p95 > 2.8s. All 50 connections in the Hikari pool are pinned in active state.",
      primaryMetric: { label: "Pool Saturation", value: "98.6%", color: "text-[#C94F4F]" },
      codeOrDiff: `PSQLException: Connection is not available,
request timed out after 30005ms
(HikariPool-1 - total=50, active=50, idle=0, waiting=142)`,
      evidenceCallout: "Engineers page on-call. Cause is unknown; database CPU is only 38%, ruling out query lockups.",
    },
    {
      phase: 2,
      timeTag: "T-14m · TEMPORAL REVERSAL INITIATED",
      title: "Reversing Time: Inspecting Recent Ingress & Releases",
      subtitle: "The Clock Hands Spin Counter-Clockwise",
      statusBadge: "REWINDING",
      statusColor: "bg-[#B8A17A]/20 text-[#B8A17A] border-[#B8A17A]/40",
      summary: "PagerLore initiates temporal reconstruction, rewinding operational logs and correlating the failure window against cluster deployment events.",
      primaryMetric: { label: "Time Rewound", value: "-14 Minutes", color: "text-[#B8A17A]" },
      codeOrDiff: `kubectl get deployments -n prod
payments-service   3/3   v2.8.1   14m ago (commit a4f91e8)`,
      evidenceCallout: "The anomaly began precisely 45 seconds after production container rollout v2.8.1.",
    },
    {
      phase: 3,
      timeTag: "T-15m · DECONSTRUCTING COMMIT",
      title: "Isolating The Breaking Deployment Change",
      subtitle: "Config Diff Materializes",
      statusBadge: "DIFF LOCATED",
      statusColor: "bg-[#B8A17A]/20 text-[#B8A17A] border-[#B8A17A]/40",
      summary: "Deconstructed commit a4f91e8 reveals an innocent-looking configuration tweak to connection pool lifetime.",
      primaryMetric: { label: "Config Shift", value: "9m ➔ 30m", color: "text-[#C58B43]" },
      codeOrDiff: `diff --git a/application.yml b/application.yml
-  hikari.max-lifetime: 540000   # 9 minutes
+  hikari.max-lifetime: 1800000  # 30 minutes (REGRESSION)`,
      evidenceCallout: "Why did increasing max-lifetime cause connection pool starvation instead of stability?",
    },
    {
      phase: 4,
      timeTag: "T-5mo · TEMPORAL MEMORY CORRELATION",
      title: "Emerald Connection Lines Branch Across History",
      subtitle: "Linking Active Symptoms to Prior Incidents",
      statusBadge: "CORRELATING",
      statusColor: "bg-[#267B5B]/20 text-[#267B5B] border-[#267B5B]/40",
      summary: "PagerLore traces symptom vectors through the institutional graph, discovering that the organization already solved this exact dilemma 5 months ago.",
      primaryMetric: { label: "Precedent Linked", value: "INC-2024-089", color: "text-[#267B5B]" },
      codeOrDiff: `Querying Hindsight Memory Bank:
"payments-service connection pool saturation HikariCP pgBouncer timeout max-lifetime"`,
      evidenceCallout: "Connecting INC-2024-142 with resolved post-mortem INC-2024-089 via multi-strategy search.",
    },
    {
      phase: 5,
      timeTag: "T-5mo · HINDSIGHT RECALL",
      title: "Hindsight Retrieves The Ground-Truth Post-Mortem",
      subtitle: "96% Confidence Grounding",
      statusBadge: "RECALLED · 96% MATCH",
      statusColor: "bg-[#267B5B]/20 text-[#267B5B] border-[#267B5B]/40",
      summary: "Hindsight memory mem-hindsight-8901 recalls the exact root cause: pgBouncer transaction pooler has a server_idle_timeout of 600s (10m). When client maxLifetime was 30m, pgBouncer dropped TCP sockets while HikariCP kept sending queries over dead wires.",
      primaryMetric: { label: "Recall Confidence", value: "0.96 / 1.00", color: "text-[#267B5B]" },
      codeOrDiff: `recalledMemory: {
  id: "mem-hindsight-8901-hikari",
  root_cause: "HikariCP maxLifetime (30m) > pgBouncer server_idle_timeout (10m)",
  proven_fix: "Set maxLifetime = 540000ms (9m) strictly < proxy timeout"
}`,
      evidenceCallout: "Zero hallucination. The verified lesson from 5 months ago provides the missing piece.",
    },
    {
      phase: 6,
      timeTag: "THE REWIND STOPS · GROUNDED LESSON",
      title: "The Clock Halts: Verified Rule Isolated",
      subtitle: "Architectural Guardrail Established",
      statusBadge: "RULE IDENTIFIED",
      statusColor: "bg-[#267B5B]/20 text-[#267B5B] border-[#267B5B]/40",
      summary: "The time machine halts the clock. The system formulates the verified hypothesis: revert maxLifetime to 540000ms (9m) to ensure client connections discard before pgBouncer idle drops.",
      primaryMetric: { label: "Hypothesis Rating", value: "Verified SRE Fix", color: "text-[#267B5B]" },
      codeOrDiff: `PROPOSED REMEDIATION:
kubectl set env deployment/payments-service \\
  HIKARI_MAX_LIFETIME=540000 \\
  HIKARI_CONN_TIMEOUT=5000 && \\
kubectl rollout restart deployment/payments-service`,
      evidenceCallout: "Lead SRE Marcus Vance inspects historical citation and explicitly authorizes hot-patch.",
    },
    {
      phase: 7,
      timeTag: "T+45s · FORWARD RESOLUTION",
      title: "Emerald Signal Moves Forward: System Corrected",
      subtitle: "SLO Restored in 4 Minutes",
      statusBadge: "MITIGATED & LEARNED",
      statusColor: "bg-[#267B5B]/20 text-[#267B5B] border-[#267B5B]/40",
      summary: "The hot-patch deploys across payment pods. Connections refresh beneath the proxy timeout. Pool saturation drops from 98.6% to 18.4%. Resolution is retained permanently into Hindsight.",
      primaryMetric: { label: "Pool Saturation", value: "18.4% (Normal)", color: "text-[#267B5B]" },
      codeOrDiff: `STATUS: RESOLVED in 4 minutes (vs 48m baseline)
RETAINED: Incident learnings committed to memory bank.
SLO: 99.98% availability restored. Abandoned carts: 0.`,
      evidenceCallout: "The next incident won't start from zero because PagerLore remembers.",
    },
  ];

  // Auto-play scrubber sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActivePhase((prev) => (prev >= 7 ? 1 : prev + 1));
      }, 3400);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = phases[activePhase - 1];

  return (
    <section id="time-reversal" className="relative py-28 bg-[#0C1513] text-[#F8F7F2] border-t border-[#ffffff10] overflow-hidden">
      {/* Background Lighting & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-[#267B5B]/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[300px] bg-[#B8A17A]/10 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13231E] border border-[#267B5B]/40 text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>The Incident Time Machine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F7F2] leading-tight font-sans">
            Look backward. <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#267B5B] via-[#48A580] to-[#B8A17A]">
              Move forward.
            </span>
          </h2>

          <p className="mt-4 text-base text-[#A3B2A8] font-sans leading-relaxed">
            Witness how PagerLore reverses operational time: unwinding from an active production failure back to the exact historical lesson that solves it.
          </p>
        </div>

        {/* 7-Phase Interactive Temporal Stepper */}
        <div className="mb-8 p-2 rounded-2xl bg-[#111C19] border border-[#ffffff10] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 mb-2 border-b border-[#ffffff10] text-xs font-mono text-[#788579]">
            <div className="flex items-center gap-2">
              <span className="text-[#267B5B] font-bold">TEMPORAL SCRUBBER:</span>
              <span>Phase 0{current.phase} of 07</span>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 rounded-lg bg-[#182924] hover:bg-[#203630] text-[#267B5B] border border-[#267B5B]/30 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? "Pause Sequence" : "Auto-Play Timeline"}</span>
            </button>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
            {phases.map((p) => {
              const isSelected = activePhase === p.phase;
              return (
                <button
                  key={p.phase}
                  onClick={() => {
                    setIsPlaying(false);
                    setActivePhase(p.phase);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all text-xs font-mono ${
                    isSelected
                      ? "bg-[#182924] border-[#267B5B] text-white shadow-lg shadow-[#267B5B]/20"
                      : "bg-[#131F1C] border-[#ffffff0a] text-[#788579] hover:text-[#F8F7F2] hover:bg-[#152320]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                      0{p.phase}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B] animate-pulse" />}
                  </div>
                  <div className="font-sans font-semibold text-xs leading-tight truncate">
                    {p.title.split(":")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Phase Cinema Stage */}
        <TiltCard maxTilt={3} glare={false} className="rounded-2xl bg-[#111C19] border border-[#ffffff15] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ffffff10] pb-5 mb-8">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${current.statusColor}`}>
                {current.statusBadge}
              </span>
              <span className="text-xs font-mono text-[#788579]">
                {current.timeTag}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[#788579]">{current.primaryMetric.label}:</span>
              <span className={`text-lg font-bold ${current.primaryMetric.color}`}>
                {current.primaryMetric.value}
              </span>
            </div>
          </div>

          {/* Main Phase Stage Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Narrative & Investigation Rationale */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-mono text-[#267B5B] uppercase tracking-wider font-semibold">
                {current.subtitle}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#F8F7F2] font-sans leading-snug">
                {current.title}
              </h3>

              <p className="text-sm text-[#A3B2A8] font-sans leading-relaxed">
                {current.summary}
              </p>

              {/* Empirical Evidence Callout */}
              <div className="p-4 rounded-xl bg-[#0C1513] border border-[#ffffff10] text-xs font-mono text-[#B8A17A] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#B8A17A]" />
                <div>
                  <strong className="text-white">Empirical Observation: </strong>
                  <span className="text-[#A3B2A8] font-sans">{current.evidenceCallout}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code Snippet / Terminal / Git Diff */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#090F0E] border border-[#ffffff15] p-4 font-mono text-xs shadow-inner space-y-2">
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2 text-[10px] text-[#788579] uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c94f4f]" />
                    <span className="w-2 h-2 rounded-full bg-[#b8a17a]" />
                    <span className="w-2 h-2 rounded-full bg-[#267b5b]" />
                    <span className="ml-2 font-semibold text-[#A3B2A8]">system-telemetry.log</span>
                  </div>
                  <span>LIVE REPLAY</span>
                </div>

                <pre className="text-[#267B5B] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed pt-2">
                  {current.codeOrDiff}
                </pre>
              </div>
            </div>
          </div>

          {/* Stepper Navigation Footer */}
          <div className="pt-8 border-t border-[#ffffff10] mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#788579]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#267B5B]" />
              <span>Time Reversed: From Outage Symptom to Institutional Memory</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePhase((p) => Math.max(1, p - 1))}
                disabled={activePhase === 1}
                className="px-3 py-1.5 rounded-lg bg-[#182924] hover:bg-[#203630] text-[#F8F7F2] border border-[#ffffff10] disabled:opacity-30 transition-all"
              >
                ← Previous Phase
              </button>
              <button
                onClick={() => setActivePhase((p) => Math.min(7, p + 1))}
                disabled={activePhase === 7}
                className="px-3 py-1.5 rounded-lg bg-[#267B5B] hover:bg-[#1E664A] text-white disabled:opacity-30 transition-all font-semibold"
              >
                Next Phase →
              </button>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

