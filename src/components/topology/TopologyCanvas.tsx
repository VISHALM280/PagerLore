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
      {/* SVG Topology Graph Canvas */}
      <div className="flex-1 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-5 relative overflow-hidden shadow-subtle min-h-[480px]">
        {/* Top Status */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#C94F4F]">
              <span className="w-2 h-2 rounded-full bg-[#C94F4F]" />
              Critical (SEV-1)
            </span>
            <span className="flex items-center gap-1.5 text-[#C58B43]">
              <span className="w-2 h-2 rounded-full bg-[#C58B43]" />
              Degraded
            </span>
            <span className="flex items-center gap-1.5 text-[#267B5B]">
              <span className="w-2 h-2 rounded-full bg-[#267B5B]" />
              Operational
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#788579]">
            Click node to inspect service health
          </span>
        </div>

        {/* SVG Infrastructure Graph */}
        <div className="w-full h-[430px] relative">
          <svg className="w-full h-full" viewBox="0 0 1000 480">
            {/* Edges */}
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
                      stroke={isCriticalPath ? "#C94F4F" : "#E0D5C3"}
                      strokeWidth={isCriticalPath ? 2 : 1.2}
                      strokeDasharray={isCriticalPath ? "4 4" : undefined}
                    />
                  </g>
                );
              })
            )}

            {/* Nodes */}
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
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={svc.x}
                      cy={svc.y}
                      r="28"
                      fill="none"
                      stroke="#267B5B"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Main Bubble */}
                  <circle
                    cx={svc.x}
                    cy={svc.y}
                    r="20"
                    fill={isCrit ? "#FAF0F0" : isWarn ? "#FCF6ED" : "#FFFFFF"}
                    stroke={
                      isCrit
                        ? "#C94F4F"
                        : isWarn
                        ? "#C58B43"
                        : isSelected
                        ? "#267B5B"
                        : "#BFD8C6"
                    }
                    strokeWidth={isSelected || isCrit ? 2 : 1.2}
                  />

                  {/* Center Dot */}
                  <circle
                    cx={svc.x}
                    cy={svc.y}
                    r="5"
                    fill={isCrit ? "#C94F4F" : isWarn ? "#C58B43" : "#267B5B"}
                  />

                  {/* Label */}
                  <text
                    x={svc.x}
                    y={svc.y + 34}
                    textAnchor="middle"
                    fill={isSelected ? "#267B5B" : "#25352D"}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {svc.name.split(" ")[0]}
                  </text>
                  <text
                    x={svc.x}
                    y={svc.y + 45}
                    textAnchor="middle"
                    fill="#788579"
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

      {/* Selected Node Inspector Panel */}
      <div className="w-full lg:w-80 rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 shadow-subtle flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3 mb-4">
            <div>
              <span className="text-[10px] font-mono text-[#788579] uppercase tracking-wider">
                Service Inspector
              </span>
              <h3 className="text-base font-bold text-[#25352D]">{current.name}</h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                current.status === "critical"
                  ? "bg-[#FAF0F0] text-[#C94F4F] border border-[#E8BABA]"
                  : current.status === "warning"
                  ? "bg-[#FCF6ED] text-[#C58B43] border border-[#E8D3B6]"
                  : "bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6]"
              }`}
            >
              {current.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
            <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px]">Error Rate</div>
              <div className={`text-base font-bold mt-0.5 ${current.errorRatePct > 5 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                {current.errorRatePct}%
              </div>
            </div>
            <div className="p-3 rounded bg-[#F8F7F2] border border-[#E9E8DF]">
              <div className="text-[#788579] text-[10px]">p95 Latency</div>
              <div className={`text-base font-bold mt-0.5 ${current.p95LatencyMs > 500 ? "text-[#C94F4F]" : "text-[#25352D]"}`}>
                {current.p95LatencyMs}ms
              </div>
            </div>
          </div>

          {current.activeIncidentId && (
            <div className="p-3 rounded bg-[#FAF0F0] border border-[#E8BABA] mb-5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#C94F4F] font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Impacted by {current.activeIncidentId}</span>
              </div>
              <p className="text-xs text-[#25352D] leading-snug font-sans">
                HikariCP connection pool exhaustion pinning database threads.
              </p>
              <Link
                href={`/investigate?incident=${current.activeIncidentId}`}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-mono text-[#267B5B] hover:underline"
              >
                <span>Investigate Incident</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E9E8DF]">
          <Link
            href={`/incidents?service=${current.id}`}
            className="w-full py-2 rounded bg-[#F8F7F2] hover:bg-[#F1F0E9] border border-[#E9E8DF] text-xs font-mono text-[#25352D] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Service Incident History</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
