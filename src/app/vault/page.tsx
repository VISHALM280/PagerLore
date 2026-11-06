"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { MemoryGraph } from "@/components/vault/MemoryGraph";
import { ReflectModal } from "@/components/vault/ReflectModal";
import { RecallResult, HindsightBankStatus } from "@/lib/hindsight/types";
import {
  Database,
  Search,
  Sparkles,
  Tag,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ExternalLink,
} from "lucide-react";

export default function MemoryVaultPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [memories, setMemories] = useState<RecallResult[]>([]);
  const [bankStatus, setBankStatus] = useState<HindsightBankStatus | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<RecallResult | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  // Manual retain state
  const [showRetainModal, setShowRetainModal] = useState(false);
  const [retainContent, setRetainContent] = useState("");
  const [retainService, setRetainService] = useState("payments-service");
  const [isRetaining, setIsRetaining] = useState(false);

  useEffect(() => {
    async function loadVault() {
      try {
        const [memRes, statRes] = await Promise.all([
          fetch("/api/hindsight/memories"),
          fetch("/api/hindsight/status"),
        ]);
        const memData = await memRes.json();
        const statData = await statRes.json();

        setMemories(memData.memories || []);
        setBankStatus(statData);
        if (memData.memories?.length > 0) {
          setSelectedMemory(memData.memories[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadVault();
  }, []);

  const handleManualRetain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retainContent.trim()) return;

    setIsRetaining(true);
    try {
      const res = await fetch("/api/hindsight/retain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: retainContent.trim(),
          metadata: {
            service: retainService,
            author: "Marcus Vance",
            tags: ["manual-retention", retainService],
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh memories
        const updated = await fetch("/api/hindsight/memories").then((r) => r.json());
        setMemories(updated.memories || []);
        setShowRetainModal(false);
        setRetainContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRetaining(false);
    }
  };

  const filtered = memories.filter((m) => {
    const matchesSearch =
      m.text.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      (m.service && m.service.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "ALL" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
        <ReflectModal isOpen={reflectOpen} onClose={() => setReflectOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Database className="w-4 h-4" />
                <span>HINDSIGHT PERSISTENT MEMORY VAULT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Engineering Memory & Knowledge Graph
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Persistent memory bank housing historical post-mortem facts, architectural constraints, and verified resolutions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReflectOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-950/80 to-cyan-950/80 hover:from-purple-900/90 hover:to-cyan-900/90 border border-purple-500/50 text-purple-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hindsight REFLECT</span>
              </button>

              <button
                onClick={() => setShowRetainModal(true)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Retain Knowledge</span>
              </button>
            </div>
          </div>

          {/* Bank Status Banner */}
          <div className="rounded-xl bg-[#090e18] border border-[#1c263c] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  bankStatus?.connected
                    ? bankStatus?.is_demo_mode
                      ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                      : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                    : "bg-amber-400"
                }`}
              />
              <div>
                <div className="text-slate-200 font-bold">
                  Memory Bank:{" "}
                  <span className="text-cyan-300">{bankStatus?.bank_id || "pagerlore-production-bank"}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                  {bankStatus?.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span>
                Total Memories: <strong className="text-white">{memories.length}</strong>
              </span>
              <span>·</span>
              <span>
                Mode:{" "}
                <strong className={bankStatus?.is_demo_mode ? "text-cyan-300" : "text-emerald-400"}>
                  {bankStatus?.is_demo_mode ? "DEMO MODE (Local Bank)" : "LIVE VECTORIZE"}
                </strong>
              </span>
            </div>
          </div>

          {/* Interactive Knowledge Graph */}
          <MemoryGraph
            memories={memories}
            selectedMemoryId={selectedMemory?.id}
            onSelectMemory={(mem) => setSelectedMemory(mem)}
          />

          {/* Two-Column Explorer: List on Left, Deep Inspector on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Searchable Memory Catalog */}
            <div className="lg:col-span-2 rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#1c263c] pb-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memories by keyword, entity, or service..."
                    className="w-full bg-[#0e1524] text-xs font-sans text-slate-100 pl-9 pr-4 py-2 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {["ALL", "experience", "observation", "world"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-colors ${
                        typeFilter === t
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold"
                          : "bg-[#0e1524] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memory List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filtered.map((mem) => {
                  const isSelected = selectedMemory?.id === mem.id;
                  return (
                    <div
                      key={mem.id}
                      onClick={() => setSelectedMemory(mem)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                        isSelected
                          ? "bg-[#0d1628] border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                          : "bg-[#0a0f1b] border-[#1a253c] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-cyan-300">{mem.id}</span>
                          {mem.source_incident_id && (
                            <span className="text-slate-500">
                              (src: {mem.source_incident_id})
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            mem.type === "experience"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : mem.type === "observation"
                              ? "bg-purple-950 text-purple-300 border border-purple-800"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          }`}
                        >
                          {mem.type}
                        </span>
                      </div>

                      <p className="text-slate-200 font-sans leading-relaxed line-clamp-2">
                        {mem.text}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>Service: {mem.service || "infrastructure"}</span>
                        <span>Relevance Weight: {mem.score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: Selected Memory Provenance Inspector */}
            <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl flex flex-col justify-between">
              {selectedMemory ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="border-b border-[#1c263c] pb-3">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                      Memory Provenance Inspector
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedMemory.id}
                    </h3>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase text-[10px] block mb-1">
                      Full Extracted Knowledge Statement
                    </span>
                    <p className="text-slate-100 font-sans leading-relaxed p-3 rounded-lg bg-[#0e1524] border border-[#1e2d4a]">
                      {selectedMemory.text}
                    </p>
                  </div>

                  {selectedMemory.resolution_action && (
                    <div>
                      <span className="text-emerald-400 uppercase text-[10px] block mb-1 font-semibold">
                        Validated Remediation
                      </span>
                      <p className="text-slate-200 font-sans p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                        {selectedMemory.resolution_action}
                      </p>
                    </div>
                  )}

                  {selectedMemory.entities && selectedMemory.entities.length > 0 && (
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block mb-1.5">
                        Indexed Entities & Graph Relationships
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMemory.entities.map((e, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#101828] text-cyan-300 border border-[#1d2a45] text-[10px]"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMemory.source_incident_id && (
                    <div className="pt-3 border-t border-[#1c263c]">
                      <Link
                        href={`/incidents/${selectedMemory.source_incident_id}`}
                        className="w-full py-2 rounded-lg bg-[#0e1628] hover:bg-[#142036] border border-cyan-800/50 text-cyan-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>View Source Incident ({selectedMemory.source_incident_id})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs font-mono">
                  Select a memory to inspect its provenance.
                </div>
              )}
            </div>
          </div>

          {/* Modal for Manual Retain */}
          {showRetainModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="relative w-full max-w-lg bg-[#090e18] border border-[#1e2d4a] rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Retain Knowledge into Hindsight Bank
                  </h3>
                  <button
                    onClick={() => setShowRetainModal(false)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleManualRetain} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Service</label>
                    <input
                      type="text"
                      value={retainService}
                      onChange={(e) => setRetainService(e.target.value)}
                      className="w-full bg-[#0e1524] text-xs text-slate-100 p-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Verified Knowledge / Post-Mortem Rule
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={retainContent}
                      onChange={(e) => setRetainContent(e.target.value)}
                      placeholder="e.g. When scaling payment pods, ensure HikariCP maxLifetime is less than 540s..."
                      className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRetainModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRetaining}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      {isRetaining ? "Retaining..." : "Retain into Bank"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
