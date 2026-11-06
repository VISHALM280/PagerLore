"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Incident, Severity, IncidentStatus } from "@/lib/types/incident";
import {
  AlertTriangle,
  BrainCircuit,
  ArrowLeft,
  Clock,
  User,
  GitCommit,
  Terminal,
  Activity,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [cmdOpen, setCmdOpen] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"telemetry" | "logs" | "deployments" | "postmortem">("telemetry");
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
      <div className="flex min-h-screen bg-[#07090e] text-slate-400 items-center justify-center font-mono text-xs">
        Loading incident {id}...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex min-h-screen bg-[#07090e] text-slate-300 items-center justify-center font-mono text-sm">
        Incident not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Back Navigation */}
          <Link
            href="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incident Catalog</span>
          </Link>

          {/* Incident Overview Card */}
          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <SeverityBadge severity={incident.severity} />
                  <span className="font-mono text-xs text-slate-400 font-bold">{incident.id}</span>
                  <span className="text-slate-600">·</span>
                  <StatusBadge status={incident.status} />
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">{incident.affected_service}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-slate-400">{incident.environment}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {incident.title}
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {incident.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400 pt-2 border-t border-[#162136]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Started: {new Date(incident.started_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Commander: {incident.assigned_engineer.name} ({incident.assigned_engineer.role})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
                <Link
                  href={`/investigate?incident=${incident.id}`}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Investigate with PagerLore</span>
                </Link>

                {incident.status !== "resolved" ? (
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    disabled={updatingStatus}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve Incident</span>
                  </button>
                ) : (
                  <Link
                    href={`/postmortems?incident=${incident.id}`}
                    className="px-4 py-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 border border-purple-700/60 text-purple-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Post-Mortem</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#1c263c] pb-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "telemetry"
                  ? "bg-[#0e1628] text-cyan-300 border border-cyan-800/60 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Telemetry Metrics
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "logs"
                  ? "bg-[#0e1628] text-cyan-300 border border-cyan-800/60 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Diagnostic Logs ({incident.logs?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("deployments")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "deployments"
                  ? "bg-[#0e1628] text-cyan-300 border border-cyan-800/60 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Recent Deployments ({incident.recent_deployments?.length || 0})
            </button>
            {incident.postmortem && (
              <button
                onClick={() => setActiveTab("postmortem")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "postmortem"
                    ? "bg-[#0e1628] text-purple-300 border border-purple-800/60 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Post-Mortem & Hindsight Memory
              </button>
            )}
          </div>

          {/* Tab 1: Telemetry */}
          {activeTab === "telemetry" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#090e18] border border-[#1c263c]">
                <span className="text-slate-500 uppercase text-[10px]">Error Rate</span>
                <div className={`text-2xl font-bold mt-1 ${incident.metrics.error_rate_pct > 5 ? "text-red-400" : "text-slate-200"}`}>
                  {incident.metrics.error_rate_pct}%
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Baseline SLO: &lt; 0.05%</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090e18] border border-[#1c263c]">
                <span className="text-slate-500 uppercase text-[10px]">p95 Latency</span>
                <div className={`text-2xl font-bold mt-1 ${incident.metrics.p95_latency_ms > 500 ? "text-red-400" : "text-slate-200"}`}>
                  {incident.metrics.p95_latency_ms}ms
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Target: &lt; 150ms</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090e18] border border-[#1c263c]">
                <span className="text-slate-500 uppercase text-[10px]">DB Connection Pool Saturation</span>
                <div className={`text-2xl font-bold mt-1 ${
                  (incident.metrics.db_connection_pool_saturation_pct || 0) > 80 ? "text-red-400" : "text-slate-200"
                }`}>
                  {incident.metrics.db_connection_pool_saturation_pct || 22}%
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">50/50 connections pinned</span>
              </div>

              <div className="p-4 rounded-xl bg-[#090e18] border border-[#1c263c]">
                <span className="text-slate-500 uppercase text-[10px]">Throughput</span>
                <div className="text-2xl font-bold text-slate-200 mt-1">
                  {incident.metrics.request_rate_rps} rps
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Active checkout volume</span>
              </div>
            </div>
          )}

          {/* Tab 2: Logs */}
          {activeTab === "logs" && (
            <div className="rounded-xl bg-[#06080d] border border-[#1c263c] p-4 font-mono text-xs space-y-2">
              <div className="text-[10px] uppercase text-slate-500 pb-2 border-b border-[#162136] flex items-center justify-between">
                <span>Ingested Stream · Standard Out & Envoy Ingress</span>
                <span>{incident.logs.length} entries</span>
              </div>
              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {incident.logs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-[#090e18] border border-slate-900 flex items-start gap-3">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.level === "ERROR" || log.level === "FATAL"
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : log.level === "WARN"
                          ? "bg-amber-950 text-amber-300"
                          : "bg-slate-900 text-slate-400"
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-500 text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-cyan-400 text-[11px]">{log.source}</span>
                    <span className="text-slate-200 flex-1 break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Deployments */}
          {activeTab === "deployments" && (
            <div className="space-y-4">
              {incident.recent_deployments.map((deploy, idx) => (
                <div key={idx} className="rounded-xl bg-[#090e18] border border-[#1c263c] p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCommit className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-bold text-slate-100">{deploy.version}</span>
                      <span className="text-slate-500">({deploy.commit_hash})</span>
                    </div>
                    <span className="text-slate-500">{new Date(deploy.timestamp).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-300 font-sans">{deploy.description}</p>

                  {deploy.diff_highlights && (
                    <div className="p-3 rounded-lg bg-[#06080d] border border-slate-900 space-y-1 text-slate-300">
                      <div className="text-[10px] text-slate-500 uppercase">Configuration Diff</div>
                      {deploy.diff_highlights.map((diff, dIdx) => (
                        <div
                          key={dIdx}
                          className={diff.startsWith("+") ? "text-emerald-400" : diff.startsWith("-") ? "text-red-400" : "text-slate-400"}
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
          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              Investigation Notes & Timeline Logs
            </h3>

            <div className="space-y-2.5">
              {(incident.notes || []).map((note) => (
                <div key={note.id} className="p-3 rounded-xl bg-[#0d1424] border border-[#1a253c] text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                    <span className="text-cyan-400 font-semibold">{note.author}</span>
                    <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200">{note.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Append observation or telemetry note..."
                className="flex-1 bg-[#0e1524] text-xs text-slate-100 px-3.5 py-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all"
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
