import React from "react";

interface LivePulseProps {
  status?: "healthy" | "active_incident" | "degraded" | "demo";
  label?: string;
  className?: string;
}

export function LivePulse({ status = "healthy", label, className = "" }: LivePulseProps) {
  const configs = {
    healthy: {
      color: "bg-emerald-400",
      pingColor: "bg-emerald-500",
      text: "text-emerald-400",
      border: "border-emerald-800/40",
      bg: "bg-emerald-950/30",
      defaultLabel: "Systems Operational",
    },
    active_incident: {
      color: "bg-red-400",
      pingColor: "bg-red-500",
      text: "text-red-400",
      border: "border-red-800/60",
      bg: "bg-red-950/40",
      defaultLabel: "1 Active SEV-1",
    },
    degraded: {
      color: "bg-amber-400",
      pingColor: "bg-amber-500",
      text: "text-amber-400",
      border: "border-amber-800/50",
      bg: "bg-amber-950/30",
      defaultLabel: "Latency Degraded",
    },
    demo: {
      color: "bg-cyan-400",
      pingColor: "bg-cyan-500",
      text: "text-cyan-400",
      border: "border-cyan-800/50",
      bg: "bg-cyan-950/30",
      defaultLabel: "Hindsight Demo Mode",
    },
  };

  const current = configs[status] || configs.healthy;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${current.bg} ${current.border} ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pingColor}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.color}`} />
      </span>
      <span className={`text-[11px] font-mono font-medium tracking-wide ${current.text}`}>
        {label || current.defaultLabel}
      </span>
    </div>
  );
}
