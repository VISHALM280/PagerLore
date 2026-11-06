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
      bg: "bg-[#FBF1F1]",
      text: "text-[#C94F4F] font-semibold",
      border: "border-[#E8BABA]",
      dot: "bg-[#C94F4F]",
      label: "SEV-1 Critical",
    },
    "SEV-2": {
      bg: "bg-[#FCF6ED]",
      text: "text-[#C58B43] font-medium",
      border: "border-[#E8D3B6]",
      dot: "bg-[#C58B43]",
      label: "SEV-2 High",
    },
    "SEV-3": {
      bg: "bg-[#F7F3EC]",
      text: "text-[#8C7752]",
      border: "border-[#E0D5C3]",
      dot: "bg-[#B8A17A]",
      label: "SEV-3 Medium",
    },
    "SEV-4": {
      bg: "bg-[#F1F0E9]",
      text: "text-[#788579]",
      border: "border-[#E9E8DF]",
      dot: "bg-[#9A9C91]",
      label: "SEV-4 Low",
    },
  };

  const current = styles[severity] || styles["SEV-3"];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono rounded border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}
