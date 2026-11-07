"use client";

import React, { useState, useEffect } from "react";
import { Database, Search, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, Cpu, Activity, Terminal } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";

export function IntelligencePipeline() {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [packetProgress, setPacketProgress] = useState(0);

  // Animate the signal packet traversing the architecture pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const pipelineStages = [
    {
      num: "01",
      verb: "RETAIN",
      title: "Permanent Knowledge Extraction",
      subtitle: "Verified SRE Post-Mortems",
      description: "When an outage is resolved, PagerLore extracts structured facts, verified root causes, and architectural relationships into an isolated Hindsight memory bank. Tribal knowledge is transformed into persistent system experience.",
      icon: Database,
      tag: "Hindsight RETAIN",
      highlight: "Captures proven fixes, failed attempts, and diagnostic timelines.",
      codeSnippet: `await hindsight.retain({
  content: "Post-Mortem: HikariCP maxLifetime <= 540s",
  metadata: { incidentId: "INC-089", service: "payments" }
});`,
    },
    {
      num: "02",
      verb: "RECALL",
      title: "Real-time Multi-Strategy Synthesis",
      subtitle: "Parallel RRF Ranking",
      description: "When an active incident is detected, PagerLore runs multi-path retrieval across semantic similarity, keyword matching, and graph traversal to find historical incidents with matching symptom patterns.",
      icon: Search,
      tag: "Multi-Strategy RRF",
      highlight: "Pinpoints prior occurrences with confidence scores and evidence.",
      codeSnippet: `const matches = await hindsight.recall({
  query: "PSQLException: connection pool pinned 50/50",
  budget: "high",
  types: ["experience", "world"]
}); // -> mem-hindsight-8901 (96% Match)`,
    },
    {
      num: "03",
      verb: "REFLECT",
      title: "Autonomous Structural Guardrails",
      subtitle: "Systemic Pattern Synthesis",
      description: "Through autonomous reflection, PagerLore identifies recurring infrastructure vulnerabilities—such as timeout asymmetries or un-jittered caches—and suggests permanent architectural guardrails.",
      icon: GitBranch,
      tag: "Agentic REFLECT",
      highlight: "Evolves the organization's understanding of systemic fragility.",
      codeSnippet: `const rules = await hindsight.reflect({
  query: "Recurring timeout asymmetries across proxy layers"
}); // -> Synthesizes CI linter constraint`,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 bg-[#FFFFFF] border-t border-[#E9E8DF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#21845F]/20 text-[#21845F] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <span>System Architecture & Information Flow</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#24352D] leading-tight">
            How PagerLore <br />
            <span className="italic font-serif font-normal text-[#21845F]">empowers your SRE team.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            Three interconnected capabilities that replace guesswork with grounded institutional memory.
          </p>
        </div>

        {/* Dynamic Architectural Signal Pipeline Visualizer */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] shadow-[0_4px_20px_-2px_rgba(37,53,45,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E8DF] pb-5 mb-6">
            <div>
              <div className="text-xs font-mono text-[#21845F] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Live Signal Workflow</span>
              </div>
              <h3 className="text-base font-bold text-[#24352D]">
                Data Path: Signal Ingestion ➔ Hindsight Reasoning ➔ SRE Execution
              </h3>
            </div>
            <span className="text-xs font-mono text-[#788579]">
              Packet flow: <strong>{Math.round(packetProgress)}%</strong> traversal
            </span>
          </div>

          {/* Animated SVG Pipeline Diagram with Moving Packet */}
          <div className="relative w-full h-24 mb-6 hidden md:block">
            <svg className="w-full h-full" viewBox="0 0 900 80">
              {/* Background Guide Line */}
              <line x1="80" y1="40" x2="820" y2="40" stroke="#E9E8DF" strokeWidth="4" strokeLinecap="round" />
              {/* Active Traversing Line */}
              <line
                x1="80"
                y1="40"
                x2={80 + (packetProgress / 100) * 740}
                y2="40"
                stroke="#21845F"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Stage Nodes on Track */}
              {[
                { x: 120, label: "01 RETAIN", active: packetProgress >= 0 },
                { x: 450, label: "02 RECALL", active: packetProgress >= 45 },
                { x: 780, label: "03 REFLECT", active: packetProgress >= 90 },
              ].map((st, i) => (
                <g key={i}>
                  <circle
                    cx={st.x}
                    y={40}
                    r={st.active ? 14 : 10}
                    fill={st.active ? "#21845F" : "#FFFFFF"}
                    stroke="#21845F"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <circle cx={st.x} y={40} r={4} fill="#FFFFFF" />
                  <text
                    x={st.x}
                    y={70}
                    textAnchor="middle"
                    fill="#24352D"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {st.label}
                  </text>
                </g>
              ))}

              {/* Traveling Signal Pulse Packet */}
              <circle
                cx={80 + (packetProgress / 100) * 740}
                cy={40}
                r={7}
                fill="#C94F4F"
                className="shadow-sm"
              />
            </svg>
          </div>

          {/* Code & Metadata Spotlight for Selected Stage */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E9E8DF] flex flex-col md:flex-row items-start justify-between gap-6 shadow-sm">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#21845F] px-2.5 py-0.5 rounded-full bg-[#EAF2EC] border border-[#21845F]/20">
                  {pipelineStages[activeStage].tag}
                </span>
                <span className="font-bold text-[#24352D] text-sm">
                  {pipelineStages[activeStage].title}
                </span>
              </div>
              <p className="text-xs text-[#788579] font-sans leading-relaxed">
                {pipelineStages[activeStage].description}
              </p>
            </div>

            <div className="w-full md:w-96 rounded-xl bg-[#24352D] p-3 text-[#F8F7F2] font-mono text-[11px] overflow-x-auto flex-shrink-0">
              <div className="flex items-center justify-between text-[10px] text-[#9A9C91] pb-1.5 border-b border-[#3A4E44] mb-2">
                <span>Hindsight API Call</span>
                <span className="text-[#21845F]">typescript</span>
              </div>
              <pre className="text-[#EAF2EC] leading-relaxed whitespace-pre-wrap">
                {pipelineStages[activeStage].codeSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* 3 Pillars in 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pipelineStages.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = activeStage === idx;
            return (
              <div
                key={pillar.num}
                onClick={() => setActiveStage(idx)}
                className="cursor-pointer"
              >
                <TiltCard
                  className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? "bg-white border-2 border-[#21845F] shadow-[0_8px_30px_rgba(33,132,95,0.12)]"
                      : "bg-[#F8F7F2] border border-[#E9E8DF] hover:bg-white hover:border-[#21845F]/40 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.04)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-[#E9E8DF] mb-6">
                      <span className="text-2xl font-serif italic text-[#B8A17A] font-bold">
                        {pillar.num}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[#21845F] border border-[#E9E8DF] font-bold">
                        {pillar.tag}
                      </span>
                    </div>

                    <div className="text-xs font-mono uppercase tracking-wider text-[#21845F] font-bold mb-1">
                      {pillar.verb}
                    </div>
                    <h3 className="text-xl font-bold text-[#24352D] mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E9E8DF] text-[11px] font-mono text-[#24352D] flex items-center justify-between">
                    <span>
                      <strong className="text-[#B8A17A]">Core: </strong>
                      {pillar.highlight}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "text-[#21845F] translate-x-1" : "text-[#788579]"}`} />
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
