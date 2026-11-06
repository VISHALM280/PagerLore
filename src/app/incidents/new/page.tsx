"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Severity, IncidentStatus } from "@/lib/types/incident";
import { AlertTriangle, ArrowLeft, PlusCircle, CheckCircle2 } from "lucide-react";

export default function NewIncidentPage() {
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [affectedService, setAffectedService] = useState("payments-service");
  const [severity, setSeverity] = useState<Severity>("SEV-2");
  const [environment, setEnvironment] = useState<"production" | "staging" | "us-east" | "eu-central">("production");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !affectedService) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          affected_service: affectedService,
          severity,
          environment,
        }),
      });
      const created = await res.json();
      if (created.id) {
        router.push(`/incidents/${created.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <Link
            href="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incident Catalog</span>
          </Link>

          <div className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 sm:p-8 shadow-2xl">
            <div className="border-b border-[#1c263c] pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>INCIDENT INGESTION</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Declare Production Incident
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Ingest a new operational anomaly. PagerLore will immediately query Hindsight memory for matching historical incidents.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Postgres Connection Pool Saturation following v2.8.2"
                  className="w-full bg-[#0e1524] text-sm text-slate-100 px-4 py-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                    Affected Service *
                  </label>
                  <select
                    value={affectedService}
                    onChange={(e) => setAffectedService(e.target.value)}
                    className="w-full bg-[#0e1524] text-xs font-mono text-cyan-300 px-3 py-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="payments-service">payments-service</option>
                    <option value="auth-service">auth-service</option>
                    <option value="order-processor">order-processor</option>
                    <option value="api-gateway">api-gateway</option>
                    <option value="database-cluster">database-cluster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                    Severity *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as Severity)}
                    className="w-full bg-[#0e1524] text-xs font-mono text-slate-200 px-3 py-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SEV-1">SEV-1 (Critical Outage)</option>
                    <option value="SEV-2">SEV-2 (High Degradation)</option>
                    <option value="SEV-3">SEV-3 (Medium Impact)</option>
                    <option value="SEV-4">SEV-4 (Low / Informational)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as any)}
                    className="w-full bg-[#0e1524] text-xs font-mono text-slate-200 px-3 py-2.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500"
                  >
                    <option value="production">production</option>
                    <option value="staging">staging</option>
                    <option value="us-east">us-east</option>
                    <option value="eu-central">eu-central</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
                  Observed Symptoms & Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe error patterns, latency spikes, affected endpoints, or recent deployment commits..."
                  className="w-full bg-[#0e1524] text-xs text-slate-100 p-3.5 rounded-lg border border-[#1e2d4a] focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-[#1c263c] flex items-center justify-end gap-3">
                <Link
                  href="/incidents"
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{submitting ? "Ingesting..." : "Declare & Ingest Incident"}</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
