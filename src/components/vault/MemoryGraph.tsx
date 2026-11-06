"use client";

import React, { useState } from "react";
import { RecallResult } from "@/lib/hindsight/types";
import { Database, Link2, Sparkles, Tag, ArrowRight } from "lucide-react";

interface MemoryGraphProps {
  memories: RecallResult[];
  onSelectMemory: (mem: RecallResult) => void;
  selectedMemoryId?: string;
}

export function MemoryGraph({ memories, onSelectMemory, selectedMemoryId }: MemoryGraphProps) {
  // Graph visual representation: service cluster nodes connected to memory nodes
  const nodes = memories.map((mem, idx) => {
    const angle = (idx / memories.length) * 2 * Math.PI;
    const radius = 140;
    const cx = 250 + Math.cos(angle) * radius;
    const cy = 180 + Math.sin(angle) * radius;
    return {
      ...mem,
      cx,
      cy,
    };
  });

  return (
    <div className="rounded-2xl bg-[#080d17] border border-[#1c263c] p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1c263c] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            Hindsight Memory Knowledge Graph
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          {memories.length} Retained Incident Nodes · Click to inspect provenance
        </span>
      </div>

      <div className="w-full h-[360px] relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 500 360">
          {/* Central Hindsight Bank Node */}
          <circle cx="250" cy="180" r="38" fill="#0d182b" stroke="#00f0ff" strokeWidth="2" className="shadow-[0_0_20px_#00f0ff]" />
          <circle cx="250" cy="180" r="48" fill="none" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" className="animate-spin" />
          <text x="250" y="176" textAnchor="middle" fill="#00f0ff" fontSize="9" fontFamily="monospace" fontWeight="bold">
            HINDSIGHT
          </text>
          <text x="250" y="190" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            BANK
          </text>

          {/* Connection Lines from Center to Memory Nodes */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedMemoryId;
            return (
              <g key={`edge-${node.id}`}>
                <line
                  x1="250"
                  y1="180"
                  x2={node.cx}
                  y2={node.cy}
                  stroke={isSelected ? "#00f0ff" : "#1e2e4a"}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={node.type === "experience" ? undefined : "2 2"}
                />
              </g>
            );
          })}

          {/* Memory Nodes */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedMemoryId;
            return (
              <g
                key={node.id}
                onClick={() => onSelectMemory(node)}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="24"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="18"
                  fill={
                    node.type === "experience"
                      ? "#122036"
                      : node.type === "observation"
                      ? "#1e1728"
                      : "#11261d"
                  }
                  stroke={
                    isSelected
                      ? "#00f0ff"
                      : node.type === "experience"
                      ? "#38bdf8"
                      : node.type === "observation"
                      ? "#a855f7"
                      : "#10b981"
                  }
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-transform group-hover:scale-110"
                />
                <text
                  x={node.cx}
                  y={node.cy + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.source_incident_id ? node.source_incident_id.replace("INC-2024-", "#") : "MEM"}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 30}
                  textAnchor="middle"
                  fill={isSelected ? "#00f0ff" : "#94a3b8"}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {node.service || "core"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#162136] text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Experience (Post-Mortem Resolution)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Observation (Diagnostic Behavior)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>World (Architectural Standard)</span>
        </span>
      </div>
    </div>
  );
}
