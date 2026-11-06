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
    { title: "Memory ON vs OFF Demo Theatre", href: "/theatre", icon: Tv, cat: "Signature Demo" },
    { title: "Inspect Memory Vault (Hindsight)", href: "/vault", icon: Database, cat: "Navigation" },
    { title: "View Service Topology Graph", href: "/topology", icon: BrainCircuit, cat: "Navigation" },
    { title: "View Post-Mortem Records", href: "/postmortems", icon: FileText, cat: "Navigation" },
    { title: "Incident History & Catalog", href: "/incidents", icon: AlertTriangle, cat: "Navigation" },
    { title: "SRE Analytics & MTTR", href: "/analytics", icon: BarChart3, cat: "Navigation" },
    { title: "Hindsight API & System Settings", href: "/settings", icon: Settings, cat: "Settings" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open parent handler
        }
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0d1322] border border-[#1e2d4a] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#1c263c]">
          <Search className="w-4 h-4 text-cyan-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, incident ID, or jump to route..."
            className="w-full bg-transparent py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or incidents found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#151f36] text-slate-300 hover:text-cyan-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                    <span className="text-xs font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#090e18] text-slate-400 border border-slate-800">
                      {item.cat}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1c263c] bg-[#090e18] text-[11px] text-slate-500 font-mono">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
