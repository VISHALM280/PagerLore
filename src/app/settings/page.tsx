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
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1 font-semibold">
              <Settings className="w-4 h-4" />
              <span>SYSTEM CONFIGURATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
              Platform & Hindsight Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#788579] mt-1">
              Configure remote Vectorize Hindsight API connectivity, verify credentials, and manage demo state.
            </p>
          </div>

          {/* Hindsight Connection Card */}
          <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#E9E8DF] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#267B5B]" />
                <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                  Hindsight Persistent Memory Service
                </h3>
              </div>
              <span
                className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase ${
                  status?.connected
                    ? status?.is_demo_mode
                      ? "bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30"
                      : "bg-[#EAF2EC] text-[#267B5B] border border-[#267B5B]/30"
                    : "bg-[#FDF2F2] text-[#C94F4F] border border-[#C94F4F]/30"
                }`}
              >
                {status?.is_demo_mode ? "LOCAL DEMO MODE" : "CONNECTED (LIVE)"}
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <span className="text-[#788579] uppercase text-[10px] block mb-1">Target Memory Bank</span>
                  <div className="text-[#267B5B] font-bold">{status?.bank_id || "pagerlore-production-bank"}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF]">
                  <span className="text-[#788579] uppercase text-[10px] block mb-1">API Endpoint</span>
                  <div className="text-[#25352D] font-bold truncate">{status?.api_url || "https://api.hindsight.vectorize.io"}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E9E8DF] text-[#25352D] font-sans leading-relaxed">
                <div className="font-mono text-[10px] text-[#267B5B] uppercase font-semibold mb-1">
                  Active Mode Information
                </div>
                {status?.message || "Operating with persistent memory bank."}
              </div>

              {testResult && (
                <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 text-[#194B38] text-xs">
                  {testResult}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#788579]">
                  Environment variables: HINDSIGHT_API_KEY, HINDSIGHT_API_URL, HINDSIGHT_BANK_ID
                </span>

                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 rounded-xl bg-[#267B5B] hover:bg-[#194B38] text-white text-xs font-mono font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin text-white" : ""}`} />
                  <span>{testing ? "Testing..." : "Test Health & Ping"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Demo Reset Card for Judges & Reviewers */}
          <div className="rounded-2xl bg-white border border-[#E9E8DF] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E9E8DF] pb-3">
              <RotateCcw className="w-4 h-4 text-[#C58B43]" />
              <h3 className="text-sm font-bold text-[#25352D] font-mono uppercase tracking-wider">
                Demo Environment Management
              </h3>
            </div>

            <p className="text-xs text-[#788579] leading-relaxed font-sans">
              Need to repeat the evaluation or video recording from the start? Resetting the demo reinstates active SEV-1 incident <strong className="text-[#C94F4F] font-mono">INC-2024-142</strong>, restores all 5 high-fidelity historical memories in the vault, and cleans temporary modifications.
            </p>

            {resetMessage && (
              <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#267B5B]/30 text-[#194B38] text-xs font-mono">
                ✓ {resetMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleResetDemo}
                disabled={resetting}
                className="px-5 py-2.5 rounded-xl bg-[#FDF8F0] hover:bg-[#F8EFE3] border border-[#C58B43]/40 text-[#C58B43] text-xs font-mono font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
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

