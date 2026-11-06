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
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>INCIDENT LOG</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Production Incidents & Signals
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
                Comprehensive record of active disruptions and historical post-mortems retained in Hindsight.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/incidents/new"
                className="px-4 py-2 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center gap-1.5 shadow-subtle transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Declare Incident</span>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-[#9A9C91] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, ID (e.g. INC-142), or service..."
                className="w-full bg-[#F8F7F2] text-xs font-sans text-[#25352D] pl-8 pr-4 py-2 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-mono text-[#788579]">Severity:</span>
              {["ALL", "SEV-1", "SEV-2", "SEV-3"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSev(sev)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    selectedSev === sev
                      ? "bg-[#EAF2EC] text-[#267B5B] border-[#BFD8C6] font-semibold"
                      : "bg-[#FFFFFF] text-[#788579] border-[#E9E8DF] hover:text-[#25352D]"
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
                className="bg-[#F8F7F2] text-xs font-mono text-[#25352D] border border-[#E9E8DF] rounded px-2.5 py-1 focus:outline-none focus:border-[#267B5B] cursor-pointer"
              >
                <option value="ALL">All</option>
                <option value="active">Active Only</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Incident List Table / List Hybrid */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle overflow-hidden">
            <div className="divide-y divide-[#E9E8DF]">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-[#788579] text-xs font-mono">
                  No incidents match the selected filters.
                </div>
              ) : (
                filtered.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F8F7F2] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="text-[#788579] font-bold">{inc.id}</span>
                        <span className="text-[#D9D7CB]">·</span>
                        <span className="text-[#25352D] font-medium">{inc.affected_service}</span>
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
                          className="px-3 py-1.5 rounded bg-[#EAF2EC] hover:bg-[#D9E8DD] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Investigate</span>
                        </Link>

                        <Link
                          href={`/incidents/${inc.id}`}
                          className="p-1.5 rounded bg-[#F8F7F2] hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#788579] hover:text-[#25352D] transition-colors"
                          title="View detail"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
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
