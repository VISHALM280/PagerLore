"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Activity,
  Terminal,
  Database,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Layers,
  ArrowRight,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [cmdOpen, setCmdOpen] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Box expansion state (which boxes are opened)
  const [expandedBoxes, setExpandedBoxes] = useState<Record<string, boolean>>({
    vitals: true,
    hindsight: true,
    diff: true,
    remediation: true,
    logs: false,
    timeline: false,
  });

  // Modal focus state for full screen deep dive
  const [focusedBox, setFocusedBox] = useState<string | null>(null);

  // Log search filter
  const [logFilter, setLogFilter] = useState("");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Live remediation execution state
  const [executingFix, setExecutingFix] = useState(false);
  const [remediationDone, setRemediationDone] = useState(false);

  useEffect(() => {
    fetch(`/api/incidents/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setIncident(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleBox = (boxKey: string) => {
    setExpandedBoxes((prev) => ({
      ...prev,
      [boxKey]: !prev[boxKey],
    }));
  };

  const expandAll = () => {
    setExpandedBoxes({
      vitals: true,
      hindsight: true,
      diff: true,
      remediation: true,
      logs: true,
      timeline: true,
    });
  };

  const collapseAll = () => {
    setExpandedBoxes({
      vitals: false,
      hindsight: false,
      diff: false,
      remediation: false,
      logs: false,
      timeline: false,
    });
  };

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

  const handleExecuteRemediation = async () => {
    setExecutingFix(true);
    setTimeout(async () => {
      setExecutingFix(false);
      setRemediationDone(true);
      if (incident) {
        const updated = {
          ...incident,
          status: "investigating" as IncidentStatus,
          metrics: {
            ...incident.metrics,
            error_rate_pct: 0.08,
            p95_latency_ms: 154,
            db_connection_pool_saturation_pct: 18,
          },
        };
        setIncident(updated);
        await fetch(`/api/incidents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metrics: updated.metrics,
          }),
        });
      }
    }, 1800);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
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
        Loading active incident workspace {id}...
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

  const filteredLogs = (incident.logs || []).filter(
    (l) =>
      l.message.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.level.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.source.toLowerCase().includes(logFilter.toLowerCase())
  );

  const mockTelemetryTrend = [
    { time: "T-25m", errorRate: 0.02, p95: 140, pool: 24 },
    { time: "T-20m", errorRate: 0.04, p95: 155, pool: 26 },
    { time: "T-15m", errorRate: 1.2, p95: 380, pool: 58 },
    { time: "T-10m", errorRate: 14.8, p95: 1420, pool: 88 },
    { time: "T-5m", errorRate: 24.6, p95: 2410, pool: 96 },
    { time: "Now", errorRate: incident.metrics.error_rate_pct, p95: incident.metrics.p95_latency_ms, pool: incident.metrics.db_connection_pool_saturation_pct || 98 },
  ];

  const patchCommand = "kubectl set env deployment/payments-service HIKARI_MAX_LIFETIME=540000 && kubectl rollout restart deployment/payments-service";

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Back link & Global Grid Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/incidents"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#788579] hover:text-[#25352D] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Incident Directory</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E9E8DF] hover:bg-[#F1F0E9] text-[#788579] hover:text-[#25352D] text-xs font-mono transition-all shadow-sm flex items-center gap-1.5"
              >
                <Maximize2 className="w-3 h-3 text-[#267B5B]" />
                <span>Open All Boxes</span>
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E9E8DF] hover:bg-[#F1F0E9] text-[#788579] hover:text-[#25352D] text-xs font-mono transition-all shadow-sm flex items-center gap-1.5"
              >
                <Minimize2 className="w-3 h-3 text-[#788579]" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Main Incident Hero Card — Rich Ivory & Emerald Elevation */}
          <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C94F4F] via-[#B8A17A] to-[#267B5B]" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <SeverityBadge severity={incident.severity} />
                  <span className="font-mono text-xs font-bold text-[#25352D] px-2.5 py-0.5 rounded-md bg-[#F1F0E9] border border-[#E9E8DF]">
                    {incident.id}
                  </span>
                  <StatusBadge status={incident.status} />
                  <span className="text-[#D9D7CB]">·</span>
                  <span className="text-xs font-mono text-[#267B5B] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF2EC] border border-[#267B5B]/30">
                    {incident.affected_service}
                  </span>
                  <span className="text-[#D9D7CB]">·</span>
                  <span className="text-xs font-mono text-[#788579] uppercase">{incident.environment}</span>
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
                    <span>Disrupted Since: {new Date(incident.started_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#267B5B]" />
                    <span>Incident Commander: <strong>{incident.assigned_engineer.name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 w-full lg:w-64">
                <Link
                  href={`/investigate?incident=${incident.id}`}
                  className="px-5 py-3 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Investigate with Memory</span>
                </Link>

                <Link
                  href={`/theatre`}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8F7F2] border border-[#E9E8DF] text-[#25352D] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B8A17A]" />
                  <span>Compare Memory On/Off</span>
                </Link>

                {incident.status !== "resolved" ? (
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    disabled={updatingStatus}
                    className="px-4 py-2 rounded-xl bg-[#EAF2EC] hover:bg-[#D9E8DD] border border-[#267B5B]/30 text-[#267B5B] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Incident Resolved</span>
                  </button>
                ) : (
                  <Link
                    href={`/postmortems?incident=${incident.id}`}
                    className="px-4 py-2 rounded-xl bg-[#FDF8F0] hover:bg-[#F8EFE3] border border-[#B8A17A]/40 text-[#8C7752] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Post-Mortem in Vault</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE MODULAR BENTO GRID: REFORMATTED EXPANDABLE INTERACTIVE BOXES */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* ------------------------------------------------------------ */}
            {/* BOX 1: TELEMETRY VITALS & LIVE SLO TRAJECTORY */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EAF2EC] text-[#267B5B]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      Live Telemetry & Degradation Vitals
                    </h3>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Active metric deviations breaching service level objectives
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("vitals")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("vitals")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.vitals ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.vitals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Box Summary Metrics Cards (Always visible) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-0.5">
                  <span className="text-[#788579] uppercase text-[10px] font-semibold">Error Rate</span>
                  <div className={`text-xl font-bold ${incident.metrics.error_rate_pct > 5 ? "text-[#C94F4F]" : "text-[#267B5B]"}`}>
                    {incident.metrics.error_rate_pct}%
                  </div>
                  <span className="text-[9px] text-[#9A9C91]">SLO: &lt;0.05%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-0.5">
                  <span className="text-[#788579] uppercase text-[10px] font-semibold">p95 Latency</span>
                  <div className={`text-xl font-bold ${incident.metrics.p95_latency_ms > 500 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                    {incident.metrics.p95_latency_ms}ms
                  </div>
                  <span className="text-[9px] text-[#9A9C91]">Norm: 145ms</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-0.5">
                  <span className="text-[#788579] uppercase text-[10px] font-semibold">Pool Saturation</span>
                  <div className={`text-xl font-bold ${(incident.metrics.db_connection_pool_saturation_pct || 0) > 80 ? "text-[#C94F4F]" : "text-[#267B5B]"}`}>
                    {incident.metrics.db_connection_pool_saturation_pct || 22}%
                  </div>
                  <span className="text-[9px] text-[#9A9C91]">50/50 Pinned</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-0.5">
                  <span className="text-[#788579] uppercase text-[10px] font-semibold">Volume</span>
                  <div className="text-xl font-bold text-[#25352D]">
                    {incident.metrics.request_rate_rps} rps
                  </div>
                  <span className="text-[9px] text-[#9A9C91]">Checkout Traffic</span>
                </div>
              </div>

              {/* Expandable Area: Sparkline Telemetry Graph */}
              {expandedBoxes.vitals && (
                <div className="pt-3 border-t border-[#E9E8DF] space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono text-[#788579]">
                    <span className="font-semibold uppercase text-[11px] text-[#25352D]">
                      Degradation Trajectory (Trailing 30m)
                    </span>
                    <span className="text-[#C94F4F] font-bold">● Connection Saturation Surge</span>
                  </div>

                  <div className="h-44 w-full bg-[#F8F7F2] rounded-xl p-3 border border-[#E9E8DF]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockTelemetryTrend}>
                        <defs>
                          <linearGradient id="poolGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C94F4F" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#C94F4F" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#788579" fontSize={10} fontFamily="monospace" />
                        <YAxis stroke="#788579" fontSize={10} fontFamily="monospace" domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#E9E8DF",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            color: "#25352D",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="pool"
                          name="DB Pool Saturation (%)"
                          stroke="#C94F4F"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#poolGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* BOX 2: HINDSIGHT HISTORICAL RECALL MATCH */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border-2 border-[#267B5B] p-6 shadow-[0_4px_20px_-2px_rgba(38,123,91,0.1)] hover:shadow-[0_12px_32px_-4px_rgba(38,123,91,0.15)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EAF2EC] text-[#267B5B]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#194B38] font-mono uppercase tracking-wider">
                        Hindsight Memory Provenance
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#267B5B] font-mono text-[10px] font-bold border border-[#267B5B]/30">
                        96% MATCH
                      </span>
                    </div>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Prior outage resolution recalled from institutional vault
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("hindsight")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("hindsight")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.hindsight ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.hindsight ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Matched Memory Summary */}
              <div className="p-4 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#194B38]">mem-hindsight-8901-hikari</span>
                  <Link
                    href="/incidents/INC-2024-089"
                    className="text-[#267B5B] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Source: INC-2024-089</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-[#25352D] font-sans leading-relaxed">
                  Identified exact <strong>HikariCP maxLifetime vs pgBouncer server_idle_timeout mismatch</strong> resolved previously in payments-service.
                </p>
              </div>

              {/* Expandable Deep Fact Attribution */}
              {expandedBoxes.hindsight && (
                <div className="pt-2 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#788579] block">
                      Extracted Post-Mortem Rule
                    </span>
                    <p className="text-xs text-[#25352D] font-sans leading-relaxed">
                      &quot;HikariCP maxLifetime must be set strictly less than pgBouncer server_idle_timeout (600s / 10m). When set to 1800000ms, idle connections are dropped silently at 10m by the proxy while HikariCP assumes they remain valid, resulting in thread starvation.&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#788579]">
                    <span>Bank: <strong>pagerlore-production-bank</strong></span>
                    <Link href="/vault" className="text-[#267B5B] hover:underline font-semibold flex items-center gap-1">
                      <span>Inspect Knowledge Graph</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* BOX 3: COMMIT DIFF & CONFIGURATION REGRESSION */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F8F7F2] text-[#25352D]">
                    <GitCommit className="w-4 h-4 text-[#267B5B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      Deployment Regression & Git Diff
                    </h3>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Configuration delta in commit a4f91e8 correlated with outage
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("diff")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("diff")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.diff ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.diff ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Commit Meta Strip */}
              {incident.recent_deployments?.[0] && (
                <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#25352D]">{incident.recent_deployments[0].version}</span>
                    <span className="text-[#788579]">({incident.recent_deployments[0].commit_hash})</span>
                  </div>
                  <span className="text-[#9A9C91]">{incident.recent_deployments[0].author || "Dev Team"}</span>
                </div>
              )}

              {/* Expandable Git Diff Syntax Box */}
              {expandedBoxes.diff && (
                <div className="space-y-3 font-mono text-xs pt-1 animate-in fade-in duration-200">
                  <div className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#788579] font-semibold border-b border-[#E9E8DF] pb-2">
                      <span>application-production.yml</span>
                      <span>Diff against HEAD~1</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[#788579]">  datasource:</div>
                      <div className="text-[#788579]">    hikari:</div>
                      <div className="text-[#788579]">      maximum-pool-size: 50</div>
                      <div className="p-1.5 rounded bg-[#FAF0F0] text-[#C94F4F] font-semibold flex items-center justify-between">
                        <span>-     max-lifetime: 540000 # 9m</span>
                        <span className="text-[10px] uppercase font-bold text-[#C94F4F]">Removed</span>
                      </div>
                      <div className="p-1.5 rounded bg-[#EAF2EC] text-[#267B5B] font-semibold flex items-center justify-between">
                        <span>+     max-lifetime: 1800000 # 30m (Regression)</span>
                        <span className="text-[10px] uppercase font-bold text-[#C94F4F]">Attributed Fault</span>
                      </div>
                      <div className="text-[#788579]">      connection-timeout: 30000</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* BOX 4: VERIFIED REMEDIATION & ACTION GATE */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EAF2EC] text-[#267B5B]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      Verified Remediation Action Gate
                    </h3>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Human-in-the-loop SRE authorization gate
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("remediation")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("remediation")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.remediation ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.remediation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remediation Summary Card */}
              <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#25352D]">Hot-Patch HikariCP Max Lifetime</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#267B5B] font-bold text-[10px] border border-[#267B5B]/30">
                    LOW RISK
                  </span>
                </div>
                <p className="text-[#788579] font-sans">
                  Sets `HIKARI_MAX_LIFETIME` back to 540000ms (9m) and rolls out pods gracefully.
                </p>
              </div>

              {/* Expandable Terminal & Approval Execution */}
              {expandedBoxes.remediation && (
                <div className="space-y-3 font-mono text-xs pt-1 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-[#25352D] text-[#F8F7F2] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#9A9C91]">
                      <span>CLI Command Execution</span>
                      <button
                        onClick={() => handleCopy(patchCommand)}
                        className="text-[#9A9C91] hover:text-white flex items-center gap-1"
                      >
                        {copiedCmd === patchCommand ? <Check className="w-3 h-3 text-[#267B5B]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd === patchCommand ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <code className="block text-[#EAF2EC] text-[11px] break-all select-all font-mono">
                      {patchCommand}
                    </code>
                  </div>

                  {remediationDone ? (
                    <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 text-[#194B38] text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#267B5B]" />
                      <span>Remediation successfully applied! Connection pool saturation resolved to 18%.</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleExecuteRemediation}
                      disabled={executingFix}
                      className="w-full py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      <Play className={`w-3.5 h-3.5 ${executingFix ? "animate-spin" : ""}`} />
                      <span>{executingFix ? "Executing Rolling Patch..." : "Approve & Execute Surgical Patch"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* BOX 5: DIAGNOSTIC LOG STREAM */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F8F7F2] text-[#25352D]">
                    <Terminal className="w-4 h-4 text-[#267B5B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      Diagnostic Ingress & App Logs ({incident.logs?.length || 0})
                    </h3>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Standard out stream captured around the anomaly timestamp
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("logs")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("logs")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.logs ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.logs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Compact Preview Strip */}
              <div className="p-3 rounded-xl bg-[#FAF0F0] border border-[#E8BABA] text-xs font-mono flex items-center justify-between">
                <span className="text-[#C94F4F] font-bold">Latest Error:</span>
                <span className="text-[#C94F4F] truncate max-w-xs sm:max-w-md">
                  PSQLException: Connection is not available, request timed out after 30005ms
                </span>
              </div>

              {/* Expandable Searchable Log Stream */}
              {expandedBoxes.logs && (
                <div className="space-y-3 font-mono text-xs pt-1 animate-in fade-in duration-200">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#9A9C91] absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      placeholder="Filter logs by level (ERROR), thread, or keyword..."
                      className="w-full bg-[#F8F7F2] text-xs font-mono text-[#25352D] pl-8 pr-3 py-2 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF] flex flex-col sm:flex-row sm:items-start gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              log.level === "ERROR" || log.level === "FATAL"
                                ? "bg-[#FAF0F0] text-[#C94F4F] border border-[#E8BABA]"
                                : log.level === "WARN"
                                ? "bg-[#FCF6ED] text-[#C58B43] border border-[#E8D3B6]"
                                : "bg-white text-[#788579] border border-[#E9E8DF]"
                            }`}
                          >
                            {log.level}
                          </span>
                          <span className="text-[#9A9C91] text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="text-[#267B5B] font-semibold text-[11px] flex-shrink-0">
                          [{log.source}]
                        </span>
                        <span className="text-[#25352D] break-all leading-relaxed">
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* BOX 6: TIMELINE OBSERVATIONS & NOTES */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-[0_4px_20px_-2px_rgba(37,53,45,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(37,53,45,0.08)] transition-all space-y-4">
              {/* Box Header */}
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#F8F7F2] text-[#25352D]">
                    <FileText className="w-4 h-4 text-[#267B5B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      Incident Timeline & SRE Notes ({incident.notes?.length || 0})
                    </h3>
                    <p className="text-[11px] text-[#788579] font-sans">
                      Collaborative triage record and hypothesis diary
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedBox("timeline")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title="Fullscreen Focus"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBox("timeline")}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                    title={expandedBoxes.timeline ? "Collapse Box" : "Open Box"}
                  >
                    {expandedBoxes.timeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Latest Note Strip */}
              {incident.notes?.[0] ? (
                <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-xs font-mono flex items-center justify-between">
                  <span className="text-[#267B5B] font-semibold">{incident.notes[0].author}:</span>
                  <span className="text-[#788579] truncate max-w-xs">{incident.notes[0].content}</span>
                </div>
              ) : (
                <div className="text-xs font-mono text-[#788579]">No notes logged yet.</div>
              )}

              {/* Expandable Notes Stream & Post Form */}
              {expandedBoxes.timeline && (
                <div className="space-y-3 font-mono text-xs pt-1 animate-in fade-in duration-200">
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {(incident.notes || []).map((note) => (
                      <div key={note.id} className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-1">
                        <div className="flex items-center justify-between text-[#788579] text-[10px]">
                          <span className="text-[#267B5B] font-semibold">{note.author}</span>
                          <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[#25352D] font-sans text-xs">{note.content}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Append diagnostic note or hypothesis..."
                      className="flex-1 bg-[#F8F7F2] text-xs text-[#25352D] px-3.5 py-2.5 rounded-xl border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>

          {/* ============================================================== */}
          {/* FOCUS MODAL: FULLSCREEN DEEP INSPECTION FOR ANY GRID BOX */}
          {/* ============================================================== */}
          {focusedBox && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="relative w-full max-w-4xl bg-white border border-[#E9E8DF] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[#EAF2EC] text-[#267B5B]">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-[#25352D] font-mono uppercase tracking-wider">
                      {focusedBox === "vitals" && "Focused Vitals & Telemetry Deep Dive"}
                      {focusedBox === "hindsight" && "Focused Hindsight Memory Provenance"}
                      {focusedBox === "diff" && "Focused Git Commit Configuration Diff"}
                      {focusedBox === "remediation" && "Focused Remediation Terminal & Action Gate"}
                      {focusedBox === "logs" && "Focused Diagnostic Log Stream Viewer"}
                      {focusedBox === "timeline" && "Focused Timeline & Collaboration History"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setFocusedBox(null)}
                    className="p-1.5 rounded-lg text-[#788579] hover:text-[#25352D] hover:bg-[#F1F0E9] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body Content */}
                {focusedBox === "vitals" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                        <span className="text-[#788579] uppercase text-[10px]">Error Rate</span>
                        <div className="text-2xl font-bold text-[#C94F4F] mt-1">{incident.metrics.error_rate_pct}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                        <span className="text-[#788579] uppercase text-[10px]">p95 Latency</span>
                        <div className="text-2xl font-bold text-[#C94F4F] mt-1">{incident.metrics.p95_latency_ms}ms</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                        <span className="text-[#788579] uppercase text-[10px]">Pool Saturation</span>
                        <div className="text-2xl font-bold text-[#C94F4F] mt-1">{incident.metrics.db_connection_pool_saturation_pct || 98}%</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                        <span className="text-[#788579] uppercase text-[10px]">Throughput</span>
                        <div className="text-2xl font-bold text-[#25352D] mt-1">{incident.metrics.request_rate_rps} rps</div>
                      </div>
                    </div>
                    <div className="h-64 w-full bg-[#F8F7F2] rounded-xl p-4 border border-[#E9E8DF]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockTelemetryTrend}>
                          <XAxis dataKey="time" stroke="#788579" fontSize={11} fontFamily="monospace" />
                          <YAxis stroke="#788579" fontSize={11} fontFamily="monospace" domain={[0, 100]} />
                          <Tooltip />
                          <Area type="monotone" dataKey="pool" stroke="#C94F4F" strokeWidth={2} fill="#FAF0F0" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {focusedBox === "logs" && (
                  <div className="space-y-3 font-mono text-xs">
                    <input
                      type="text"
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      placeholder="Search log output..."
                      className="w-full bg-[#F8F7F2] text-xs font-mono text-[#25352D] p-3 rounded-xl border border-[#E9E8DF]"
                    />
                    <div className="space-y-1.5 max-h-96 overflow-y-auto">
                      {filteredLogs.map((l) => (
                        <div key={l.id} className="p-3 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF] flex items-start gap-3">
                          <span className="text-[#C94F4F] font-bold text-[10px]">{l.level}</span>
                          <span className="text-[#788579] text-[10px]">{new Date(l.timestamp).toLocaleTimeString()}</span>
                          <span className="text-[#267B5B] font-bold">[{l.source}]</span>
                          <span className="text-[#25352D] flex-1 break-all">{l.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {focusedBox === "diff" && (
                  <div className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-6 space-y-3 font-mono text-xs">
                    <div className="text-sm font-bold text-[#25352D]">
                      {incident.recent_deployments?.[0]?.version} — {incident.recent_deployments?.[0]?.commit_hash}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="p-2 rounded bg-[#FAF0F0] text-[#C94F4F] font-semibold">- max-lifetime: 540000 # 9m</div>
                      <div className="p-2 rounded bg-[#EAF2EC] text-[#267B5B] font-semibold">+ max-lifetime: 1800000 # 30m (Timeout Asymmetry)</div>
                    </div>
                  </div>
                )}

                {focusedBox === "hindsight" && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 space-y-2 text-xs">
                      <div className="font-bold text-[#194B38] text-sm">mem-hindsight-8901-hikari</div>
                      <p className="text-[#25352D] leading-relaxed">
                        Extracted from post-mortem INC-2024-089. Proven rule: HikariCP maxLifetime must never exceed pgBouncer server_idle_timeout.
                      </p>
                    </div>
                    <Link
                      href="/vault"
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#267B5B] hover:underline"
                    >
                      <span>Open Knowledge Graph in Memory Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {focusedBox === "remediation" && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-4 rounded-xl bg-[#25352D] text-[#F8F7F2] space-y-2">
                      <div className="text-[10px] text-[#9A9C91]">Terminal Command</div>
                      <code className="text-[#EAF2EC] text-xs block select-all break-all">{patchCommand}</code>
                    </div>
                    <button
                      onClick={handleExecuteRemediation}
                      disabled={executingFix}
                      className="px-6 py-3 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{executingFix ? "Applying Patch..." : "Execute Remediation"}</span>
                    </button>
                  </div>
                )}

                {focusedBox === "timeline" && (
                  <div className="space-y-3 font-mono text-xs">
                    {(incident.notes || []).map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] space-y-1">
                        <div className="flex justify-between text-[#788579] text-[10px]">
                          <span className="text-[#267B5B] font-bold">{n.author}</span>
                          <span>{new Date(n.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[#25352D] font-sans text-xs">{n.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
