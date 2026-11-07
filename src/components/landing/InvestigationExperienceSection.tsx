"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Search,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitCommit,
  Terminal,
  Activity,
  UserCheck,
  Play,
  RotateCcw,
} from "lucide-react";
import { TiltCard } from "../common/TiltCard";

export function InvestigationExperienceSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: "01",
      name: "Incoming Signals",
      badge: "TELEMETRY INGESTION",
      badgeColor: "bg-[#FAF0F0] text-[#C94F4F] border-[#E8BABA]",
      title: "Signals Ingested Across Metrics & Logs",
      description: "When an alarm fires, PagerLore ingests Prometheus connection saturation metrics, error logs, and recent Kubernetes deployment manifests without human panic.",
      detailCard: {
        title: "Observed Telemetry Signals",
        items: [
          "HTTP 500 Spike: 28.4% error rate on /v1/checkout/charge",
          "Pool Acquisition Timeout: 50/50 connections active in HikariPool-1",
          "Recent Deployment: v2.8.1 (commit a4f91e8) deployed 14 minutes prior",
        ],
      },
    },
    {
      step: "02",
      name: "Memory Retrieval",
      badge: "HINDSIGHT RECALL",
      badgeColor: "bg-[#EAF2EC] text-[#267B5B] border-[#BFD8C6]",
      title: "Historical Memory Grounding via Parallel RRF",
      description: "PagerLore formulates a multi-path query to the Hindsight bank. Within 85ms, it matches resolved incident INC-2024-089 with 96% confidence.",
      detailCard: {
        title: "Recalled Memory: mem-hindsight-8901",
        items: [
          "Source Precedent: INC-2024-089 (Resolved 5 months ago by Marcus Vance)",
          "Relevance Score: 0.96 / 1.00 (Empirically Grounded)",
          "Historical Root Cause: HikariCP maxLifetime exceeding pgBouncer 10m idle drop",
        ],
      },
    },
    {
      step: "03",
      name: "Evidence Correlation",
      badge: "DIFF & TELEMETRY FUSION",
      badgeColor: "bg-[#FCF6ED] text-[#B8A17A] border-[#E8D3B6]",
      title: "Correlating Git Commits with Past Precedents",
      description: "The engine compares deployment commit a4f91e8 against the historical rule, isolating the exact regression line: max-lifetime was accidentally raised from 9m to 30m.",
      detailCard: {
        title: "Correlated Regression Diff",
        items: [
          "Commit a4f91e8 diff: -hikari.max-lifetime: 540000 | +hikari.max-lifetime: 1800000",
          "Proxy Constraint: pgBouncer server_idle_timeout = 600s (10m)",
          "Contradiction Ruled Out: DB CPU is 38%, confirming this is NOT a slow query lock",
        ],
      },
    },
    {
      step: "04",
      name: "Ranked Hypotheses",
      badge: "EMPIRICAL REASONING",
      badgeColor: "bg-[#EAF2EC] text-[#267B5B] border-[#BFD8C6]",
      title: "Root-Cause Hypotheses Labeled by Evidence",
      description: "The engine produces ranked hypotheses with explicit confidence labels, separating empirical evidence from unverified assumptions.",
      detailCard: {
        title: "Primary Hypothesis (96% Confidence)",
        items: [
          "Hypothesis: HikariCP maxLifetime in v2.8.1 exceeds pgBouncer server_idle_timeout",
          "Confidence Label: EMPIRICALLY GROUNDED (Supported by diff + historical post-mortem)",
          "Secondary Speculative Hypothesis (32%): HTTP client timeout ruled unverified",
        ],
      },
    },
    {
      step: "05",
      name: "Remediation & Rollback",
      badge: "SAFE ACTION PLAN",
      badgeColor: "bg-[#EAF2EC] text-[#267B5B] border-[#BFD8C6]",
      title: "Targeted Hot-Patch with Built-In Rollback Plan",
      description: "Rather than guessing with dangerous pod scaling or blind restarts, PagerLore proposes the exact surgical environment hot-patch that solved the previous incident.",
      detailCard: {
        title: "Recommended Remediation Action",
        items: [
          "Action: Set HIKARI_MAX_LIFETIME=540000 (9m) strictly below pgBouncer 600s",
          "Risk Rating: LOW (Directly verified in historical incident INC-2024-089)",
          "Rollback Command: kubectl set env deployment/payments-service HIKARI_MAX_LIFETIME=1800000",
        ],
      },
    },
    {
      step: "06",
      name: "Human Authorization",
      badge: "SRE GOVERNANCE GATE",
      badgeColor: "bg-[#FCF6ED] text-[#C58B43] border-[#E8D3B6]",
      title: "Explicit Human-in-the-Loop Approval Gate",
      description: "PagerLore never modifies production infrastructure autonomously without authorization. The on-call lead reviews the evidence and authorizes the hot-patch.",
      detailCard: {
        title: "Authorization Record",
        items: [
          "Reviewer: Marcus Vance (Lead SRE Engineer)",
          "Verification: Inspected pgBouncer active pools & confirmed commit diff regression",
          "Execution Status: Authorized for rolling deployment to cluster us-east-1a",
        ],
      },
    },
    {
      step: "07",
      name: "Verified Resolution",
      badge: "SLO RESTORED",
      badgeColor: "bg-[#EAF2EC] text-[#267B5B] border-[#BFD8C6]",
      title: "Service Normalizes & Learnings Retained to Bank",
      description: "Within 45 seconds of rollout, pool saturation drops from 98.6% to 18.4%. The resolution is permanently retained into Hindsight to prevent future recurrence.",
      detailCard: {
        title: "Post-Remediation Verification",
        items: [
          "Connection Pool Saturation: Dropped from 98.6% to 18.4% (Normal)",
          "Total MTTR: 4 minutes (versus 48 minutes baseline without memory)",
          "Hindsight Bank: Newly verified findings retained via retain() with memory ID",
        ],
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="investigation-walkthrough" className="relative py-28 bg-[#F8F7F2] text-[#25352D] border-t border-[#E9E8DF]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Operational SRE Walkthrough</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight font-sans">
            The Investigation Experience: <br />
            <span className="font-serif italic font-normal text-[#267B5B]">
              Intelligent. Defensible. Transparent.
            </span>
          </h2>

          <p className="mt-4 text-base text-[#788579] font-sans leading-relaxed">
            No black-box hallucinations. PagerLore traces every recommendation directly back to empirical telemetry and verified historical post-mortems.
          </p>
        </div>

        {/* 7-Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl text-left border transition-all text-xs font-mono ${
                  isSelected
                    ? "bg-white border-[#267B5B] shadow-sm text-[#25352D]"
                    : "bg-[#F1F0E9] border-[#E9E8DF] text-[#788579] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                    {s.step}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />}
                </div>
                <div className="font-sans font-bold text-xs truncate">
                  {s.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Investigation Preview Window */}
        <TiltCard maxTilt={2} glare={false} className="rounded-2xl bg-white border border-[#E9E8DF] p-6 sm:p-10 shadow-sm">
          {/* Mock Window Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E9E8DF] pb-4 mb-6 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${current.badgeColor}`}>
                {current.badge}
              </span>
              <span className="text-[#25352D] font-bold">
                Investigation Pipeline / Stage {current.step}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#788579]">
              <span className="w-2 h-2 rounded-full bg-[#267B5B] animate-pulse" />
              <span>Hindsight Bank: Connected (Live)</span>
            </div>
          </div>

          {/* Main Stage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl font-bold text-[#25352D] font-sans">
                {current.title}
              </h3>

              <p className="text-sm text-[#788579] font-sans leading-relaxed">
                {current.description}
              </p>

              {/* Verified Checklist Box */}
              <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-2 font-mono text-xs">
                <div className="text-[10px] uppercase font-bold text-[#267B5B] tracking-wider">
                  Stage Verification Record
                </div>
                <div className="text-[#25352D] font-sans text-xs">
                  Grounded across 14 signals · Correlated against 5 historical post-mortems in Hindsight memory bank.
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/investigate?incident=INC-2024-142"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-mono font-semibold transition-colors shadow-sm"
                >
                  <span>Launch Live Investigation Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Detailed Evidence Box */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-5 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-2 text-[10px] uppercase text-[#788579] font-bold">
                  <span>{current.detailCard.title}</span>
                  <span className="text-[#267B5B]">VERIFIED</span>
                </div>

                <ul className="space-y-2 text-[#25352D] font-sans text-xs pt-1">
                  {current.detailCard.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#267B5B] font-bold">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
