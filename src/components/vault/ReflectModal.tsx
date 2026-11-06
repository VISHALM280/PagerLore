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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090e18] border border-[#1e2d4a] rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Hindsight REFLECT · Autonomous Reasoning Loop
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Unlike simple fact retrieval (recall), Hindsight <strong className="text-cyan-300">REFLECT</strong> invokes an agentic loop over the bank to synthesize recurring vulnerabilities, resolve contradictions, and derive organization-wide architectural rules.
        </p>

        {/* Input */}
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
            Synthesis Prompt / Inquiry
          </label>
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
          />
        </div>

        {/* Budget Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Reasoning Budget:</span>
            {(["low", "mid", "high"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-2.5 py-1 rounded text-xs uppercase font-mono transition-colors ${
                  budget === b
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold"
                    : "bg-[#0e1524] text-slate-400 border border-[#1e2d4a]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunReflect}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
          >
            <BrainCircuit className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Synthesizing Bank..." : "Trigger Reflection"}</span>
          </button>
        </div>

        {/* Result Output */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-[#1c263c] animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-[#0d1627] border border-cyan-800/60 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-semibold">
                <span>SYNTHESIZED ARCHITECTURAL PATTERN</span>
                <span>Confidence: {Math.round(result.confidence * 100)}%</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {result.synthesis}
              </p>
            </div>

            {/* Grounded Facts */}
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-semibold">
                Grounded Supporting Evidence from Post-Mortems:
              </div>
              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                {result.grounded_facts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-[#070b14] border border-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventions */}
            <div>
              <div className="text-[11px] font-mono uppercase text-cyan-400 mb-2 font-semibold">
                Suggested System-Wide Guardrails:
              </div>
              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                {result.suggested_preventions.map((prev, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-[#070b14] border border-cyan-950">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
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
