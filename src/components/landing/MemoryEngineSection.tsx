"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Database,
  Search,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
  Layers,
} from "lucide-react";
import { TiltCard } from "../common/TiltCard";

// Dynamic load for 3D Knowledge Vault (disables SSR for Three.js)
const Vault3DScene = dynamic(
  () => import("./Vault3DScene").then((m) => m.Vault3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] rounded-2xl bg-white border border-[#E9E8DF] flex items-center justify-center font-mono text-xs text-[#788579] animate-pulse">
        Initializing 3D Knowledge Vault Mesh...
      </div>
    ),
  }
);

export function MemoryEngineSection() {
  const [activeStage, setActiveStage] = useState<number>(1); // 0 = RETAIN, 1 = RECALL, 2 = REFLECT

  const stages = [
    {
      num: "01",
      verb: "RETAIN",
      title: "Store Verified Engineering Experiences",
      subtitle: "Transforming Post-Mortems into Permanent Facts",
      description: "When an outage is resolved, PagerLore extracts verified failure symptoms, root causes, breaking commits, and proven remediation steps into an isolated Hindsight memory bank. Tribal knowledge is transformed into persistent system experience.",
      icon: Database,
      tag: "Hindsight RETAIN",
      highlight: "Captures proven fixes, failed attempts, and exact config parameters.",
      codeSnippet: `// 1. RETAIN: Commit post-mortem into permanent memory
await hindsight.retain({
  content: "Post-Mortem: HikariCP maxLifetime <= 540s",
  retain_mission: "Extract root-cause and verified SRE remediation",
  metadata: {
    incidentId: "INC-2024-089",
    service: "payments-service",
    resolution: "Set maxLifetime=540000ms < pgBouncer 600s",
    tags: ["timeout-asymmetry", "postgres", "hikari"]
  }
}); // -> Persistent on disk in data/pagerlore-storage.json`,
      metrics: {
        label: "Retention Accuracy",
        value: "Structured Facts",
        detail: "Survives process restarts",
      },
    },
    {
      num: "02",
      verb: "RECALL",
      title: "Retrieve Relevant Historical Knowledge",
      subtitle: "Parallel RRF Multi-Path Synthesis",
      description: "When an active incident is detected, PagerLore executes multi-path retrieval across semantic similarity, BM25 keyword matching, and graph traversal. Reciprocal Rank Fusion (RRF) scores matches into Strong, Partial, or Weak tiers.",
      icon: Search,
      tag: "Multi-Strategy RECALL",
      highlight: "Pinpoints prior occurrences with confidence scores and evidence.",
      codeSnippet: `// 2. RECALL: Query memory bank with active symptoms
const matches = await hindsight.recall({
  query: "payments-service connection pool saturation HikariCP pgBouncer timeout PSQLException",
  serviceFilter: "payments-service",
  top_k: 4,
  budget: "high"
});

// Output: mem-hindsight-8901 (96% Match)
// Cites: INC-2024-089 post-mortem from 5 months ago
// Explains: Timeout asymmetry between HikariCP and pgBouncer`,
      metrics: {
        label: "Retrieval Latency",
        value: "~85ms RRF",
        detail: "Zero hallucination",
      },
    },
    {
      num: "03",
      verb: "REFLECT",
      title: "Discover Recurring Patterns Across Incidents",
      subtitle: "Autonomous Cross-Incident Synthesis",
      description: "Through autonomous reflection, PagerLore clusters memories across multiple distinct post-mortems to identify recurring architectural vulnerabilities—such as proxy timeout asymmetries or un-jittered caches—and proposes permanent CI guardrails.",
      icon: GitBranch,
      tag: "Agentic REFLECT",
      highlight: "Evolves the organization's understanding of systemic fragility.",
      codeSnippet: `// 3. REFLECT: Synthesize architectural vulnerability patterns
const reflection = await hindsight.reflect({
  query: "What recurring timeout asymmetries and cache anti-patterns exist across all services?"
});

// Output: Identified recurring vulnerability:
// Pattern: "Asymmetric Timeout Configurations across proxy layers"
// Contributing Incidents: INC-089, INC-142, INC-118
// Guardrail: Enforce client maxLifetime <= proxy timeout in CI`,
      metrics: {
        label: "Pattern Synthesis",
        value: "Cross-Incident",
        detail: "Requires SRE verification",
      },
    },
  ];

  const current = stages[activeStage];

  return (
    <section id="memory-engine" className="relative py-28 bg-[#FFFFFF] text-[#25352D] border-t border-[#E9E8DF]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Complete Memory Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight font-sans">
            The Memory Engine: <br />
            <span className="font-serif italic font-normal text-[#267B5B]">
              RETAIN ➔ RECALL ➔ REFLECT
            </span>
          </h2>

          <p className="mt-4 text-base text-[#788579] font-sans leading-relaxed">
            PagerLore replaces forgotten post-mortems with active operational intelligence. Built on genuine Hindsight persistent memory, every resolution improves the next investigation.
          </p>
        </div>

        {/* 3-Stage Interactive Switcher Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stages.map((s, idx) => {
            const isSelected = activeStage === idx;
            const Icon = s.icon;
            return (
              <button
                key={s.verb}
                onClick={() => setActiveStage(idx)}
                className={`p-5 rounded-2xl text-left border transition-all text-xs font-mono ${
                  isSelected
                    ? "bg-[#EAF2EC] border-[#267B5B] shadow-sm text-[#25352D]"
                    : "bg-[#F8F7F2] border-[#E9E8DF] text-[#788579] hover:bg-[#FFFFFF]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`}>
                    PHASE {s.num}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isSelected ? "bg-white text-[#267B5B] border border-[#BFD8C6]" : "bg-[#F1F0E9] text-[#788579]"
                  }`}>
                    {s.tag}
                  </span>
                </div>

                <div className="font-sans font-bold text-lg text-[#25352D] flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#267B5B]" : "text-[#788579]"}`} />
                  <span>{s.verb}</span>
                </div>

                <div className="text-xs text-[#788579] font-sans mt-1">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Presentation Stage */}
        <TiltCard maxTilt={2} glare={false} className="rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Stage Architecture & Description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-[#E9E8DF] text-[10px] font-mono font-bold text-[#267B5B] uppercase">
                <span>Architecture Method: {current.verb}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#25352D] font-sans">
                {current.title}
              </h3>

              <p className="text-sm text-[#788579] font-sans leading-relaxed">
                {current.description}
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-[#E9E8DF] text-xs font-mono space-y-1">
                <div className="text-[10px] uppercase text-[#788579] font-semibold">Architectural Highlight</div>
                <div className="text-[#25352D] font-sans">{current.highlight}</div>
              </div>

              <div className="pt-2 flex items-center gap-6 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-[#788579] uppercase">{current.metrics.label}</div>
                  <div className="text-base font-bold text-[#267B5B]">{current.metrics.value}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#788579] uppercase">Guarantee</div>
                  <div className="text-base font-bold text-[#25352D]">{current.metrics.detail}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Production TypeScript SDK Code Inspector */}
            <div className="lg:col-span-7">
              <div className="rounded-xl bg-[#111C19] border border-[#267B5B]/30 p-5 font-mono text-xs shadow-md space-y-2 text-white">
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2 text-[10px] text-[#788579] uppercase">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#267B5B]" />
                    <span className="text-[#A3B2A8] font-bold">src/lib/hindsight/client.ts</span>
                  </div>
                  <span className="text-[#267B5B]">TypeScript SDK</span>
                </div>

                <pre className="text-[#48A580] overflow-x-auto whitespace-pre-wrap leading-relaxed pt-2">
                  {current.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Interactive 3D Knowledge Network Canvas */}
        <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E8DF] pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] uppercase font-bold tracking-wider mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>Interactive 3D Knowledge Universe</span>
              </div>
              <h3 className="text-lg font-bold text-[#25352D] font-sans">
                Explore The Retained Institutional Memory Graph
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/vault"
                className="px-4 py-2 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Open Full Memory Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3D Knowledge Orbit Mesh */}
          <Vault3DScene />
        </div>
      </div>
    </section>
  );
}

