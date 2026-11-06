"use client";

import React, { useState } from "react";
import { Sparkles, BrainCircuit, X, CheckCircle2, ShieldCheck, Terminal } from "lucide-react";
import { HindsightReflectResponse } from "@/lib/hindsight/types";

interface ReflectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReflectModal({ isOpen, onClose }: ReflectModalProps) {
  const [query, setQuery] = useState(
    "What are the common recurring failure patterns and timeout asymmetries across our production microservices?"
  );
  const [budget, setBudget] = useState<"low" | "mid" | "high">("high");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HindsightReflectResponse | null>(null);

  if (!isOpen) return null;

  const handleRunReflect = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/hindsight/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, budget }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-[#E9E8DF] rounded-2xl shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#267B5B]" />
            <h3 className="text-base font-bold text-[#25352D] font-mono uppercase tracking-wider">
              Hindsight REFLECT · Autonomous Reasoning Loop
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#788579] hover:text-[#25352D]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#788579] leading-relaxed font-sans">
          Unlike simple fact retrieval (recall), Hindsight <strong className="text-[#267B5B]">REFLECT</strong> invokes an agentic loop over the bank to synthesize recurring vulnerabilities, resolve contradictions, and derive organization-wide architectural rules.
        </p>

        {/* Input */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#788579] mb-1.5 font-semibold">
            Synthesis Prompt / Inquiry
          </label>
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#F8F7F2] text-xs text-[#25352D] p-3 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans leading-relaxed"
          />
        </div>

        {/* Budget Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#788579]">Reasoning Budget:</span>
            {(["low", "mid", "high"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-2.5 py-1 rounded-lg text-xs uppercase font-mono transition-colors ${
                  budget === b
                    ? "bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30 font-semibold"
                    : "bg-[#F8F7F2] text-[#788579] border border-[#E9E8DF]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunReflect}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <BrainCircuit className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Synthesizing Bank..." : "Trigger Reflection"}</span>
          </button>
        </div>

        {/* Result Output */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-[#E9E8DF] animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#267B5B] font-semibold">
                <span>SYNTHESIZED ARCHITECTURAL PATTERN</span>
                <span>Confidence: {Math.round(result.confidence * 100)}%</span>
              </div>
              <p className="text-xs text-[#25352D] leading-relaxed font-sans">
                {result.synthesis}
              </p>
            </div>

            {/* Grounded Facts */}
            <div>
              <div className="text-[11px] font-mono uppercase text-[#788579] mb-2 font-semibold">
                Grounded Supporting Evidence from Post-Mortems:
              </div>
              <div className="space-y-1.5 text-xs text-[#25352D] font-sans">
                {result.grounded_facts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white border border-[#E9E8DF]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#267B5B] flex-shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventions */}
            <div>
              <div className="text-[11px] font-mono uppercase text-[#267B5B] mb-2 font-semibold">
                Suggested System-Wide Guardrails:
              </div>
              <div className="space-y-1.5 text-xs text-[#25352D] font-sans">
                {result.suggested_preventions.map((prev, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#267B5B] flex-shrink-0 mt-0.5" />
                    <span>{prev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

