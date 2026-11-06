"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Incident } from "@/lib/types/incident";
import {
  AlertTriangle,
  Search,
  Plus,
  ArrowRight,
  BrainCircuit,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Activity,
  Maximize2,
  ExternalLink,
} from "lucide-react";

export default function IncidentsPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSev, setSelectedSev] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        const incs = data.incidents || [];
        setIncidents(incs);
        // Default expand the first active incident
        if (incs.length > 0) {
          setExpandedCards({ [incs[0].id]: true });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCard = (incId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [incId]: !prev[incId],
    }));
  };

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.affected_service.toLowerCase().includes(search.toLowerCase());

    const matchesSev = selectedSev === "ALL" || inc.severity === selectedSev;
    const matchesStatus =
      selectedStatus === "ALL"
        ? true
        : selectedStatus === "active"
        ? inc.status !== "resolved"
        : inc.status === selectedStatus;

    return matchesSearch && matchesSev && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ACTIVE INCIDENT RADAR</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Production Incidents & Signals
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
                Comprehensive record of active disruptions and historical post-mortems retained in Hindsight.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="inline-flex rounded-xl bg-white border border-[#E9E8DF] p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-[#EAF2EC] text-[#267B5B] font-semibold"
                      : "text-[#788579] hover:text-[#25352D]"
                  }`}
                  title="Grid Boxes View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid Boxes</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-[#EAF2EC] text-[#267B5B] font-semibold"
                      : "text-[#788579] hover:text-[#25352D]"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <Link
                href="/incidents/new"
                className="px-4 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Declare Incident</span>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-[#E9E8DF] shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#9A9C91] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, ID (e.g. INC-142), or service..."
                className="w-full bg-[#F8F7F2] text-xs font-sans text-[#25352D] pl-10 pr-4 py-2.5 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-mono text-[#788579]">Severity:</span>
              {["ALL", "SEV-1", "SEV-2", "SEV-3"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSev(sev)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all ${
                    selectedSev === sev
                      ? "bg-[#EAF2EC] text-[#267B5B] border-[#267B5B]/30 font-semibold shadow-sm"
                      : "bg-white text-[#788579] border-[#E9E8DF] hover:text-[#25352D]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-mono text-[#788579]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#F8F7F2] text-xs font-mono text-[#25352D] border border-[#E9E8DF] rounded-xl px-3 py-2 focus:outline-none focus:border-[#267B5B] cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="active">Active Disruptions Only</option>
                <option value="investigating">Under Investigation</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* GRID BOXES VIEW */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {filtered.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[#788579] text-xs font-mono rounded-2xl bg-white border border-[#E9E8DF]">
                  No incidents match the active search and filter parameters.
                </div>
              ) : (
                filtered.map((inc) => {
                  const isOpen = Boolean(expandedCards[inc.id]);
                  return (
                    <div
                      key={inc.id}
                      className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] hover:border-[#267B5B]/50 transition-all space-y-4"
                    >
                      {/* Box Top Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#E9E8DF] pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <SeverityBadge severity={inc.severity} size="sm" />
                          <span className="font-mono text-xs font-bold text-[#25352D] px-2 py-0.5 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                            {inc.id}
                          </span>
                          <StatusBadge status={inc.status} size="sm" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#788579]">
                            {inc.duration_minutes}m duration
                          </span>
                          <button
                            onClick={() => toggleCard(inc.id)}
                            className="p-1 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                            title={isOpen ? "Collapse Details" : "Open Details"}
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Main Title & Service */}
                      <div>
                        <div className="text-xs font-mono text-[#267B5B] font-bold mb-1">
                          {inc.affected_service} · {inc.environment}
                        </div>
                        <Link
                          href={`/incidents/${inc.id}`}
                          className="text-base font-bold text-[#25352D] hover:text-[#267B5B] transition-colors line-clamp-2"
                        >
                          {inc.title}
                        </Link>
                        <p className="text-xs text-[#788579] mt-1.5 font-sans line-clamp-2 leading-relaxed">
                          {inc.description}
                        </p>
                      </div>

                      {/* Metrics Summary Strip */}
                      <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                          <span className="text-[9px] text-[#788579] uppercase block font-semibold">Error Rate</span>
                          <span className={`font-bold ${inc.metrics.error_rate_pct > 5 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                            {inc.metrics.error_rate_pct}%
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                          <span className="text-[9px] text-[#788579] uppercase block font-semibold">p95 Latency</span>
                          <span className={`font-bold ${inc.metrics.p95_latency_ms > 500 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                            {inc.metrics.p95_latency_ms}ms
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                          <span className="text-[9px] text-[#788579] uppercase block font-semibold">Pool Sat</span>
                          <span className={`font-bold ${(inc.metrics.db_connection_pool_saturation_pct || 0) > 80 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                            {inc.metrics.db_connection_pool_saturation_pct || 22}%
                          </span>
                        </div>
                      </div>

                      {/* Expandable Preview Section */}
                      {isOpen && (
                        <div className="pt-3 border-t border-[#E9E8DF] space-y-3 text-xs font-mono animate-in fade-in duration-200">
                          {inc.logs?.[0] && (
                            <div className="p-2.5 rounded-xl bg-[#FAF0F0] border border-[#E8BABA] text-[#C94F4F] truncate">
                              <strong>Sample Log:</strong> {inc.logs[0].message}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[11px] text-[#788579]">
                            <span>Lead: <strong>{inc.assigned_engineer.name}</strong></span>
                            <span>Started: {new Date(inc.started_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Action Footer */}
                      <div className="pt-3 border-t border-[#E9E8DF] flex items-center justify-between gap-3">
                        <Link
                          href={`/incidents/${inc.id}`}
                          className="text-xs font-mono text-[#25352D] hover:text-[#267B5B] font-semibold flex items-center gap-1 group"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href={`/investigate?incident=${inc.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#EAF2EC] hover:bg-[#D9E8DD] border border-[#267B5B]/30 text-[#267B5B] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Investigate with Memory</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="rounded-2xl bg-white border border-[#E9E8DF] shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] overflow-hidden">
              <div className="divide-y divide-[#E9E8DF]">
                {filtered.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F8F7F2] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="text-[#25352D] font-bold">{inc.id}</span>
                        <span className="text-[#D9D7CB]">·</span>
                        <span className="text-[#267B5B] font-semibold">{inc.affected_service}</span>
                        <span className="text-[#D9D7CB]">·</span>
                        <StatusBadge status={inc.status} size="sm" />
                        <span className="text-[#D9D7CB]">·</span>
                        <span className="text-[#788579]">{inc.environment}</span>
                      </div>

                      <Link
                        href={`/incidents/${inc.id}`}
                        className="text-base font-semibold text-[#25352D] hover:text-[#267B5B] transition-colors block"
                      >
                        {inc.title}
                      </Link>

                      <p className="text-xs text-[#788579] line-clamp-1 font-sans">
                        {inc.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block text-xs font-mono">
                        <div className="text-[#25352D] font-medium">{inc.duration_minutes}m duration</div>
                        <div className="text-[10px] text-[#788579]">{inc.assigned_engineer.name}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/investigate?incident=${inc.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#EAF2EC] hover:bg-[#D9E8DD] border border-[#267B5B]/30 text-[#267B5B] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Investigate</span>
                        </Link>

                        <Link
                          href={`/incidents/${inc.id}`}
                          className="p-2 rounded-xl bg-[#F8F7F2] hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#788579] hover:text-[#25352D] transition-colors"
                          title="Open Workspace"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
