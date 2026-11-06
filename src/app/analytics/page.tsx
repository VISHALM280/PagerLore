"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Clock,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AnalyticsPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const mttrData = [
    { period: "Week 1", unassisted: 94, withMemory: 82 },
    { period: "Week 2", unassisted: 88, withMemory: 64 },
    { period: "Week 3", unassisted: 102, withMemory: 38 },
    { period: "Week 4", unassisted: 92, withMemory: 26 },
  ];

  const rootCauseDistribution = [
    { name: "Timeout / Proxy Asymmetry", value: 45, color: "#00f0ff" },
    { name: "Cache Thundering Herd", value: 25, color: "#38bdf8" },
    { name: "GC & Consumer Lag", value: 20, color: "#a855f7" },
    { name: "Network Partition", value: 10, color: "#64748b" },
  ];

  const memoryGrowthData = [
    { month: "Aug", memories: 2 },
    { month: "Sep", memories: 3 },
    { month: "Oct", memories: 4 },
    { month: "Today", memories: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>SRE ANALYTICS & INSTITUTIONAL METRICS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Reliability & Memory Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Measured impact of persistent incident memory on MTTR, recurrence rates, and operational knowledge retention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {["24h", "7d", "30d", "90d", "all"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors uppercase ${
                    timeRange === r
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold"
                      : "bg-[#0e1524] text-slate-400 border border-[#1e2d4a] hover:text-slate-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#090e18] border border-[#1c263c]">
              <span className="text-xs font-mono text-slate-400 uppercase">Mean Time to Resolution</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-white font-mono">{data?.metrics?.mttr_minutes || 26}m</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -68%
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                vs. 84m unassisted historical average
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e18] border border-[#1c263c]">
              <span className="text-xs font-mono text-slate-400 uppercase">Recurrence Mitigation</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-cyan-300 font-mono">
                  {data?.metrics?.recurrence_mitigation_score_pct || 88}%
                </span>
                <span className="text-xs font-mono text-cyan-400">Coverage</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                Outages mapped to existing memory rules
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e18] border border-[#1c263c]">
              <span className="text-xs font-mono text-slate-400 uppercase">Hindsight Memory Growth</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-white font-mono">
                  {data?.metrics?.retained_memories_count || 5}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +100%
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                Active in bank pagerlore-production
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#090e18] border border-[#1c263c]">
              <span className="text-xs font-mono text-slate-400 uppercase">Post-Mortem Synthesis Rate</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-emerald-400 font-mono">
                  {data?.metrics?.postmortem_completion_pct || 100}%
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                All resolved incidents retained in vault
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MTTR Reduction Chart */}
            <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
                <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
                  MTTR Trajectory: Memory-Assisted vs Baseline
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Minutes to Resolve</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mttrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#162136" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                    <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b1220", borderColor: "#1e2d4a", fontSize: "12px", fontFamily: "monospace" }}
                    />
                    <Bar dataKey="unassisted" name="Unassisted Baseline (m)" fill="#334155" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withMemory" name="With PagerLore (m)" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Root Cause Distribution */}
            <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
                <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
                  Root Cause Classification Breakdown
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Categorized by Hindsight</span>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rootCauseDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {rootCauseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b1220", borderColor: "#1e2d4a", fontSize: "12px", fontFamily: "monospace" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
                {rootCauseDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
