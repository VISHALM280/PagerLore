"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import {
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Server,
  Key,
} from "lucide-react";

export default function SettingsPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/hindsight/status");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/hindsight/status");
      const data = await res.json();
      setStatus(data);
      if (data.connected) {
        setTestResult(
          data.is_demo_mode
            ? "Operating in Local DEMO MODE: In-memory bank healthy with realistic multi-path retrieval."
            : "Successfully reached remote Vectorize Hindsight API!"
        );
      } else {
        setTestResult(`Connection check: ${data.message}`);
      }
    } catch (err: any) {
      setTestResult(`Connection check failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleResetDemo = async () => {
    if (!confirm("Reset all incidents and memories back to the clean initial demo state?")) {
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      setResetMessage("Demo state successfully reset to initial seeded data.");
      await fetchStatus();
      setTimeout(() => setResetMessage(null), 3000);
    } catch (err: any) {
      setResetMessage(`Reset failed: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Settings className="w-4 h-4" />
              <span>SYSTEM CONFIGURATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Platform & Hindsight Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure remote Vectorize Hindsight API connectivity, verify credentials, and manage demo state.
            </p>
          </div>

          {/* Hindsight Connection Card */}
          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1c263c] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Hindsight Persistent Memory Service
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  status?.connected
                    ? status?.is_demo_mode
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700/60"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-700/60"
                    : "bg-red-950 text-red-300 border border-red-700/60"
                }`}
              >
                {status?.is_demo_mode ? "LOCAL DEMO MODE" : "CONNECTED (LIVE)"}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1e2d4a]">
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">Target Memory Bank</span>
                  <div className="text-cyan-300 font-bold">{status?.bank_id || "pagerlore-production-bank"}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0e1524] border border-[#1e2d4a]">
                  <span className="text-slate-500 uppercase text-[10px] block mb-1">API Endpoint</span>
                  <div className="text-slate-300 font-bold truncate">{status?.api_url || "https://api.hindsight.vectorize.io"}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#162136] text-slate-300 font-sans leading-relaxed">
                <div className="font-mono text-[10px] text-cyan-400 uppercase font-semibold mb-1">
                  Active Mode Information
                </div>
                {status?.message || "Operating with persistent memory bank."}
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs">
                  {testResult}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Environment variables: HINDSIGHT_API_KEY, HINDSIGHT_API_URL, HINDSIGHT_BANK_ID
                </span>

                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 rounded-xl bg-[#121a2c] hover:bg-[#18233a] border border-cyan-800/50 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin text-cyan-400" : ""}`} />
                  <span>{testing ? "Testing..." : "Test Health & Ping"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Demo Reset Card for Judges & Reviewers */}
          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1c263c] pb-3">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Demo Environment Management
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Need to repeat the evaluation or video recording from the start? Resetting the demo reinstates active SEV-1 incident <strong className="text-red-400 font-mono">INC-2024-142</strong>, restores all 5 high-fidelity historical memories in the vault, and cleans temporary modifications.
            </p>

            {resetMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
                ✓ {resetMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleResetDemo}
                disabled={resetting}
                className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
                <span>{resetting ? "Resetting Environment..." : "Reset Demo to Clean Seeded State"}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
