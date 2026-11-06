"use client";

import React from "react";
import { Database, Search, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";

export function IntelligencePipeline() {
  const pillars = [
    {
      num: "01",
      verb: "Remember",
      title: "Retain verified engineering knowledge",
      description: "When an outage is resolved, PagerLore extracts structured facts, verified root causes, and architectural relationships into an isolated memory bank. Tribal knowledge is transformed into persistent system experience.",
      icon: Database,
      tag: "Hindsight RETAIN",
      highlight: "Captures proven fixes, failed attempts, and diagnostic timelines.",
    },
    {
      num: "02",
      verb: "Recall",
      title: "Retrieve historical context in real time",
      description: "When an active incident is detected, PagerLore runs multi-path retrieval across semantic similarity, keyword matching, and graph traversal to find historical incidents with matching symptom patterns.",
      icon: Search,
      tag: "Multi-Strategy RRF",
      highlight: "Pinpoints prior occurrences with confidence scores and evidence.",
    },
    {
      num: "03",
      verb: "Learn",
      title: "Synthesize cross-incident patterns",
      description: "Through autonomous reflection, PagerLore identifies recurring infrastructure vulnerabilities—such as timeout asymmetries or un-jittered caches—and suggests permanent architectural guardrails.",
      icon: GitBranch,
      tag: "Agentic REFLECT",
      highlight: "Evolves the organization's understanding of systemic fragility.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 bg-[#FFFFFF] border-t border-[#E9E8DF]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono uppercase tracking-wider mb-4">
            <span>Core Architecture</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#25352D] leading-tight">
            How PagerLore <br />
            <span className="italic font-serif font-normal text-[#267B5B]">empowers your SRE team.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            Three interconnected capabilities that replace guesswork with grounded institutional memory.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-8 flex flex-col justify-between hover:border-[#267B5B]/50 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E9E8DF] mb-6">
                    <span className="text-2xl font-serif italic text-[#B8A17A] font-bold">
                      {pillar.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#267B5B] border border-[#E9E8DF] font-semibold">
                      {pillar.tag}
                    </span>
                  </div>

                  <div className="text-xs font-mono uppercase tracking-wider text-[#267B5B] font-semibold mb-1">
                    {pillar.verb}
                  </div>
                  <h3 className="text-xl font-bold text-[#25352D] mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9E8DF] text-[11px] font-mono text-[#25352D]">
                  <span className="text-[#B8A17A] font-bold">Key: </span>
                  {pillar.highlight}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
