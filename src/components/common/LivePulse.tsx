import React from "react";

interface LivePulseProps {
  status?: "healthy" | "active_incident" | "degraded" | "demo";
  label?: string;
  className?: string;
}

export function LivePulse({ status = "healthy", label, className = "" }: LivePulseProps) {
  const configs = {
    healthy: {
      color: "bg-[#267B5B]",
      text: "text-[#267B5B]",
      border: "border-[#BFD8C6]",
      bg: "bg-[#EAF2EC]",
      defaultLabel: "Systems Operational",
    },
    active_incident: {
      color: "bg-[#C94F4F]",
      text: "text-[#C94F4F]",
      border: "border-[#E8BABA]",
      bg: "bg-[#FBF1F1]",
      defaultLabel: "1 Active SEV-1",
    },
    degraded: {
      color: "bg-[#C58B43]",
      text: "text-[#C58B43]",
      border: "border-[#E8D3B6]",
      bg: "bg-[#FCF6ED]",
      defaultLabel: "Latency Degraded",
    },
    demo: {
      color: "bg-[#B8A17A]",
      text: "text-[#8C7752]",
      border: "border-[#E0D5C3]",
      bg: "bg-[#F7F3EC]",
      defaultLabel: "Hindsight Demo Mode",
    },
  };

  const current = configs[status] || configs.healthy;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border ${current.bg} ${current.border} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.color}`} />
      <span className={`text-[11px] font-mono font-medium tracking-wide ${current.text}`}>
        {label || current.defaultLabel}
      </span>
    </div>
  );
}
