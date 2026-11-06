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
      <div className="rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] p-5 text-center text-xs font-mono text-[#788579]">
        No historical memories queried (Operating in unassisted baseline mode).
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#267B5B]" />
          <h3 className="text-xs font-bold text-[#25352D] font-mono uppercase tracking-wider">
            Recalled Hindsight Memories ({memories.length})
          </h3>
        </div>
        <Link
          href="/vault"
          className="text-[11px] font-mono text-[#267B5B] hover:text-[#194B38] flex items-center gap-1 font-semibold group"
        >
          <span>Open Memory Vault</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-4 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] hover:border-[#267B5B]/40 hover:bg-white transition-all text-xs space-y-2.5 font-mono"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#194B38]">{mem.id}</span>
                {mem.source_incident_id && (
                  <Link
                    href={`/incidents/${mem.source_incident_id}`}
                    className="text-[10px] text-[#788579] hover:text-[#267B5B] underline"
                  >
                    src: {mem.source_incident_id}
                  </Link>
                )}
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/20 font-semibold text-[10px]">
                Relevance: {Math.round(mem.score * 100)}%
              </span>
            </div>

            <p className="text-[#25352D] font-sans leading-relaxed text-xs">
              {mem.text}
            </p>

            {mem.entities && mem.entities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="w-3 h-3 text-[#9A9C91]" />
                {mem.entities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white text-[#788579] border border-[#E9E8DF]"
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

