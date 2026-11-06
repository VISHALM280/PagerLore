"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { BookOpen, Database, CheckCircle2, Copy, Check, Terminal, ExternalLink } from "lucide-react";

export default function RunbooksPage() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const runbooks = [
    {
      id: "RBK-001",
      title: "HikariCP Connection Pool Exhaustion & Proxy Timeout Asymmetry",
      service: "payments-service",
      hindsightRef: "mem-hindsight-8901-hikari",
      sourceIncident: "INC-2024-089",
      lastUpdated: "Retained automatically via Post-Mortem",
      symptoms: [
        "PSQLException: Connection is not available, request timed out after 30005ms",
        "HikariPool active connections at 100% (50/50) with 0 idle connections",
        "Ingress HTTP 500 error rates exceeding 20%",
      ],
      remediationSteps: [
        {
          step: 1,
          action: "Verify pgBouncer idle server timeout",
          command: "kubectl exec -it deployment/pgbouncer -- psql -c 'SHOW POOLS;'",
        },
        {
          step: 2,
          action: "Ensure HikariCP maxLifetime is strictly less than proxy timeout",
          command: "kubectl set env deployment/payments-service HIKARI_MAX_LIFETIME=540000 HIKARI_CONN_TIMEOUT=5000",
        },
        {
          step: 3,
          action: "Execute graceful rolling restart",
          command: "kubectl rollout restart deployment/payments-service",
        },
      ],
    },
    {
      id: "RBK-002",
      title: "Redis Cache Stampede & Token Thundering Herd",
      service: "auth-service",
      hindsightRef: "mem-hindsight-7104-redis",
      sourceIncident: "INC-2024-118",
      lastUpdated: "Retained automatically via Post-Mortem",
      symptoms: [
        "Spike in Redis cache misses exceeding 70% at top of the hour",
        "PostgreSQL user auth replica connection saturation reaching 100%",
        "504 Gateway Timeouts on /v1/auth/verify",
      ],
      remediationSteps: [
        {
          step: 1,
          action: "Deploy singleflight request coalescer to prevent duplicate DB queries",
          command: "kubectl rollout status deployment/auth-service",
        },
        {
          step: 2,
          action: "Apply 15% random TTL jitter to session token insertion",
          command: "redis-cli --eval /scripts/apply-ttl-jitter.lua , 3600 540",
        },
      ],
    },
    {
      id: "RBK-003",
      title: "Kafka Consumer Lag & Rebalance Storm Mitigation",
      service: "order-processor",
      hindsightRef: "mem-hindsight-9921-kafka",
      sourceIncident: "INC-2024-102",
      lastUpdated: "Retained automatically via Post-Mortem",
      symptoms: [
        "Consumer group rebalance loops with CommitFailedException",
        "GC pauses exceeding max.poll.interval.ms (30000ms)",
        "Consumer lag surging past 10,000 messages",
      ],
      remediationSteps: [
        {
          step: 1,
          action: "Double max.poll.interval.ms to prevent premature node eviction",
          command: "kubectl set env deployment/order-processor KAFKA_MAX_POLL_INTERVAL_MS=600000",
        },
        {
          step: 2,
          action: "Tune max.poll.records to 50 for heavy invoice payloads",
          command: "kubectl set env deployment/order-processor KAFKA_MAX_POLL_RECORDS=50",
        },
      ],
    },
  ];

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#07090e]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>DYNAMIC OPERATIONAL RUNBOOKS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Verified SRE Playbooks
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Executable runbooks auto-updated from Hindsight post-mortems and tested production resolutions.
            </p>
          </div>

          <div className="space-y-6">
            {runbooks.map((rb) => (
              <div key={rb.id} className="rounded-2xl bg-[#090e18] border border-[#1c263c] p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c263c] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                      {rb.id}
                    </span>
                    <h3 className="text-base font-bold text-white">{rb.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{rb.service}</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <Link
                    href={`/vault`}
                    className="flex items-center gap-1.5 text-cyan-400 hover:underline"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Memory: {rb.hindsightRef}</span>
                  </Link>
                  <span>·</span>
                  <Link
                    href={`/incidents/${rb.sourceIncident}`}
                    className="hover:text-slate-200 underline"
                  >
                    Source: {rb.sourceIncident}
                  </Link>
                </div>

                {/* Symptoms */}
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                    Matching Trigger Symptoms:
                  </div>
                  <div className="space-y-1 text-xs text-slate-300 font-sans">
                    {rb.symptoms.map((s, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">›</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation Steps */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">
                    Verified Remediation Sequence:
                  </div>
                  {rb.remediationSteps.map((step) => (
                    <div key={step.step} className="p-3 rounded-xl bg-[#060910] border border-slate-900 font-mono text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-300 font-sans font-medium">
                        <span>Step {step.step}: {step.action}</span>
                        <button
                          onClick={() => handleCopy(step.command)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors font-mono"
                        >
                          {copiedCmd === step.command ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCmd === step.command ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <code className="text-cyan-300 block select-all bg-[#0a0f1c] p-2 rounded border border-[#141d30] text-[11px] break-all">
                        {step.command}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
