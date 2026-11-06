import React from "react";
import { Severity } from "@/lib/types/incident";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: "sm" | "md";
}

export function SeverityBadge({ severity, className = "", size = "md" }: SeverityBadgeProps) {
  const styles: Record<Severity, { bg: string; text: string; border: string; dot: string; label: string }> = {
    "SEV-1": {
      bg: "bg-red-950/60",
      text: "text-red-400 font-semibold",
      border: "border-red-800/80 shadow-[0_0_12px_rgba(239,68,68,0.3)]",
      dot: "bg-red-500 animate-ping",
      label: "SEV-1 Critical",
    },
    "SEV-2": {
      bg: "bg-amber-950/50",
      text: "text-amber-300 font-medium",
      border: "border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      dot: "bg-amber-400",
      label: "SEV-2 High",
    },
    "SEV-3": {
      bg: "bg-cyan-950/40",
      text: "text-cyan-300",
      border: "border-cyan-800/50",
      dot: "bg-cyan-400",
      label: "SEV-3 Medium",
    },
    "SEV-4": {
      bg: "bg-slate-900/60",
      text: "text-slate-400",
      border: "border-slate-800",
      dot: "bg-slate-500",
      label: "SEV-4 Low",
    },
  };

  const current = styles[severity] || styles["SEV-3"];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono rounded-md border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {severity === "SEV-1" && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot.split(" ")[0]}`} />
      </span>
      {current.label}
    </span>
  );
}
