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
    { name: "Timeout / Proxy Asymmetry", value: 45, color: "#267B5B" },
    { name: "Cache Thundering Herd", value: 25, color: "#B8A17A" },
    { name: "GC & Consumer Lag", value: 20, color: "#C58B43" },
    { name: "Network Partition", value: 10, color: "#788579" },
  ];

  const memoryGrowthData = [
    { month: "Aug", memories: 2 },
    { month: "Sep", memories: 3 },
    { month: "Oct", memories: 4 },
    { month: "Today", memories: 5 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1 font-semibold">
                <BarChart3 className="w-4 h-4" />
                <span>SRE ANALYTICS & INSTITUTIONAL METRICS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Reliability & Memory Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
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
                      ? "bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30 font-semibold"
                      : "bg-white text-[#788579] border border-[#E9E8DF] hover:text-[#25352D]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E9E8DF] shadow-sm">
              <span className="text-xs font-mono text-[#788579] uppercase font-semibold">Mean Time to Resolution</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-[#25352D] font-mono">{data?.metrics?.mttr_minutes || 26}m</span>
                <span className="text-xs font-mono text-[#267B5B] flex items-center font-semibold">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -68%
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#9A9C91] mt-1 block">
                vs. 84m unassisted historical average
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E9E8DF] shadow-sm">
              <span className="text-xs font-mono text-[#788579] uppercase font-semibold">Recurrence Mitigation</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-[#267B5B] font-mono">
                  {data?.metrics?.recurrence_mitigation_score_pct || 88}%
                </span>
                <span className="text-xs font-mono text-[#267B5B] font-semibold">Coverage</span>
              </div>
              <span className="text-[11px] font-mono text-[#9A9C91] mt-1 block">
                Outages mapped to existing memory rules
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E9E8DF] shadow-sm">
              <span className="text-xs font-mono text-[#788579] uppercase font-semibold">Hindsight Memory Growth</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-[#25352D] font-mono">
                  {data?.metrics?.retained_memories_count || 5}
                </span>
                <span className="text-xs font-mono text-[#267B5B] flex items-center font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +100%
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#9A9C91] mt-1 block">
                Active in bank pagerlore-production
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E9E8DF] shadow-sm">
              <span className="text-xs font-mono text-[#788579] uppercase font-semibold">Post-Mortem Synthesis Rate</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-[#267B5B] font-mono">
                  {data?.metrics?.postmortem_completion_pct || 100}%
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#9A9C91] mt-1 block">
                All resolved incidents retained in vault
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MTTR Reduction Chart */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
                  MTTR Trajectory: Memory-Assisted vs Baseline
                </h3>
                <span className="text-[10px] font-mono text-[#788579]">Minutes to Resolve</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mttrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9E8DF" />
                    <XAxis dataKey="period" stroke="#788579" fontSize={11} fontFamily="monospace" />
                    <YAxis stroke="#788579" fontSize={11} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E9E8DF", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: "#25352D" }}
                    />
                    <Bar dataKey="unassisted" name="Unassisted Baseline (m)" fill="#B8A17A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withMemory" name="With PagerLore (m)" fill="#267B5B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Root Cause Distribution */}
            <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
                <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
                  Root Cause Classification Breakdown
                </h3>
                <span className="text-[10px] font-mono text-[#788579]">Categorized by Hindsight</span>
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
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E9E8DF", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: "#25352D" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#788579]">
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

