"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Database,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { JudgeDemoGuide } from "../common/JudgeDemoGuide";

interface AppHeaderProps {
  onOpenCommandPalette?: () => void;
}

export function AppHeader({ onOpenCommandPalette }: AppHeaderProps) {
  const [env, setEnv] = useState("production");
  const [bankStatus, setBankStatus] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [showJudgeTour, setShowJudgeTour] = useState(false);

  useEffect(() => {
    fetch("/api/hindsight/status")
      .then((res) => res.json())
      .then((data) => setBankStatus(data))
      .catch(() => {});
  }, []);

  const handleResetDemo = async () => {
    if (confirm("Reset demo data while preserving newly retained Hindsight memories?")) {
      setIsResetting(true);
      try {
        await fetch("/api/demo/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preserveRetainedMemories: true }),
        });
        setResetNotice("Demo environment reset (memories preserved).");
        setTimeout(() => {
          setResetNotice(null);
          window.location.reload();
        }, 600);
      } catch (err) {
        console.error(err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <>
      <JudgeDemoGuide isOpen={showJudgeTour} onClose={() => setShowJudgeTour(false)} />
      <header className="h-14 border-b border-[#E9E8DF] bg-[#FFFFFF] px-6 flex items-center justify-between z-30 sticky top-0">
        {/* Left: Organization & Environment */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25352D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />
            <span>Core Infrastructure</span>
          </div>

          <span className="text-[#D9D7CB]">/</span>

          <button
            onClick={() => setShowJudgeTour(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6] hover:bg-[#267B5B] hover:text-white transition-all shadow-xs"
            title="Open Judge Tour Guide (3-5 min evaluation flow)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Judge Demo Tour (3–5m)</span>
          </button>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reset seeded demo state while keeping retained memories"
            className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded bg-[#F8F7F2] border border-[#E9E8DF] hover:border-[#267B5B]/50 text-[#788579] hover:text-[#25352D] transition-colors"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? "animate-spin text-[#267B5B]" : ""}`} />
            <span>Reset Demo</span>
          </button>

          {resetNotice && (
            <span className="text-xs text-[#267B5B] font-mono">
              ✓ {resetNotice}
            </span>
          )}
        </div>

      {/* Center: Global Search & Command Palette trigger */}
      <div className="flex-1 max-w-sm mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-[#F8F7F2] border border-[#E9E8DF] text-[#788579] text-xs hover:border-[#BFBCAD] hover:text-[#25352D] transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#9A9C91]" />
            <span>Search incidents, memories, services...</span>
          </div>
          <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-[#FFFFFF] text-[#788579] rounded border border-[#E9E8DF]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Hindsight Status + Alerts + Profile */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/vault"
          title="Inspect Hindsight Memory Bank"
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#EAF2EC] border border-[#BFD8C6] text-xs font-mono text-[#194B38] hover:bg-[#D9E8DD] transition-colors"
        >
          <Database className="w-3 h-3 text-[#267B5B]" />
          <span className="hidden sm:inline">Bank:</span>
          <span className="font-semibold truncate max-w-[120px]">
            {bankStatus?.bank_id || "production-bank"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded bg-[#FFFFFF] border border-[#E9E8DF] text-[#788579] hover:text-[#25352D]"
            aria-label="View notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#E9E8DF] rounded-xl shadow-elevated p-4 z-50">
              <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-2 mb-3">
                <span className="text-xs font-semibold text-[#25352D] uppercase font-mono tracking-wider">
                  Active Alerts
                </span>
                <span className="text-[10px] font-mono text-[#C94F4F] bg-[#FAF0F0] px-1.5 py-0.5 rounded border border-[#E8BABA]">
                  1 Critical
                </span>
              </div>
              <Link
                href="/incidents/INC-2024-142"
                onClick={() => setShowNotifications(false)}
                className="block p-2.5 rounded bg-[#FAF0F0] border border-[#E8BABA] hover:bg-[#F5E6E6] transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#C94F4F] mb-1 font-semibold">
                  <span>SEV-1 ACTIVE</span>
                  <span>14m ago</span>
                </div>
                <p className="text-xs text-[#25352D] font-medium line-clamp-2">
                  Payments Service 500 Internal Server Errors & Latency Surge following v2.8.1
                </p>
              </Link>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-2 border-l border-[#E9E8DF]"
        >
          <div className="w-6 h-6 rounded-full bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6] flex items-center justify-center font-bold text-[10px] font-mono">
            MV
          </div>
          <span className="text-xs font-medium text-[#25352D] hidden lg:inline">
            Marcus Vance
          </span>
        </Link>
      </div>
    </header>
    </>
  );
}
