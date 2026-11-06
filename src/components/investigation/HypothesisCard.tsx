"use client";

import React from "react";
import Link from "next/link";
import { InvestigationHypothesis } from "@/lib/types/incident";
import { CheckCircle2, XCircle, ArrowRight, Database, Lightbulb, Activity } from "lucide-react";

interface HypothesisCardProps {
  hypothesis: InvestigationHypothesis;
  rank: number;
}

export function HypothesisCard({ hypothesis, rank }: HypothesisCardProps) {
  const isHighConfidence = hypothesis.confidence_pct >= 80;

  return (
    <div
      className={`rounded-2xl p-6 transition-all border ${
        isHighConfidence
          ? "bg-[#0b1220] border-cyan-500/60 shadow-[0_0_25px_rgba(0,240,255,0.15)]"
          : "bg-[#090e18] border-[#1c263c]"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isHighConfidence
                ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            Hypothesis 0{rank}
          </span>
          {isHighConfidence && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-semibold">
              Primary Root Cause
            </span>
          )}
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Confidence:</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isHighConfidence ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]" : "bg-slate-500"
              }`}
              style={{ width: `${hypothesis.confidence_pct}%` }}
            />
          </div>
          <span
            className={`text-xs font-mono font-bold ${
              isHighConfidence ? "text-cyan-300" : "text-slate-400"
            }`}
          >
            {hypothesis.confidence_pct}%
          </span>
        </div>
      </div>

      {/* Hypothesis Statement */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug">
        {hypothesis.hypothesis}
      </h3>

      {/* Historical Incident Connection if available */}
      {hypothesis.relevant_historical_incident && (
        <div className="p-3.5 rounded-xl bg-[#0e172a] border border-cyan-800/50 mb-5 text-xs font-mono">
          <div className="flex items-center justify-between text-cyan-300 mb-1 font-semibold">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recalled Memory: {hypothesis.relevant_historical_incident.id}</span>
            </span>
            <span className="bg-cyan-950 px-2 py-0.5 rounded text-[10px] border border-cyan-700/50">
              Relevance: {Math.round(hypothesis.relevant_historical_incident.relevance_score * 100)}%
            </span>
          </div>
          <p className="text-slate-200 font-sans text-xs">
            {hypothesis.relevant_historical_incident.title}
          </p>
          <div className="text-[11px] text-cyan-400/90 mt-1">
            Similarity: {hypothesis.relevant_historical_incident.root_cause_similarity}
          </div>
        </div>
      )}

      {/* Supporting Evidence */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Supporting Evidence</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300 font-sans">
            {hypothesis.supporting_evidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">›</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contradicting Evidence */}
        {hypothesis.contradicting_evidence.length > 0 && (
          <div>
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Contradicting / Rule-out Factors</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-400 font-sans">
              {hypothesis.contradicting_evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">›</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Diagnostic Next Step */}
      <div className="p-3 rounded-lg bg-[#070a10] border border-[#162136] flex items-start gap-2 text-xs font-mono">
        <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-400">Diagnostic Next Step: </span>
          <span className="text-slate-200">{hypothesis.diagnostic_next_step}</span>
        </div>
      </div>
    </div>
  );
}
