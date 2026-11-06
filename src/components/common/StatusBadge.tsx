import React from "react";
import { IncidentStatus } from "@/lib/types/incident";

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  const styles: Record<IncidentStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
    investigating: {
      bg: "bg-[#FBF1F1]",
      text: "text-[#C94F4F] font-medium",
      border: "border-[#E8BABA]",
      dot: "bg-[#C94F4F]",
      label: "Investigating",
    },
    identified: {
      bg: "bg-[#FCF6ED]",
      text: "text-[#C58B43] font-medium",
      border: "border-[#E8D3B6]",
      dot: "bg-[#C58B43]",
      label: "Identified",
    },
    monitoring: {
      bg: "bg-[#F7F3EC]",
      text: "text-[#8C7752] font-medium",
      border: "border-[#E0D5C3]",
      dot: "bg-[#B8A17A]",
      label: "Monitoring",
    },
    resolved: {
      bg: "bg-[#EAF2EC]",
      text: "text-[#267B5B] font-medium",
      border: "border-[#BFD8C6]",
      dot: "bg-[#267B5B]",
      label: "Resolved",
    },
  };

  const current = styles[status] || styles.investigating;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
