"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Server, Database, Key, Layers, Activity, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

interface ServiceNode {
  id: string;
  name: string;
  category: "gateway" | "service" | "datastore" | "queue";
  x: number;
  y: number;
  status: "healthy" | "critical" | "warning";
  rps: number;
  errorRatePct: number;
  p95LatencyMs: number;
  activeIncidentId?: string;
  connections: string[];
}

export function TopologyCanvas() {
  const [selectedService, setSelectedService] = useState<string>("payments-service");

  const services: ServiceNode[] = [
    {
      id: "api-gateway",
      name: "API Gateway (Envoy)",
      category: "gateway",
      x: 140,
      y: 220,
      status: "warning",
      rps: 1850,
      errorRatePct: 6.8,
      p95LatencyMs: 420,
      activeIncidentId: "INC-2024-142",
      connections: ["auth-service", "payments-service", "order-processor"],
    },
    {
      id: "auth-service",
      name: "Auth Service (Go)",
      category: "service",
      x: 380,
      y: 110,
      status: "healthy",
      rps: 1200,
      errorRatePct: 0.05,
      p95LatencyMs: 45,
      connections: ["redis-cache", "database-cluster"],
    },
    {
      id: "payments-service",
      name: "Payments Service (Java)",
      category: "service",
      x: 400,
      y: 240,
      status: "critical",
      rps: 420,
      errorRatePct: 28.4,
      p95LatencyMs: 2840,
      activeIncidentId: "INC-2024-142",
      connections: ["database-cluster"],
    },
    {
      id: "order-processor",
      name: "Order Fulfillment",
      category: "service",
      x: 390,
      y: 380,
      status: "healthy",
      rps: 650,
      errorRatePct: 0.1,
      p95LatencyMs: 82,
      connections: ["kafka-queue", "database-cluster"],
    },
    {
      id: "kafka-queue",
      name: "Kafka Event Bus",
      category: "queue",
      x: 640,
      y: 380,
      status: "healthy",
      rps: 920,
      errorRatePct: 0.0,
      p95LatencyMs: 14,
      connections: ["background-workers"],
    },
    {
      id: "redis-cache",
      name: "Redis Token Cache",
      category: "datastore",
      x: 640,
      y: 110,
      status: "healthy",
      rps: 2400,
      errorRatePct: 0.0,
      p95LatencyMs: 2.1,
      connections: [],
    },
    {
      id: "database-cluster",
      name: "PostgreSQL Primary + pgBouncer",
      category: "datastore",
      x: 680,
      y: 240,
      status: "warning",
      rps: 1480,
      errorRatePct: 18.2,
      p95LatencyMs: 1890,
      activeIncidentId: "INC-2024-142",
      connections: [],
    },
    {
      id: "background-workers",
      name: "Background Workers",
      category: "service",
      x: 880,
      y: 380,
      status: "healthy",
      rps: 310,
      errorRatePct: 0.0,
      p95LatencyMs: 110,
      connections: ["database-cluster"],
    },
  ];

  const current = services.find((s) => s.id === selectedService) || services[2];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Interactive Topology Graph Visualizer */}
      <div className="flex-1 rounded-2xl bg-[#090e18] border border-[#1c263c] p-4 relative overflow-hidden shadow-2xl min-h-[500px]">
        {/* Top Legend & Overlay Controls */}
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Critical (SEV-1)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Degraded
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Operational
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Click any service node to inspect propagation
          </span>
        </div>

        {/* SVG Infrastructure Graph */}
        <div className="w-full h-[460px] relative">
          <svg className="w-full h-full" viewBox="0 0 1000 500">
            <defs>
              <linearGradient id="critFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="normFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Service Connection Edges */}
            {services.map((src) =>
              src.connections.map((targetId) => {
                const target = services.find((s) => s.id === targetId);
                if (!target) return null;
                const isCriticalPath =
                  (src.id === "payments-service" && target.id === "database-cluster") ||
                  (src.id === "api-gateway" && target.id === "payments-service");

                return (
                  <g key={`${src.id}-${target.id}`}>
                    <path
                      d={`M ${src.x} ${src.y} C ${(src.x + target.x) / 2} ${src.y}, ${(src.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`}
                      fill="none"
                      stroke={isCriticalPath ? "#ef4444" : "#1e2e4a"}
                      strokeWidth={isCriticalPath ? 2.5 : 1.2}
                      strokeDasharray={isCriticalPath ? "4 4" : undefined}
                      className={isCriticalPath ? "animate-pulse" : ""}
                    />
                  </g>
                );
              })
            )}

            {/* Service Nodes */}
            {services.map((svc) => {
              const isSelected = svc.id === selectedService;
              const isCrit = svc.status === "critical";
              const isWarn = svc.status === "warning";

              return (
                <g
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className="cursor-pointer group"
                >
                  {/* Halo */}
                  {isCrit && (
                    <circle
                      cx={svc.x}
                      cy={svc.y}
                      r="36"
                      fill="#ef4444"
                      fillOpacity="0.15"
                      className="animate-ping"
                    />
                  )}
                  {isSelected && (
                    <circle
                      cx={svc.x}
                      cy={svc.y}
                      r="32"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Main Node Bubble */}
                  <circle
                    cx={svc.x}
                    cy={svc.y}
                    r="24"
                    fill={isCrit ? "#1f1015" : isWarn ? "#1e180d" : "#0d1424"}
                    stroke={
                      isCrit
                        ? "#ef4444"
                        : isWarn
                        ? "#f59e0b"
                        : isSelected
                        ? "#00f0ff"
                        : "#223354"
                    }
                    strokeWidth={isSelected || isCrit ? 2.5 : 1.5}
                    className="transition-all group-hover:scale-105"
                  />

                  {/* Center Dot */}
                  <circle
                    cx={svc.x}
                    cy={svc.y}
                    r="5"
                    fill={isCrit ? "#ef4444" : isWarn ? "#f59e0b" : "#38bdf8"}
                  />

                  {/* Node Label */}
                  <text
                    x={svc.x}
                    y={svc.y + 38}
                    textAnchor="middle"
                    fill={isSelected ? "#00f0ff" : "#cbd5e1"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {svc.name.split(" ")[0]}
                  </text>
                  <text
                    x={svc.x}
                    y={svc.y + 50}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {svc.p95LatencyMs}ms · {svc.errorRatePct}% err
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Detail Inspector */}
      <div className="w-full lg:w-96 rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#1c263c] pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Service Inspector
              </span>
              <h3 className="text-lg font-bold text-slate-100">{current.name}</h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                current.status === "critical"
                  ? "bg-red-950 text-red-400 border border-red-800"
                  : current.status === "warning"
                  ? "bg-amber-950 text-amber-400 border border-amber-800"
                  : "bg-emerald-950 text-emerald-400 border border-emerald-800"
              }`}
            >
              {current.status}
            </span>
          </div>

          {/* Metrics Panel */}
          <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1a253c]">
              <div className="text-slate-500 text-[10px]">Error Rate</div>
              <div
                className={`text-base font-bold mt-1 ${
                  current.errorRatePct > 5 ? "text-red-400" : "text-slate-200"
                }`}
              >
                {current.errorRatePct}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1a253c]">
              <div className="text-slate-500 text-[10px]">p95 Latency</div>
              <div
                className={`text-base font-bold mt-1 ${
                  current.p95LatencyMs > 500 ? "text-red-400" : "text-slate-200"
                }`}
              >
                {current.p95LatencyMs}ms
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1a253c]">
              <div className="text-slate-500 text-[10px]">Throughput</div>
              <div className="text-base font-bold text-slate-200 mt-1">
                {current.rps} rps
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1a253c]">
              <div className="text-slate-500 text-[10px]">Category</div>
              <div className="text-base font-bold text-cyan-300 mt-1 capitalize">
                {current.category}
              </div>
            </div>
          </div>

          {/* Active Incident Warning */}
          {current.activeIncidentId && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Impacted by {current.activeIncidentId}</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                HikariCP connection pool exhaustion pinning all 50 database worker threads.
              </p>
              <Link
                href={`/investigate?incident=${current.activeIncidentId}`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 underline"
              >
                <span>Launch AI Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Connected Downstreams */}
          <div>
            <div className="text-xs font-mono text-slate-400 mb-2">Downstream Dependencies:</div>
            <div className="space-y-1.5">
              {current.connections.length === 0 ? (
                <div className="text-xs text-slate-500 font-mono">No downstream connections.</div>
              ) : (
                current.connections.map((conn) => (
                  <div
                    key={conn}
                    className="p-2 rounded-lg bg-[#0e1524] border border-[#182338] text-xs font-mono text-slate-300 flex items-center justify-between"
                  >
                    <span>{conn}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1c263c] mt-6">
          <Link
            href={`/incidents?service=${current.id}`}
            className="w-full py-2.5 rounded-xl bg-[#12192c] hover:bg-[#1a243e] border border-cyan-800/40 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Service Incident History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
