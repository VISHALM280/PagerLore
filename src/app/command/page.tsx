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
  Clock,
  CheckCircle2,
  Server,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function CommandCenterPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [incRes, anaRes] = await Promise.all([
          fetch("/api/incidents"),
          fetch("/api/analytics"),
        ]);
        const incData = await incRes.json();
        const anaData = await anaRes.json();
        setIncidents(incData.incidents || []);
        setAnalytics(anaData);
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />
                <span>OPERATIONAL OVERVIEW · REAL-TIME</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Incident Command Center
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/theatre"
                className="px-3.5 py-2 rounded bg-[#FFFFFF] border border-[#E9E8DF] hover:border-[#267B5B]/40 text-[#25352D] text-xs font-mono font-medium flex items-center gap-2 shadow-subtle transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8A17A]" />
                <span>Memory Benchmark</span>
              </Link>

              <Link
                href="/incidents/new"
                className="px-3.5 py-2 rounded bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
              >
                <span>Report Incident</span>
              </Link>
            </div>
          </div>

          {/* Active SEV-1 Outage Card */}
          {leadIncident && leadIncident.severity === "SEV-1" && leadIncident.status !== "resolved" && (
            <div className="rounded-xl bg-[#FFFFFF] border-2 border-[#E8BABA] p-6 shadow-editorial">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5 text-xs font-mono">
                    <SeverityBadge severity="SEV-1" size="sm" />
                    <span className="text-[#C94F4F] font-bold">
                      Outage in Progress ({leadIncident.duration_minutes}m)
                    </span>
                    <span className="text-[#D9D7CB]">·</span>
                    <span className="text-[#788579]">{leadIncident.affected_service}</span>
                  </div>

                  <h2 className="text-xl font-bold text-[#25352D]">
                    {leadIncident.title}
                  </h2>

                  <p className="text-xs text-[#788579] line-clamp-2 leading-relaxed font-sans">
                    {leadIncident.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#25352D] pt-1">
                    <span className="text-[#C94F4F] font-semibold">
                      Error Rate: {leadIncident.metrics.error_rate_pct}%
                    </span>
                    <span className="text-[#D9D7CB]">|</span>
                    <span className="text-[#C94F4F] font-semibold">
                      p95: {leadIncident.metrics.p95_latency_ms}ms
                    </span>
                    <span className="text-[#D9D7CB]">|</span>
                    <span className="text-[#C58B43] font-semibold">
                      DB Pool: {leadIncident.metrics.db_connection_pool_saturation_pct}%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  <Link
                    href={`/investigate?incident=${leadIncident.id}`}
                    className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-subtle transition-colors"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>Investigate Incident</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/incidents/${leadIncident.id}`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded bg-[#F8F7F2] hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#25352D] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Telemetry</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] mb-2">
                <span>SYSTEM HEALTH</span>
                <LivePulse status={criticalCount > 0 ? "active_incident" : "healthy"} />
              </div>
              <div className="text-2xl font-bold text-[#25352D] tracking-tight">
                {criticalCount > 0 ? "Degraded" : "99.98%"}
              </div>
              <div className="text-[11px] font-mono text-[#788579] mt-2">
                {criticalCount > 0 ? "1 service under active mitigation" : "All services operational"}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] mb-2">
                <span>AVERAGE MTTR</span>
                <Clock className="w-4 h-4 text-[#267B5B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#25352D] tracking-tight font-mono">
                  {analytics?.metrics?.mttr_minutes || 26}m
                </span>
                <span className="text-xs text-[#267B5B] font-mono flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" /> -68% with Memory
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#788579] mt-2">
                vs. 84m unassisted historical average
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] mb-2">
                <span>RETAINED MEMORIES</span>
                <Database className="w-4 h-4 text-[#267B5B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#267B5B] tracking-tight font-mono">
                  {analytics?.metrics?.retained_memories_count || 5}
                </span>
                <span className="text-xs font-mono text-[#788579]">verified rules</span>
              </div>
              <div className="text-[11px] font-mono text-[#788579] mt-2 flex items-center justify-between">
                <span>Bank: pagerlore-production</span>
                <Link href="/vault" className="text-[#267B5B] hover:underline">
                  Inspect →
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] shadow-subtle flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#788579] mb-2">
                <span>POST-MORTEM COVERAGE</span>
                <CheckCircle2 className="w-4 h-4 text-[#267B5B]" />
              </div>
              <div className="text-2xl font-bold text-[#267B5B] tracking-tight font-mono">
                {analytics?.metrics?.postmortem_completion_pct || 100}%
              </div>
              <div className="text-[11px] font-mono text-[#788579] mt-2">
                All resolved outages retained in vault
              </div>
            </div>
          </div>

          {/* Two-Column Section: Incident Feed & Service Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Incident Feed */}
            <div className="lg:col-span-2 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
                  Recent Incidents & Telemetry
                </h3>
                <Link
                  href="/incidents"
                  className="text-xs font-mono text-[#267B5B] hover:underline flex items-center gap-1"
                >
                  <span>View All ({incidents.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-[#E9E8DF]">
                {incidents.slice(0, 4).map((inc) => (
                  <div
                    key={inc.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <SeverityBadge severity={inc.severity} size="sm" />
                        <span className="text-[#788579] font-bold">{inc.id}</span>
                        <span className="text-[#D9D7CB]">·</span>
                        <span className="text-[#25352D]">{inc.affected_service}</span>
                        <span className="text-[#D9D7CB]">·</span>
                        <StatusBadge status={inc.status} size="sm" />
                      </div>
                      <Link
                        href={`/incidents/${inc.id}`}
                        className="text-sm font-semibold text-[#25352D] hover:text-[#267B5B] transition-colors block"
                      >
                        {inc.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block text-xs font-mono">
                        <div className="text-[#25352D] font-medium">{inc.duration_minutes}m duration</div>
                        <div className="text-[10px] text-[#788579]">{inc.assigned_engineer.name}</div>
                      </div>

                      <Link
                        href={`/investigate?incident=${inc.id}`}
                        className="px-3 py-1.5 rounded bg-[#F8F7F2] hover:bg-[#F1F0E9] border border-[#E9E8DF] text-[#25352D] text-xs font-mono transition-colors flex items-center gap-1.5"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 text-[#267B5B]" />
                        <span>Investigate</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Service Health Snapshot & Memory Tip */}
            <div className="space-y-6">
              <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 shadow-subtle">
                <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3 mb-4">
                  <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
                    Service Health
                  </h3>
                  <Link
                    href="/topology"
                    className="text-[11px] font-mono text-[#267B5B] hover:underline flex items-center gap-1"
                  >
                    <span>Topology</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-[#FAF0F0] border border-[#E8BABA]">
                    <span className="text-[#25352D] font-medium">payments-service</span>
                    <span className="text-[#C94F4F] font-bold">CRITICAL (28% err)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#FCF6ED] border border-[#E8D3B6]">
                    <span className="text-[#25352D] font-medium">database-cluster</span>
                    <span className="text-[#C58B43]">DEGRADED (98% pool)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                    <span className="text-[#25352D]">api-gateway</span>
                    <span className="text-[#C58B43]">WARN (420ms p95)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                    <span className="text-[#25352D]">auth-service</span>
                    <span className="text-[#267B5B]">HEALTHY (45ms)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
                    <span className="text-[#25352D]">order-processor</span>
                    <span className="text-[#267B5B]">HEALTHY (82ms)</span>
                  </div>
                </div>
              </div>

              {/* Memory Grounding Callout */}
              <div className="rounded-xl bg-[#EAF2EC] border border-[#BFD8C6] p-5">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#194B38] font-bold uppercase mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#267B5B]" />
                  <span>Memory Grounding</span>
                </div>
                <p className="text-xs text-[#25352D] leading-relaxed mb-3 font-sans">
                  Active outage <strong>INC-2024-142</strong> matches historical record <strong>INC-2024-089</strong> with 96% confidence.
                </p>
                <Link
                  href="/theatre"
                  className="w-full py-2 rounded bg-[#FFFFFF] border border-[#BFD8C6] text-[#267B5B] text-xs font-mono font-medium flex items-center justify-center gap-1.5 shadow-subtle hover:bg-[#F8F7F2] transition-colors"
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
