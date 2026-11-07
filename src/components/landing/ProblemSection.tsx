"use client";

import React, { useState } from "react";
import { Clock, AlertCircle, FileSearch, RefreshCw, GitBranch, ShieldCheck, Database, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";

export function ProblemSection() {
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  const timelineMilestones = [
    {
      time: "02:14 AM",
      date: "May 14",
      incident: "INC-2024-089",
      title: "HikariCP Pool Starvation",
      category: "First Occurrence",
      duration: "85m MTTR",
      details: "Database worker threads pinned at 100%. Engineers spent 85 minutes profiling locks and query plans before discovering HikariCP's maxLifetime exceeded pgBouncer's 10m idle timeout.",
      knowledgeStatus: "Static Confluence post-mortem written, then forgotten by runtime systems.",
      badgeColor: "bg-[#FDF8F0] text-[#B8A17A] border-[#B8A17A]/30",
    },
    {
      time: "11:00 AM",
      date: "August 20",
      incident: "v2.6.0 Release",
      title: "Knowledge Evaporation",
      category: "Shift & Team Rotation",
      duration: "0 Active Signals",
      details: "Original on-call engineers moved to different pods. Wiki post-mortems do not integrate with production alerts or Kubernetes manifests.",
      knowledgeStatus: "Critical architectural constraint lost to institutional turnover.",
      badgeColor: "bg-[#F1F0E9] text-[#788579] border-[#E9E8DF]",
    },
    {
      time: "03:42 AM",
      date: "Tonight",
      incident: "INC-2024-142",
      title: "Identical Timeout Asymmetry",
      category: "The Amnesia Cycle",
      duration: "Active SEV-1 Outage",
      details: "Deployment v2.8.1 inadvertently bumped maxLifetime to 30m. A new on-call engineer sees the exact same PSQLException error signature.",
      knowledgeStatus: "Without PagerLore, the team starts diagnosing from zero all over again.",
      badgeColor: "bg-[#FAF0F0] text-[#C94F4F] border-[#E8BABA]",
    },
    {
      time: "03:42:12 AM",
      date: "Tonight",
      incident: "Hindsight Grounded",
      title: "Autonomous Provenance Match",
      category: "PagerLore Activated",
      duration: "12s Recall",
      details: "PagerLore multi-path recall immediately recognizes the INC-089 pattern. Surgical hot-patch command generated and verified with 96% confidence.",
      knowledgeStatus: "Incident memory converted into instant runtime resolution.",
      badgeColor: "bg-[#EAF2EC] text-[#21845F] border-[#21845F]/30",
    },
  ];

  return (
    <section id="problem" className="relative py-28 bg-[#FFFFFF] border-t border-[#E9E8DF] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCF6ED] border border-[#E8D3B6] text-[#C58B43] text-xs font-mono uppercase tracking-wider mb-4 font-semibold">
            <span>The Reality of Production Amnesia</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#24352D] leading-tight">
            Teams solve the <br />
            <span className="italic font-serif font-normal text-[#C58B43]">same failures twice.</span>
          </h2>
          <p className="mt-4 text-base text-[#788579] leading-relaxed">
            When an outage strikes at 3 AM, investigations usually begin from a blank page. The engineers who resolved the same failure five months ago are offline or on other teams, and the post-mortem sits in a static document.
          </p>
        </div>

        {/* Interactive Incident Evolution Timeline */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] shadow-[0_4px_20px_-2px_rgba(37,53,45,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E8DF] pb-5 mb-6">
            <div>
              <div className="text-xs font-mono text-[#21845F] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Interactive Incident Timeline</span>
              </div>
              <h3 className="text-lg font-bold text-[#24352D]">
                How Engineering Failures Evaporate vs. How PagerLore Remembers
              </h3>
            </div>
            <span className="text-xs font-mono text-[#788579]">
              Click milestones to inspect transition
            </span>
          </div>

          {/* Stepper Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {timelineMilestones.map((m, idx) => {
              const isSelected = activeMilestone === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveMilestone(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs ${
                    isSelected
                      ? "bg-white border-[#21845F] shadow-sm ring-1 ring-[#21845F]/20"
                      : "bg-[#FFFFFF]/60 border-[#E9E8DF] hover:bg-white text-[#788579]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#788579]">{m.date}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${m.badgeColor}`}>
                      {m.category}
                    </span>
                  </div>
                  <div className="font-bold text-[#24352D] truncate">{m.incident}</div>
                  <div className="text-[11px] text-[#21845F] mt-0.5">{m.duration}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Milestone Spotlight */}
          <div className="p-5 rounded-xl bg-white border border-[#E9E8DF] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-[#24352D] text-sm">
                  {timelineMilestones[activeMilestone].title}
                </span>
                <span className="text-[#D9D7CB]">·</span>
                <span className="text-[#788579]">{timelineMilestones[activeMilestone].time}</span>
              </div>
              <p className="text-xs text-[#24352D] font-sans leading-relaxed">
                {timelineMilestones[activeMilestone].details}
              </p>
              <div className="text-xs font-mono text-[#788579] pt-1">
                <strong className="text-[#21845F]">Knowledge State: </strong>
                {timelineMilestones[activeMilestone].knowledgeStatus}
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              {activeMilestone === 3 ? (
                <div className="px-4 py-2.5 rounded-xl bg-[#EAF2EC] border border-[#21845F]/30 text-[#194B38] text-xs font-mono font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#21845F]" />
                  <span>Surgical Fix Verified</span>
                </div>
              ) : (
                <button
                  onClick={() => setActiveMilestone((prev) => (prev + 1) % timelineMilestones.length)}
                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#F8F7F2] hover:bg-[#EAF2EC] border border-[#E9E8DF] text-[#24352D] hover:text-[#21845F] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Split Cards with 3D Tilt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Six Months Ago (Without Persistent Memory) */}
          <TiltCard className="rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] p-8 flex flex-col justify-between shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] pb-3 border-b border-[#E9E8DF] mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B8A17A]" />
                  <span>02:14 AM — First Occurrence</span>
                </span>
                <span className="text-[#24352D] font-bold">INC-2024-089</span>
              </div>

              <h3 className="text-xl font-bold text-[#24352D] mb-3">
                HikariCP Connection Pool Saturation
              </h3>

              <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                A configuration mismatch between HikariCP&apos;s connection lifetime (30m) and upstream pgBouncer&apos;s idle timeout (10m) dropped connections silently, pinning database worker threads.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] mb-0.5 font-semibold">Triage Experience</div>
                  <div className="text-[#24352D]">85 minutes spent debugging query plans, thread dumps, and database locks.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF]">
                  <div className="text-[10px] uppercase text-[#788579] mb-0.5 font-semibold">Post-Incident Record</div>
                  <div className="text-[#788579]">Filed into a static wiki page. No automated retrieval at runtime.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9E8DF] text-[11px] font-mono text-[#788579]">
              Outcome: Lesson documented, but disconnected from runtime diagnostic tooling.
            </div>
          </TiltCard>

          {/* Card 2: Tonight (With PagerLore Hindsight Memory) */}
          <TiltCard className="rounded-2xl bg-[#FFFFFF] border-2 border-[#21845F]/50 p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(33,132,95,0.08)]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#21845F] pb-3 border-b border-[#21845F]/20 mb-5 font-semibold">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#21845F]" />
                  <span>03:42 AM — Tonight</span>
                </span>
                <span>INC-2024-142 (Active)</span>
              </div>

              <h3 className="text-xl font-bold text-[#24352D] mb-3">
                Identical Timeout Asymmetry Recurred
              </h3>

              <p className="text-xs text-[#788579] leading-relaxed mb-6 font-sans">
                Deployment v2.8.1 inadvertently modified timeout thresholds. A different engineer on call sees the exact same PSQLException error signature.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#FCF6ED] border border-[#E8D3B6]">
                  <div className="text-[10px] uppercase text-[#C58B43] mb-0.5 font-semibold">The Cost of Amnesia</div>
                  <div className="text-[#24352D]">Without persistent memory, the team repeats the exact same failed diagnostic hypotheses.</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#21845F]/30">
                  <div className="text-[10px] uppercase text-[#21845F] mb-0.5 font-semibold">With PagerLore Grounding</div>
                  <div className="text-[#194B38]">Recalls the exact resolution from INC-089 in 12s, cutting MTTR by 68%.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#21845F]/20 text-[11px] font-mono text-[#21845F] font-semibold">
              Result: The engineering organization leverages prior experience automatically.
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
