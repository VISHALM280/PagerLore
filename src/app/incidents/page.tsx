"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Incident, Severity, IncidentStatus } from "@/lib/types/incident";
import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  BrainCircuit,
  Calendar,
  Layers,
  Clock,
  RotateCcw,
} from "lucide-react";

export default function IncidentsPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSev, setSelectedSev] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => setIncidents(data.incidents || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>INCIDENT CATALOG</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Production Incidents & Signals
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Comprehensive record of active disruptions and historical post-mortems retained in Hindsight.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/incidents/new"
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Declare Incident</span>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-[#090e18] border border-[#1c263c] flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, ID (e.g. INC-142), or service..."
                className="w-full bg-[#0e1524] text-xs font-sans text-slate-100 pl-9 pr-4 py-2 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-mono text-slate-500">Severity:</span>
              {["ALL", "SEV-1", "SEV-2", "SEV-3"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSev(sev)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                    selectedSev === sev
                      ? "bg-cyan-950 text-cyan-300 border-cyan-700/60 font-semibold"
                      : "bg-[#0e1524] text-slate-400 border-[#1e2d4a] hover:text-slate-200"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-mono text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#0e1524] text-xs font-mono text-slate-300 border border-[#1e2d4a] rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Incident List Table */}
          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] overflow-hidden shadow-2xl">
            <div className="divide-y divide-[#162136]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs font-mono">
                  No incidents match the selected filters.
                </div>
              ) : (
                filtered.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#0c1322] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="font-mono text-xs text-slate-400 font-bold">{inc.id}</span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-xs text-cyan-400">{inc.affected_service}</span>
                        <span className="text-slate-600">·</span>
                        <StatusBadge status={inc.status} size="sm" />
                        <span className="text-slate-600">·</span>
                        <span className="text-xs font-mono text-slate-400">
                          {inc.environment}
                        </span>
                      </div>

                      <Link
                        href={`/incidents/${inc.id}`}
                        className="text-base font-bold text-slate-100 hover:text-cyan-300 transition-colors block"
                      >
                        {inc.title}
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {inc.description}
                      </p>
                    </div>

                    {/* Right Action & Metadata */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block text-xs font-mono">
                        <div className="text-slate-300 font-medium">{inc.duration_minutes}m duration</div>
                        <div className="text-[10px] text-slate-500">{inc.assigned_engineer.name}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/investigate?incident=${inc.id}`}
                          className="px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Investigate</span>
                        </Link>

                        <Link
                          href={`/incidents/${inc.id}`}
                          className="p-2 rounded-lg bg-[#0e1524] hover:bg-[#142036] border border-[#1e2d4a] text-slate-300 hover:text-white transition-colors"
                          title="View detail"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
