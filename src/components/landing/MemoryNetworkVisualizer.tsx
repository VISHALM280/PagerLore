"use client";

import React, { useEffect, useRef } from "react";
import { animate } from "animejs";

interface MemoryNode {
  id: string;
  label: string;
  service: string;
  x: number;
  y: number;
  type: "verified" | "historical" | "active";
}

export function MemoryNetworkVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const nodes: MemoryNode[] = [
    { id: "n1", label: "INC-089", service: "payments", x: 190, y: 110, type: "verified" },
    { id: "n2", label: "HikariCP:540s", service: "db-proxy", x: 310, y: 90, type: "verified" },
    { id: "n3", label: "pgBouncer:10m", service: "infra", x: 350, y: 210, type: "historical" },
    { id: "n4", label: "INC-142", service: "checkout", x: 130, y: 240, type: "active" },
    { id: "n5", label: "INC-118", service: "auth-redis", x: 230, y: 310, type: "historical" },
    { id: "n6", label: "TTL Jitter 15%", service: "cache", x: 90, y: 360, type: "verified" },
    { id: "n7", label: "Kafka:600s", service: "orders", x: 340, y: 350, type: "historical" },
  ];

  const connections = [
    { from: "n1", to: "n2" },
    { from: "n2", to: "n3" },
    { from: "n1", to: "n4" },
    { from: "n4", to: "n5" },
    { from: "n5", to: "n6" },
    { from: "n3", to: "n7" },
    { from: "n5", to: "n7" },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Anime.js v4 line animation
    const lines = svgRef.current.querySelectorAll("line");
    animate(lines, {
      opacity: [0, 0.75],
      duration: 1200,
      ease: "outQuad",
    });

    // Node staggered entrance
    const nodeGroups = svgRef.current.querySelectorAll(".memory-node");
    animate(nodeGroups, {
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 800,
      ease: "outBack",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg aspect-[4/3] rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-6 shadow-editorial overflow-hidden flex flex-col justify-between"
    >
      {/* Top Bar inside visualizer */}
      <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#267B5B]" />
          <span className="text-[#25352D] font-semibold">pagerlore-production-bank</span>
        </div>
        <span className="text-[#788579] text-[11px]">7 Indexed Traces</span>
      </div>

      {/* SVG Connected Graph */}
      <div className="relative flex-1 py-2">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 440 400">
          {/* Connection Lines */}
          {connections.map((c, i) => {
            const start = nodes.find((n) => n.id === c.from);
            const end = nodes.find((n) => n.id === c.to);
            if (!start || !end) return null;

            const isMatchPath =
              (c.from === "n1" && c.to === "n4") || (c.from === "n1" && c.to === "n2");

            return (
              <line
                key={i}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={isMatchPath ? "#267B5B" : "#E0D5C3"}
                strokeWidth={isMatchPath ? 1.8 : 1}
                strokeDasharray={isMatchPath ? undefined : "3 3"}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isVerified = node.type === "verified";
            const isActive = node.type === "active";

            return (
              <g key={node.id} className="memory-node cursor-pointer">
                {/* Node Ring */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    fill="none"
                    stroke="#C94F4F"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    opacity={0.6}
                  />
                )}
                {/* Center Node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isVerified ? 12 : 9}
                  fill={isVerified ? "#267B5B" : isActive ? "#C94F4F" : "#B8A17A"}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isVerified ? 6 : 4}
                  fill="#FFFFFF"
                />

                {/* Text Labels */}
                <text
                  x={node.x}
                  y={node.y + 20}
                  textAnchor="middle"
                  fill="#25352D"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 31}
                  textAnchor="middle"
                  fill="#788579"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  {node.service}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E9E8DF] text-[10px] font-mono text-[#788579]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#267B5B]" />
          <span>Verified Resolution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B8A17A]" />
          <span>Historical Experience</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C94F4F]" />
          <span>Active Investigation</span>
        </div>
      </div>
    </div>
  );
}

