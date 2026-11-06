"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Incident, IncidentStatus } from "@/lib/types/incident";
import {
  BrainCircuit,
  ArrowLeft,
  Clock,
  User,
  GitCommit,
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [cmdOpen, setCmdOpen] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"telemetry" | "logs" | "deployments">("telemetry");
  const [newNote, setNewNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetch(`/api/incidents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setIncident(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      if (!updated.error) {
        setIncident(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !incident) return;

    const notes = incident.notes || [];
    const updatedNotes = [
      ...notes,
      {
        id: `note-${Date.now()}`,
        author: "Marcus Vance",
        timestamp: new Date().toISOString(),
        content: newNote.trim(),
      },
    ];

    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      const updated = await res.json();
      if (!updated.error) {
        setIncident(updated);
        setNewNote("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8F7F2] text-[#788579] items-center justify-center font-mono text-xs">
        Loading incident {id}...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex min-h-screen bg-[#F8F7F2] text-[#25352D] items-center justify-center font-mono text-sm">
        Incident not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Link
            href="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#788579] hover:text-[#25352D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incident Log</span>
          </Link>

          {/* Incident Overview Card */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 lg:p-8 shadow-subtle space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <SeverityBadge severity={incident.severity} />
                  <span className="font-mono text-xs text-[#788579] font-bold">{incident.id}</span>
                  <span className="text-[#D9D7CB]">·</span>
                  <StatusBadge status={incident.status} />
                  <span className="text-[#D9D7CB]">·</span>
                  <span className="text-xs font-mono text-[#267B5B] font-semibold">{incident.affected_service}</span>
                  <span className="text-[#D9D7CB]">·</span>
                  <span className="text-xs font-mono text-[#788579]">{incident.environment}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                  {incident.title}
                </h1>

                <p className="text-sm text-[#788579] leading-relaxed max-w-3xl font-sans">
                  {incident.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#788579] pt-2 border-t border-[#E9E8DF]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#267B5B]" />
                    <span>Started: {new Date(incident.started_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#267B5B]" />
                    <span>Lead: {incident.assigned_engineer.name}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <Link
                  href={`/investigate?incident=${incident.id}`}
                  className="px-5 py-2.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-subtle transition-colors"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Investigate with Memory</span>
                </Link>

                {incident.status !== "resolved" ? (
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    disabled={updatingStatus}
                    className="px-4 py-2 rounded bg-[#EAF2EC] hover:bg-[#D9E8DD] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Incident</span>
                  </button>
                ) : (
                  <Link
                    href={`/postmortems?incident=${incident.id}`}
                    className="px-4 py-2 rounded bg-[#F7F3EC] hover:bg-[#EFE8DC] border border-[#E0D5C3] text-[#8C7752] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Post-Mortem</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E9E8DF] pb-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "telemetry"
                  ? "bg-[#FFFFFF] text-[#267B5B] border border-[#BFD8C6] font-semibold"
                  : "text-[#788579] hover:text-[#25352D]"
              }`}
            >
              Telemetry Metrics
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "logs"
                  ? "bg-[#FFFFFF] text-[#267B5B] border border-[#BFD8C6] font-semibold"
                  : "text-[#788579] hover:text-[#25352D]"
              }`}
            >
              Diagnostic Logs ({incident.logs?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("deployments")}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeTab === "deployments"
                  ? "bg-[#FFFFFF] text-[#267B5B] border border-[#BFD8C6] font-semibold"
                  : "text-[#788579] hover:text-[#25352D]"
              }`}
            >
              Recent Deployments ({incident.recent_deployments?.length || 0})
            </button>
          </div>

          {/* Tab 1: Telemetry */}
          {activeTab === "telemetry" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle">
                <span className="text-[#788579] uppercase text-[10px]">Error Rate</span>
                <div className={`text-2xl font-bold mt-1 ${incident.metrics.error_rate_pct > 5 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                  {incident.metrics.error_rate_pct}%
                </div>
                <span className="text-[10px] text-[#9A9C91] mt-0.5 block">SLO Target: &lt; 0.05%</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle">
                <span className="text-[#788579] uppercase text-[10px]">p95 Latency</span>
                <div className={`text-2xl font-bold mt-1 ${incident.metrics.p95_latency_ms > 500 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                  {incident.metrics.p95_latency_ms}ms
                </div>
                <span className="text-[10px] text-[#9A9C91] mt-0.5 block">Baseline: 145ms</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle">
                <span className="text-[#788579] uppercase text-[10px]">DB Connection Pool Saturation</span>
                <div className={`text-2xl font-bold mt-1 ${
                  (incident.metrics.db_connection_pool_saturation_pct || 0) > 80 ? "text-[#C94F4F]" : "text-[#25352D]"
                }`}>
                  {incident.metrics.db_connection_pool_saturation_pct || 22}%
                </div>
                <span className="text-[10px] text-[#9A9C91] mt-0.5 block">50/50 Connections Pinned</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle">
                <span className="text-[#788579] uppercase text-[10px]">Throughput</span>
                <div className="text-2xl font-bold text-[#25352D] mt-1">
                  {incident.metrics.request_rate_rps} rps
                </div>
                <span className="text-[10px] text-[#9A9C91] mt-0.5 block">Live Checkout Volume</span>
              </div>
            </div>
          )}

          {/* Tab 2: Logs */}
          {activeTab === "logs" && (
            <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-4 font-mono text-xs space-y-2 shadow-subtle">
              <div className="text-[10px] uppercase text-[#788579] pb-2 border-b border-[#E9E8DF] flex items-center justify-between font-semibold">
                <span>Ingested Stream · Standard Out & Envoy Ingress</span>
                <span>{incident.logs.length} entries</span>
              </div>
              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {incident.logs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded bg-[#F8F7F2] border border-[#E9E8DF] flex items-start gap-3">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.level === "ERROR" || log.level === "FATAL"
                          ? "bg-[#FAF0F0] text-[#C94F4F] border border-[#E8BABA]"
                          : log.level === "WARN"
                          ? "bg-[#FCF6ED] text-[#C58B43] border border-[#E8D3B6]"
                          : "bg-[#FFFFFF] text-[#788579] border border-[#E9E8DF]"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-[#9A9C91] text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[#267B5B] text-[11px] font-semibold">{log.source}</span>
                    <span className="text-[#25352D] flex-1 break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Deployments */}
          {activeTab === "deployments" && (
            <div className="space-y-4">
              {incident.recent_deployments.map((deploy, idx) => (
                <div key={idx} className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 space-y-3 font-mono text-xs shadow-subtle">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-[#267B5B]" />
                      <span className="text-sm font-bold text-[#25352D]">{deploy.version}</span>
                      <span className="text-[#788579]">({deploy.commit_hash})</span>
                    </div>
                    <span className="text-[#788579]">{new Date(deploy.timestamp).toLocaleString()}</span>
                  </div>

                  <p className="text-[#25352D] font-sans">{deploy.description}</p>

                  {deploy.diff_highlights && (
                    <div className="p-3.5 rounded bg-[#F8F7F2] border border-[#E9E8DF] space-y-1 text-xs">
                      <div className="text-[10px] text-[#788579] uppercase font-semibold">Configuration Diff</div>
                      {deploy.diff_highlights.map((diff, dIdx) => (
                        <div
                          key={dIdx}
                          className={diff.startsWith("+") ? "text-[#267B5B] font-semibold" : diff.startsWith("-") ? "text-[#C94F4F]" : "text-[#788579]"}
                        >
                          {diff}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notes Section */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
              Investigation Notes & Timeline Observations
            </h3>

            <div className="space-y-2.5">
              {(incident.notes || []).map((note) => (
                <div key={note.id} className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF] text-xs">
                  <div className="flex items-center justify-between text-[#788579] font-mono text-[11px] mb-1">
                    <span className="text-[#267B5B] font-semibold">{note.author}</span>
                    <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#25352D] font-sans">{note.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Append diagnostic note or hypothesis..."
                className="flex-1 bg-[#F8F7F2] text-xs text-[#25352D] px-3.5 py-2.5 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
