"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { Severity } from "@/lib/types/incident";
import { AlertTriangle, ArrowLeft, PlusCircle } from "lucide-react";

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
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
          <Link
            href="/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#788579] hover:text-[#25352D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Incident Log</span>
          </Link>

          <div className="rounded-xl bg-[#FFFFFF] border border-[#E9E8DF] p-8 shadow-subtle">
            <div className="border-b border-[#E9E8DF] pb-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>INCIDENT INGESTION</span>
              </div>
              <h1 className="text-2xl font-bold text-[#25352D] tracking-tight">
                Declare Production Incident
              </h1>
              <p className="text-xs text-[#788579] mt-1 font-sans">
                Ingest an active operational disruption. PagerLore will query historical memory for matching root-cause patterns.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase text-[#25352D] mb-1.5 font-semibold">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Postgres Connection Pool Saturation following v2.8.2"
                  className="w-full bg-[#F8F7F2] text-sm text-[#25352D] px-3.5 py-2.5 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#25352D] mb-1.5 font-semibold">
                    Affected Service *
                  </label>
                  <select
                    value={affectedService}
                    onChange={(e) => setAffectedService(e.target.value)}
                    className="w-full bg-[#F8F7F2] text-xs font-mono text-[#25352D] px-3 py-2.5 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
                  >
                    <option value="payments-service">payments-service</option>
                    <option value="auth-service">auth-service</option>
                    <option value="order-processor">order-processor</option>
                    <option value="api-gateway">api-gateway</option>
                    <option value="database-cluster">database-cluster</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#25352D] mb-1.5 font-semibold">
                    Severity *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as Severity)}
                    className="w-full bg-[#F8F7F2] text-xs font-mono text-[#25352D] px-3 py-2.5 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
                  >
                    <option value="SEV-1">SEV-1 (Critical Outage)</option>
                    <option value="SEV-2">SEV-2 (High Degradation)</option>
                    <option value="SEV-3">SEV-3 (Medium Impact)</option>
                    <option value="SEV-4">SEV-4 (Low / Informational)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#25352D] mb-1.5 font-semibold">
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as any)}
                    className="w-full bg-[#F8F7F2] text-xs font-mono text-[#25352D] px-3 py-2.5 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B]"
                  >
                    <option value="production">production</option>
                    <option value="staging">staging</option>
                    <option value="us-east">us-east</option>
                    <option value="eu-central">eu-central</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#25352D] mb-1.5 font-semibold">
                  Observed Symptoms & Context
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe observed error rates, latency spikes, or deployment commits..."
                  className="w-full bg-[#F8F7F2] text-xs text-[#25352D] p-3 rounded border border-[#E9E8DF] focus:outline-none focus:border-[#267B5B] font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-[#E9E8DF] flex items-center justify-end gap-3">
                <Link
                  href="/incidents"
                  className="px-4 py-2 text-xs font-mono text-[#788579] hover:text-[#25352D]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded bg-[#267B5B] hover:bg-[#194B38] text-white font-medium text-xs flex items-center gap-2 shadow-subtle transition-colors"
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
