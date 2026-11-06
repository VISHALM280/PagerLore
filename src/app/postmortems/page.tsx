"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Incident, PostMortem } from "@/lib/types/incident";
import {
  FileText,
  Database,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  AlertTriangle,
  ShieldCheck,
  Plus,
} from "lucide-react";

function PostMortemsContent() {
  const searchParams = useSearchParams();
  const preselectedIncident = searchParams.get("incident");

  const [cmdOpen, setCmdOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retentionSuccess, setRetentionSuccess] = useState<any>(null);

  // Form Fields
  const [summary, setSummary] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [detectionMethod, setDetectionMethod] = useState("Synthetic latency alert");
  const [actionsTaken, setActionsTaken] = useState("");
  const [successfulActions, setSuccessfulActions] = useState("");
  const [failedAttempts, setFailedAttempts] = useState("");
  const [finalResolution, setFinalResolution] = useState("");
  const [businessImpact, setBusinessImpact] = useState("");
  const [preventiveMeasures, setPreventiveMeasures] = useState("");

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        const incs = data.incidents || [];
        setIncidents(incs);
        const target = preselectedIncident || incs[0]?.id || "";
        setSelectedIncidentId(target);

        // Prepopulate if exists
        const found = incs.find((i: Incident) => i.id === target);
        if (found && found.postmortem) {
          populateForm(found.postmortem);
        }
      });
  }, [preselectedIncident]);

  const populateForm = (pm: PostMortem) => {
    setSummary(pm.summary);
    setRootCause(pm.root_cause);
    setDetectionMethod(pm.detection_method);
    setActionsTaken(pm.actions_taken.join("\n"));
    setSuccessfulActions(pm.successful_actions.join("\n"));
    setFailedAttempts(pm.failed_attempts.join("\n"));
    setFinalResolution(pm.final_resolution);
    setBusinessImpact(pm.business_impact);
    setPreventiveMeasures(pm.preventive_measures.join("\n"));
  };

  const handleIncidentChange = (id: string) => {
    setSelectedIncidentId(id);
    setRetentionSuccess(null);
    const found = incidents.find((i) => i.id === id);
    if (found && found.postmortem) {
      populateForm(found.postmortem);
    } else {
      // Clear or set smart defaults
      setSummary(`Outage report for ${id} on service ${found?.affected_service || "system"}`);
      setRootCause("");
      setActionsTaken("");
      setSuccessfulActions("");
      setFailedAttempts("");
      setFinalResolution("");
      setBusinessImpact("");
      setPreventiveMeasures("");
    }
  };

  const handleSubmitPostMortem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause.trim() || !finalResolution.trim()) return;

    setIsSubmitting(true);
    setRetentionSuccess(null);

    const currentIncident = incidents.find((i) => i.id === selectedIncidentId);

    const postMortemData: PostMortem = {
      incident_id: selectedIncidentId,
      summary: summary.trim(),
      root_cause: rootCause.trim(),
      detection_method: detectionMethod.trim(),
      timeline: [
        { timestamp: "T-0m", note: "Incident triggered" },
        { timestamp: "T-12m", note: "PagerLore Hindsight recall identified match" },
        { timestamp: "T-26m", note: "Resolution applied and verified" },
      ],
      actions_taken: actionsTaken.split("\n").filter((s) => s.trim().length > 0),
      successful_actions: successfulActions.split("\n").filter((s) => s.trim().length > 0),
      failed_attempts: failedAttempts.split("\n").filter((s) => s.trim().length > 0),
      final_resolution: finalResolution.trim(),
      mttr_minutes: currentIncident?.duration_minutes || 24,
      business_impact: businessImpact.trim(),
      preventive_measures: preventiveMeasures.split("\n").filter((s) => s.trim().length > 0),
      submitted_at: new Date().toISOString(),
      submitted_by: "Marcus Vance",
    };

    try {
      // Step 1: Retain verified post-mortem into Hindsight Memory Bank
      const retainContent = `Post-Mortem for ${selectedIncidentId} (${currentIncident?.affected_service}): Root cause: ${rootCause.trim()}. Final resolution: ${finalResolution.trim()}. Successful actions: ${successfulActions.trim()}. Preventive measures: ${preventiveMeasures.trim()}`;

      const retainRes = await fetch("/api/hindsight/retain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: retainContent,
          retain_mission: "Extract post-mortem root causes, diagnostic paths, and preventive engineering guardrails",
          metadata: {
            incidentId: selectedIncidentId,
            service: currentIncident?.affected_service,
            resolution: finalResolution.trim(),
            rootCause: rootCause.trim(),
            tags: ["post-mortem", currentIncident?.affected_service || "core"],
          },
        }),
      });
      const retainData = await retainRes.json();

      // Step 2: Persist postmortem on incident record
      postMortemData.hindsight_retained = true;
      postMortemData.hindsight_memory_id = retainData.memory_id;

      await fetch(`/api/incidents/${selectedIncidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "resolved",
          postmortem: postMortemData,
        }),
      });

      setRetentionSuccess(retainData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId);

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <FileText className="w-4 h-4" />
                <span>POST-MORTEM & INSTITUTIONAL LEARNING</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Post-Mortem Knowledge Synthesis
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Record verified incident resolutions. PagerLore automatically retains lessons in Hindsight to prevent recurrence.
              </p>
            </div>
          </div>

          {/* Retention Success Celebration Banner */}
          {retentionSuccess && (
            <div className="rounded-2xl bg-[#091a18] border-2 border-emerald-500/70 p-6 shadow-[0_0_35px_rgba(16,185,129,0.2)] animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Retained in Hindsight Memory Bank</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Incident {selectedIncidentId} has become permanent engineering memory.
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-sans">
                    The verified root cause, diagnostic timeline, and remediation command have been indexed into bank{" "}
                    <code className="text-cyan-300 font-mono font-semibold">{retentionSuccess.bank_id}</code>. Future investigations encountering similar connection wait spikes or deployment regressions will recall this knowledge automatically.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                    <span>Memory ID: <strong className="text-cyan-300">{retentionSuccess.memory_id}</strong></span>
                    <span>·</span>
                    <span>Facts Extracted: <strong className="text-white">{retentionSuccess.facts_extracted_count}</strong></span>
                    <span>·</span>
                    <Link href="/vault" className="text-cyan-400 hover:underline">
                      Inspect in Memory Vault →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Incident Selector */}
          <div className="rounded-xl bg-[#090e18] border border-[#1c263c] p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Incident:</span>
              <select
                value={selectedIncidentId}
                onChange={(e) => handleIncidentChange(e.target.value)}
                className="bg-[#0e1524] text-xs font-mono text-cyan-300 border border-[#1e2d4a] rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} · {inc.affected_service} · {inc.title.substring(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            {selectedIncident?.postmortem?.hindsight_retained && (
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                ✓ Retained in Vault
              </span>
            )}
          </div>

          {/* Post-Mortem Form */}
          <form onSubmit={handleSubmitPostMortem} className="space-y-6">
            <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 sm:p-8 shadow-xl space-y-6">
              {/* Summary */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  1. Incident Executive Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="High-level narrative of what failed, user impact, and resolution..."
                  className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                />
              </div>

              {/* Confirmed Root Cause */}
              <div>
                <label className="block text-xs font-mono uppercase text-cyan-300 mb-1.5 font-bold">
                  2. Confirmed Root Cause (Retained in Hindsight) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="e.g. HikariCP maxLifetime was set to 1800000ms (30m) exceeding pgBouncer server_idle_timeout 600s (10m)..."
                  className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-cyan-800/60 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                />
              </div>

              {/* Final Resolution */}
              <div>
                <label className="block text-xs font-mono uppercase text-emerald-400 mb-1.5 font-bold">
                  3. Verified Remediation & Fix *
                </label>
                <textarea
                  rows={2}
                  required
                  value={finalResolution}
                  onChange={(e) => setFinalResolution(e.target.value)}
                  placeholder="Exact steps taken to mitigate and restore SLO..."
                  className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-emerald-800/60 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>

              {/* Two columns: Successful vs Failed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Successful Actions (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={successfulActions}
                    onChange={(e) => setSuccessfulActions(e.target.value)}
                    placeholder="Hot-patch HikariCP maxLifetime to 540000ms&#10;Rolling restart of deployment pods"
                    className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                    Failed Attempts / Red Herrings (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={failedAttempts}
                    onChange={(e) => setFailedAttempts(e.target.value)}
                    placeholder="Scaling up max_connections on primary DB (did not resolve proxy drop)"
                    className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                  />
                </div>
              </div>

              {/* Preventive Measures */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Permanent Preventive Measures & CI Guardrails
                </label>
                <textarea
                  rows={2}
                  value={preventiveMeasures}
                  onChange={(e) => setPreventiveMeasures(e.target.value)}
                  placeholder="Add CI linter asserting client pool maxLifetime < proxy timeout&#10;Add alert on HikariCP wait time > 250ms"
                  className="w-full bg-[#0e1524] text-xs text-slate-100 p-3 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                />
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1c263c] flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Submitting retains verified facts into Hindsight bank immediately.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>{isSubmitting ? "Retaining into Hindsight..." : "Submit & Retain in Memory Vault"}</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default function PostMortemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090e] text-slate-400 flex items-center justify-center font-mono text-xs">Loading Post-Mortems...</div>}>
      <PostMortemsContent />
    </Suspense>
  );
}
