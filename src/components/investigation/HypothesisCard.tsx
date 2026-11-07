"use client";

import React from "react";
import Link from "next/link";
import { InvestigationHypothesis } from "@/lib/types/incident";
import { CheckCircle2, XCircle, Database, Lightbulb } from "lucide-react";

interface HypothesisCardProps {
  hypothesis: InvestigationHypothesis;
  rank: number;
}

export function HypothesisCard({ hypothesis, rank }: HypothesisCardProps) {
  const isHighConfidence = hypothesis.confidence_pct >= 80;

  return (
    <div
      className={`rounded-xl p-6 transition-all border shadow-subtle ${
        isHighConfidence
          ? "bg-[#FFFFFF] border-2 border-[#267B5B]"
          : "bg-[#FFFFFF] border-[#E9E8DF]"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isHighConfidence
                ? "bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6]"
                : "bg-[#F1F0E9] text-[#788579]"
            }`}
          >
            Hypothesis 0{rank}
          </span>
          {isHighConfidence && (
            <span className="text-[10px] font-mono text-[#267B5B] bg-[#EAF2EC] px-2 py-0.5 rounded border border-[#BFD8C6] font-semibold">
              Primary Root Cause
            </span>
          )}
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-2">
          {hypothesis.confidence_label && (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F1F0E9] text-[#788579] font-semibold border border-[#E9E8DF]">
              {hypothesis.confidence_label}
            </span>
          )}
          <span className="text-xs font-mono text-[#788579]">Confidence:</span>
          <div className="w-20 h-2 bg-[#F1F0E9] rounded-full overflow-hidden border border-[#E9E8DF]">
            <div
              className={`h-full rounded-full ${isHighConfidence ? "bg-[#267B5B]" : "bg-[#9A9C91]"}`}
              style={{ width: `${hypothesis.confidence_pct}%` }}
            />
          </div>
          <span
            className={`text-xs font-mono font-bold ${
              isHighConfidence ? "text-[#267B5B]" : "text-[#788579]"
            }`}
          >
            {hypothesis.confidence_pct}%
          </span>
        </div>
      </div>

      {/* Hypothesis Statement */}
      <h3 className="text-base sm:text-lg font-bold text-[#25352D] mb-4 leading-snug">
        {hypothesis.hypothesis}
      </h3>

      {/* Historical Incident Connection if available */}
      {hypothesis.relevant_historical_incident && (
        <div className="p-3.5 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF] mb-5 text-xs font-mono">
          <div className="flex items-center justify-between text-[#267B5B] mb-1 font-semibold">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#267B5B]" />
              <span>Recalled Memory: {hypothesis.relevant_historical_incident.id}</span>
            </span>
            <span className="bg-[#FFFFFF] text-[#267B5B] px-2 py-0.5 rounded text-[10px] border border-[#BFD8C6]">
              Relevance: {Math.round(hypothesis.relevant_historical_incident.relevance_score * 100)}%
            </span>
          </div>
          <p className="text-[#25352D] font-sans text-xs">
            {hypothesis.relevant_historical_incident.title}
          </p>
          <div className="text-[11px] text-[#788579] mt-1 font-sans">
            Similarity: {hypothesis.relevant_historical_incident.root_cause_similarity}
          </div>
        </div>
      )}

      {/* Supporting Evidence */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="text-[11px] font-mono text-[#267B5B] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Supporting Evidence</span>
          </div>
          <ul className="space-y-1 text-xs text-[#25352D] font-sans">
            {hypothesis.supporting_evidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#267B5B] font-bold mt-0.5">›</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contradicting Factors */}
        {hypothesis.contradicting_evidence.length > 0 && (
          <div>
            <div className="text-[11px] font-mono text-[#C58B43] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Contradicting / Rule-out Factors</span>
            </div>
            <ul className="space-y-1 text-xs text-[#788579] font-sans">
              {hypothesis.contradicting_evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#C58B43] font-bold mt-0.5">›</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Diagnostic Next Step */}
      <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF] flex items-start gap-2 text-xs font-mono">
        <Lightbulb className="w-4 h-4 text-[#B8A17A] flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[#788579]">Diagnostic Next Step: </span>
          <span className="text-[#25352D]">{hypothesis.diagnostic_next_step}</span>
        </div>
      </div>
    </div>
  );
}
