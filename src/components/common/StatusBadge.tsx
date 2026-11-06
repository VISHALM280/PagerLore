import React from "react";
import { IncidentStatus } from "@/lib/types/incident";

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  const styles: Record<IncidentStatus, { bg: string; text: string; border: string; label: string }> = {
    investigating: {
      bg: "bg-red-950/40",
      text: "text-red-400 font-medium",
      border: "border-red-800/60",
      label: "Investigating",
    },
    identified: {
      bg: "bg-amber-950/40",
      text: "text-amber-300 font-medium",
      border: "border-amber-800/60",
      label: "Identified",
    },
    monitoring: {
      bg: "bg-cyan-950/40",
      text: "text-cyan-300 font-medium",
      border: "border-cyan-800/50",
      label: "Monitoring",
    },
    resolved: {
      bg: "bg-emerald-950/40",
      text: "text-emerald-400 font-medium",
      border: "border-emerald-800/50",
      label: "Resolved",
    },
  };

  const current = styles[status] || styles.investigating;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-md border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "resolved" ? "bg-emerald-400" : status === "investigating" ? "bg-red-400 animate-pulse" : "bg-amber-400"
        }`}
      />
      {current.label}
    </span>
  );
}
