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
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
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
    const matchesService = serviceFilter === "ALL" || (m.service && m.service.toLowerCase() === serviceFilter.toLowerCase());
    return matchesSearch && matchesType && matchesService;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
        <ReflectModal isOpen={reflectOpen} onClose={() => setReflectOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1 font-semibold">
                <Database className="w-4 h-4" />
                <span>HINDSIGHT PERSISTENT MEMORY VAULT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Engineering Memory & Knowledge Graph
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
                Persistent memory bank housing historical post-mortem facts, architectural constraints, and verified resolutions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReflectOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#25352D] text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8A17A]" />
                <span>Hindsight REFLECT</span>
              </button>

              <button
                onClick={() => setShowRetainModal(true)}
                className="px-4 py-2 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Retain Knowledge</span>
              </button>
            </div>
          </div>

          {/* Bank Status Banner */}
          <div className="rounded-xl bg-white border border-[#E9E8DF] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  bankStatus?.connected
                    ? "bg-[#267B5B]"
                    : "bg-[#C58B43]"
                }`}
              />
              <div>
                <div className="text-[#25352D] font-bold">
                  Memory Bank:{" "}
                  <span className="text-[#267B5B]">{bankStatus?.bank_id || "pagerlore-production-bank"}</span>
                </div>
                <div className="text-[11px] text-[#788579] font-sans mt-0.5">
                  {bankStatus?.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#788579]">
              <span>
                Total Memories: <strong className="text-[#25352D]">{memories.length}</strong>
              </span>
              <span>·</span>
              <span>
                Mode:{" "}
                <strong className={bankStatus?.is_demo_mode ? "text-[#267B5B]" : "text-[#267B5B]"}>
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
            <div className="lg:col-span-2 rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E9E8DF] pb-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#9A9C91] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search memories by keyword, entity, or service..."
                    className="w-full bg-[#F8F7F2] text-xs font-sans text-[#25352D] pl-9 pr-4 py-2 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="bg-[#F8F7F2] text-xs font-mono text-[#25352D] border border-[#E9E8DF] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#267B5B] cursor-pointer"
                  >
                    <option value="ALL">All Services</option>
                    <option value="payments-service">payments-service</option>
                    <option value="order-processor">order-processor</option>
                    <option value="auth-service">auth-service</option>
                    <option value="database-cluster">database-cluster</option>
                  </select>

                  <div className="flex items-center gap-1">
                    {["ALL", "experience", "observation", "world"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-2 py-1 text-[11px] font-mono rounded-lg capitalize transition-colors ${
                          typeFilter === t
                            ? "bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30 font-semibold"
                            : "bg-[#F8F7F2] text-[#788579] hover:text-[#25352D]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
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
                          ? "bg-[#EAF2EC] border-[#267B5B] shadow-sm"
                          : "bg-[#F8F7F2] border-[#E9E8DF] hover:border-[#267B5B]/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#194B38]">{mem.id}</span>
                          {mem.source_incident_id && (
                            <span className="text-[#788579]">
                              (src: {mem.source_incident_id})
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            mem.type === "experience"
                              ? "bg-white text-[#267B5B] border border-[#267B5B]/30"
                              : mem.type === "observation"
                              ? "bg-white text-[#B8A17A] border border-[#B8A17A]/30"
                              : "bg-white text-[#788579] border border-[#E9E8DF]"
                          }`}
                        >
                          {mem.type}
                        </span>
                      </div>

                      <p className="text-[#25352D] font-sans leading-relaxed line-clamp-2">
                        {mem.text}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#788579] pt-1">
                        <span>Service: {mem.service || "infrastructure"}</span>
                        <span>Relevance Weight: {mem.score}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: Selected Memory Provenance Inspector */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm flex flex-col justify-between">
              {selectedMemory ? (
                <div className="space-y-4 text-xs font-mono">
                  <div className="border-b border-[#E9E8DF] pb-3">
                    <span className="text-[10px] text-[#267B5B] uppercase tracking-wider font-semibold">
                      Memory Provenance Inspector
                    </span>
                    <h3 className="text-base font-bold text-[#25352D] mt-1">
                      {selectedMemory.id}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[#788579] uppercase text-[10px] block mb-1">
                      Full Extracted Knowledge Statement
                    </span>
                    <p className="text-[#25352D] font-sans leading-relaxed p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                      {selectedMemory.text}
                    </p>
                  </div>

                  {selectedMemory.resolution_action && (
                    <div>
                      <span className="text-[#267B5B] uppercase text-[10px] block mb-1 font-semibold">
                        Validated Remediation
                      </span>
                      <p className="text-[#194B38] font-sans p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30">
                        {selectedMemory.resolution_action}
                      </p>
                    </div>
                  )}

                  {selectedMemory.entities && selectedMemory.entities.length > 0 && (
                    <div>
                      <span className="text-[#788579] uppercase text-[10px] block mb-1.5">
                        Indexed Entities & Graph Relationships
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMemory.entities.map((e, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#F8F7F2] text-[#25352D] border border-[#E9E8DF] text-[10px]"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMemory.source_incident_id && (
                    <div className="pt-3 border-t border-[#E9E8DF]">
                      <Link
                        href={`/incidents/${selectedMemory.source_incident_id}`}
                        className="w-full py-2 rounded-xl bg-[#F8F7F2] hover:bg-[#EAF2EC] border border-[#E9E8DF] text-[#25352D] hover:text-[#267B5B] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>View Source Incident ({selectedMemory.source_incident_id})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-[#788579] text-xs font-mono">
                  Select a memory to inspect its provenance.
                </div>
              )}
            </div>
          </div>

          {/* Modal for Manual Retain */}
          {showRetainModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="relative w-full max-w-lg bg-white border border-[#E9E8DF] rounded-2xl shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                  <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                    Retain Knowledge into Hindsight Bank
                  </h3>
                  <button
                    onClick={() => setShowRetainModal(false)}
                    className="text-[#788579] hover:text-[#25352D]"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleManualRetain} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#788579] mb-1 font-semibold">Service</label>
                    <input
                      type="text"
                      value={retainService}
                      onChange={(e) => setRetainService(e.target.value)}
                      className="w-full bg-[#F8F7F2] text-xs text-[#25352D] p-2.5 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#788579] mb-1 font-semibold">
                      Verified Knowledge / Post-Mortem Rule
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={retainContent}
                      onChange={(e) => setRetainContent(e.target.value)}
                      placeholder="e.g. When scaling payment pods, ensure HikariCP maxLifetime is less than 540s..."
                      className="w-full bg-[#F8F7F2] text-xs text-[#25352D] p-3 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRetainModal(false)}
                      className="px-3 py-1.5 text-xs text-[#788579] hover:text-[#25352D]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRetaining}
                      className="px-5 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs shadow-sm"
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

