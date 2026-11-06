"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  AlertTriangle,
  BrainCircuit,
  Database,
  FileText,
  BarChart3,
  Tv,
  Settings,
  ArrowRight,
  X,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const staticActions = [
    { title: "Investigate Active Incident INC-2024-142", href: "/investigate?incident=INC-2024-142", icon: BrainCircuit, cat: "Action" },
    { title: "Memory ON vs OFF Benchmark", href: "/theatre", icon: Tv, cat: "Benchmark" },
    { title: "Memory Vault & Knowledge Graph", href: "/vault", icon: Database, cat: "Navigation" },
    { title: "Service Topology & Fault Propagation", href: "/topology", icon: BrainCircuit, cat: "Navigation" },
    { title: "Post-Mortem Synthesis Records", href: "/postmortems", icon: FileText, cat: "Navigation" },
    { title: "Incident Catalog & Signals", href: "/incidents", icon: AlertTriangle, cat: "Navigation" },
    { title: "SRE Analytics & MTTR", href: "/analytics", icon: BarChart3, cat: "Navigation" },
    { title: "System & Hindsight Settings", href: "/settings", icon: Settings, cat: "Settings" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = staticActions.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.cat.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/25 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E9E8DF] rounded-xl shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-[#E9E8DF]">
          <Search className="w-4 h-4 text-[#788579] mr-2.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            className="w-full bg-transparent py-3.5 text-xs text-[#25352D] placeholder-[#9A9C91] focus:outline-none font-sans"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded text-[#788579] hover:text-[#25352D]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#788579] font-mono">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2 rounded text-left hover:bg-[#F8F7F2] text-[#25352D] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-[#788579] group-hover:text-[#267B5B]" />
                    <span className="text-xs font-medium">{item.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F0E9] text-[#788579] border border-[#E9E8DF]">
                    {item.cat}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#E9E8DF] bg-[#F8F7F2] text-[10px] text-[#788579] font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
