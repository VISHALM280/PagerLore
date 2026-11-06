"use client";

import React from "react";
import Link from "next/link";
import { Database, ExternalLink, Sparkles, Tag, ShieldCheck } from "lucide-react";

interface MemoryCitationViewerProps {
  memories: Array<{
    id: string;
    text: string;
    source_incident_id?: string;
    score: number;
    entities: string[];
  }>;
}

export function MemoryCitationViewer({ memories }: MemoryCitationViewerProps) {
  if (!memories || memories.length === 0) {
    return (
      <div className="rounded-xl bg-[#080d17] border border-[#1c263c] p-5 text-center text-xs font-mono text-slate-500">
        No historical memories queried (Operating in unassisted baseline mode).
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#080d17] border border-cyan-950/80 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            Recalled Hindsight Memories ({memories.length})
          </h3>
        </div>
        <Link
          href="/vault"
          className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
        >
          <span>Open Memory Vault</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 rounded-xl bg-[#0d1424] border border-[#1e2d4a] hover:border-cyan-500/50 transition-colors text-xs space-y-2.5 font-mono"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300">{mem.id}</span>
                {mem.source_incident_id && (
                  <Link
                    href={`/incidents/${mem.source_incident_id}`}
                    className="text-[10px] text-slate-400 hover:text-cyan-300 underline"
                  >
                    src: {mem.source_incident_id}
                  </Link>
                )}
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold text-[10px]">
                Relevance: {Math.round(mem.score * 100)}%
              </span>
            </div>

            <p className="text-slate-200 font-sans leading-relaxed text-xs">
              {mem.text}
            </p>

            {mem.entities && mem.entities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="w-3 h-3 text-slate-500" />
                {mem.entities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.2 rounded bg-[#070b14] text-slate-400 border border-slate-800"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
