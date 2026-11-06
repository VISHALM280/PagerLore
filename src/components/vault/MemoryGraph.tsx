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
    <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#267B5B]" />
          <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
            Hindsight Memory Knowledge Graph
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#788579]">
          {memories.length} Retained Incident Nodes · Click to inspect provenance
        </span>
      </div>

      <div className="w-full h-[360px] relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 500 360">
          {/* Central Hindsight Bank Node */}
          <circle cx="250" cy="180" r="38" fill="#EAF2EC" stroke="#267B5B" strokeWidth="2" />
          <circle cx="250" cy="180" r="48" fill="none" stroke="#267B5B" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <text x="250" y="176" textAnchor="middle" fill="#194B38" fontSize="9" fontFamily="monospace" fontWeight="bold">
            HINDSIGHT
          </text>
          <text x="250" y="190" textAnchor="middle" fill="#788579" fontSize="8" fontFamily="monospace">
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
                  stroke={isSelected ? "#267B5B" : "#E9E8DF"}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeDasharray={node.type === "experience" ? undefined : "3 3"}
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
                    stroke="#267B5B"
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
                      ? "#EAF2EC"
                      : node.type === "observation"
                      ? "#FBF7EE"
                      : "#F1F0E9"
                  }
                  stroke={
                    isSelected
                      ? "#267B5B"
                      : node.type === "experience"
                      ? "#267B5B"
                      : node.type === "observation"
                      ? "#B8A17A"
                      : "#788579"
                  }
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-transform group-hover:scale-110"
                />
                <text
                  x={node.cx}
                  y={node.cy + 3}
                  textAnchor="middle"
                  fill="#25352D"
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
                  fill={isSelected ? "#267B5B" : "#788579"}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {node.service || "core"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#E9E8DF] text-[11px] font-mono text-[#788579]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#267B5B]" />
          <span>Experience (Post-Mortem Resolution)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8A17A]" />
          <span>Observation (Diagnostic Behavior)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#788579]" />
          <span>World (Architectural Standard)</span>
        </span>
      </div>
    </div>
  );
}

