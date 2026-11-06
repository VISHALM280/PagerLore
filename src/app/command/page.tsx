"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SeverityBadge } from "@/components/common/SeverityBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LivePulse } from "@/components/common/LivePulse";
import { Incident } from "@/lib/types/incident";
import {
  AlertTriangle,
  BrainCircuit,
  Database,
  ArrowRight,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  Server,
  Zap,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function CommandCenterPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [bankStatus, setBankStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [incRes, anaRes, bankRes] = await Promise.all([
          fetch("/api/incidents"),
          fetch("/api/analytics"),
          fetch("/api/hindsight/status"),
        ]);
        const incData = await incRes.json();
        const anaData = await anaRes.json();
        const bankData = await bankRes.json();

        setIncidents(incData.incidents || []);
        setAnalytics(anaData);
        setBankStatus(bankData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");
  const criticalCount = activeIncidents.filter((i) => i.severity === "SEV-1").length;
  const leadIncident = activeIncidents[0] || incidents[0];

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Operational Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>COMMAND CENTER · LIVE TELEMETRY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Production Incident Control
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/theatre"
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-950/80 to-cyan-950/80 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-mono font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Signature Demo: Memory ON vs OFF</span>
              </Link>

              <Link
                href="/incidents/new"
                className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                <span>Report Incident</span>
              </Link>
            </div>
          </div>

          {/* Critical Incident Alert Banner (if SEV-1 active) */}
          {leadIncident && leadIncident.severity === "SEV-1" && leadIncident.status !== "resolved" && (
            <div className="rounded-2xl bg-gradient-to-r from-red-950/80 via-[#16101c] to-[#0d1424] border-2 border-red-500/60 p-6 shadow-[0_0_35px_rgba(239,68,68,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-full bg-red-600/10 blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity="SEV-1" />
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">
                      Outage in Progress ({leadIncident.duration_minutes}m)
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs font-mono text-slate-300">{leadIncident.affected_service}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {leadIncident.title}
                  </h2>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {leadIncident.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                    <span className="text-red-400 font-semibold">
                      Error Rate: {leadIncident.metrics.error_rate_pct}%
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-red-400 font-semibold">
                      p95 Latency: {leadIncident.metrics.p95_latency_ms}ms
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400 font-semibold">
                      DB Pool Saturation: {leadIncident.metrics.db_connection_pool_saturation_pct}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  <Link
                    href={`/investigate?incident=${leadIncident.id}`}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 group transform active:scale-95"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Investigate with PagerLore</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href={`/incidents/${leadIncident.id}`}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#141b2e] hover:bg-[#1a2540] border border-[#233559] text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Telemetry</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Operational Metrics Grid - Sophisticated Composition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* System Health */}
            <div className="p-5 rounded-xl bg-[#090e18] border border-[#1c263c] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>SYSTEM HEALTH</span>
                <LivePulse status={criticalCount > 0 ? "active_incident" : "healthy"} />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {criticalCount > 0 ? "Degraded" : "99.98%"}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-2">
                {criticalCount > 0 ? "1 service undergoing active mitigation" : "All 8 microservices operational"}
              </div>
            </div>

            {/* Mean Time to Resolution (MTTR) */}
            <div className="p-5 rounded-xl bg-[#090e18] border border-[#1c263c] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>AVERAGE MTTR</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {analytics?.metrics?.mttr_minutes || 26}m
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> -68% with Memory
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-2">
                Compared to 84m unassisted baseline
              </div>
            </div>

            {/* Hindsight Persistent Memories */}
            <div className="p-5 rounded-xl bg-[#090e18] border border-[#1c263c] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>HINDSIGHT MEMORY VAULT</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-cyan-300 tracking-tight font-mono">
                  {analytics?.metrics?.retained_memories_count || 5}
                </span>
                <span className="text-xs font-mono text-slate-400">retained rules</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-2 flex items-center justify-between">
                <span>Bank: pagerlore-production</span>
                <Link href="/vault" className="text-cyan-400 hover:underline">
                  Inspect →
                </Link>
              </div>
            </div>

            {/* Recurrence Mitigation Score */}
            <div className="p-5 rounded-xl bg-[#090e18] border border-[#1c263c] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>POST-MORTEM COVERAGE</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
                {analytics?.metrics?.postmortem_completion_pct || 100}%
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-2">
                100% of resolved incidents retained into Hindsight
              </div>
            </div>
          </div>

          {/* Two-Column Workspace: Active Incidents Table & Service Topology Shortcut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Incident Feed */}
            <div className="lg:col-span-2 rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
                    Recent Incidents & Telemetry
                  </h3>
                </div>
                <Link
                  href="/incidents"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>View All ({incidents.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-[#162136]">
                {incidents.slice(0, 4).map((inc) => (
                  <div
                    key={inc.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="text-slate-400 font-bold">{inc.id}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-cyan-400">{inc.affected_service}</span>
                        <span className="text-slate-600">·</span>
                        <StatusBadge status={inc.status} size="sm" />
                      </div>
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors block"
                      >
                        {inc.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-[11px] font-mono text-slate-400">
                          {inc.duration_minutes}m duration
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {inc.assigned_engineer.name}
                        </div>
                      </div>

                      <Link
                        href={`/investigate?incident=${inc.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#0e1628] hover:bg-[#14203a] border border-[#1e2f50] hover:border-cyan-500/50 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5"
                      >
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Investigate</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Quick SRE Action Shortcuts & Service Status */}
            <div className="space-y-6">
              {/* Service Topology Snapshot */}
              <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1c263c] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                      Service Health
                    </h3>
                  </div>
                  <Link
                    href="/topology"
                    className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Topology Graph</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-red-800/40">
                    <span className="text-slate-200">payments-service</span>
                    <span className="text-red-400 font-bold">CRITICAL (28.4% err)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-amber-800/30">
                    <span className="text-slate-200">database-cluster</span>
                    <span className="text-amber-400">DEGRADED (98% pool)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1c263c]">
                    <span className="text-slate-200">api-gateway</span>
                    <span className="text-amber-400">WARN (420ms p95)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1c263c]">
                    <span className="text-slate-200">auth-service</span>
                    <span className="text-emerald-400">HEALTHY (45ms)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0d1424] border border-[#1c263c]">
                    <span className="text-slate-200">order-processor</span>
                    <span className="text-emerald-400">HEALTHY (82ms)</span>
                  </div>
                </div>
              </div>

              {/* Memory Recall Live Feed Preview */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0c1424] to-[#090e18] border border-cyan-800/40 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                    Hindsight Memory Feed
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Incoming checkout failure matches <strong>INC-2024-089</strong> HikariCP pool exhaustion with 96% confidence.
                </p>
                <Link
                  href="/theatre"
                  className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Compare Memory ON vs OFF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
