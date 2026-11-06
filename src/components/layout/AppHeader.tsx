"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Database,
  ShieldAlert,
  Server,
  Terminal,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface AppHeaderProps {
  onOpenCommandPalette?: () => void;
}

export function AppHeader({ onOpenCommandPalette }: AppHeaderProps) {
  const [env, setEnv] = useState("production");
  const [bankStatus, setBankStatus] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hindsight/status")
      .then((res) => res.json())
      .then((data) => setBankStatus(data))
      .catch(() => {});
  }, []);

  const handleResetDemo = async () => {
    if (confirm("Reset PagerLore demo data to clean initial state (active SEV-1 incident INC-2024-142)?")) {
      setIsResetting(true);
      try {
        const res = await fetch("/api/demo/reset", { method: "POST" });
        const data = await res.json();
        setResetNotice("Demo environment reset to clean seeded state.");
        setTimeout(() => {
          setResetNotice(null);
          window.location.reload();
        }, 800);
      } catch (err) {
        console.error(err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <header className="h-16 border-b border-[#1c263c] bg-[#090d16]/90 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Organization & Environment Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Acme SRE Core
          </span>
        </div>

        <span className="text-slate-700">/</span>

        {/* Environment Selector */}
        <div className="relative">
          <select
            value={env}
            onChange={(e) => setEnv(e.target.value)}
            className="appearance-none bg-[#0e1524] text-xs font-mono text-cyan-300 border border-[#1e2d4a] rounded-md px-3 py-1.5 pr-7 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="production">env: production (us-east-1)</option>
            <option value="staging">env: staging (us-west-2)</option>
            <option value="eu-central">env: eu-central-1</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Reset Demo button for judges / testers */}
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          title="Reset seeded demo state (re-triggers INC-142)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-700/70 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <RotateCcw className={`w-3 h-3 ${isResetting ? "animate-spin text-cyan-400" : ""}`} />
          <span>Reset Demo</span>
        </button>

        {resetNotice && (
          <span className="text-xs text-emerald-400 font-mono animate-fade-in">
            ✓ {resetNotice}
          </span>
        )}
      </div>

      {/* Center: Global Search & Command Palette trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-[#0e1524] border border-[#1c263c] text-slate-400 text-xs hover:border-slate-700 hover:text-slate-200 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search incidents, services, memories, runbooks...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#162035] text-slate-400 rounded border border-[#223150]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Hindsight Bank Status + Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Hindsight Bank Status Indicator */}
        <Link
          href="/vault"
          title="Inspect Hindsight Memory Bank"
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0d1627] border border-[#1e2f50] hover:border-cyan-500/60 transition-all text-xs font-mono"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 hidden sm:inline">Bank:</span>
          <span className="text-cyan-300 font-medium truncate max-w-[140px]">
            {bankStatus?.bank_id || "pagerlore-production-bank"}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              bankStatus?.connected
                ? bankStatus?.is_demo_mode
                  ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                  : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                : "bg-amber-400"
            }`}
          />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-[#0e1524] border border-[#1c263c] text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1322] border border-[#1c263c] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-[#1c263c] pb-2 mb-3">
                <span className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
                  Live SRE Alerts
                </span>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50">
                  1 Critical
                </span>
              </div>
              <div className="space-y-2.5">
                <Link
                  href="/incidents/INC-2024-142"
                  onClick={() => setShowNotifications(false)}
                  className="block p-2.5 rounded-lg bg-[#141d33] hover:bg-[#1a2542] border border-red-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-red-400 mb-1">
                    <span>SEV-1 ACTIVE</span>
                    <span>14m ago</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2">
                    Payments Service 500 Internal Server Errors & Latency Surge following v2.8.1
                  </p>
                </Link>

                <div className="p-2 rounded bg-[#090e18] border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-mono">Hindsight Engine:</span> 4 historical
                  resolution patterns indexed in vault.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 pl-2 border-l border-[#1c263c] group"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Marcus Vance"
            className="w-7 h-7 rounded-full object-cover border border-cyan-500/50 group-hover:border-cyan-400 transition-colors"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 leading-tight">
              Marcus Vance
            </span>
            <span className="text-[10px] font-mono text-slate-400 leading-tight">
              Lead SRE
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
