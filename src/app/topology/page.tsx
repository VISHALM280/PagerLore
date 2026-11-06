"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TopologyCanvas } from "@/components/topology/TopologyCanvas";
import { Network } from "lucide-react";

export default function TopologyPage() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F7F2]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenCommandPalette={() => setCmdOpen(true)} />
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#267B5B] mb-1">
                <Network className="w-3.5 h-3.5" />
                <span>INFRASTRUCTURE TOPOLOGY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#25352D] tracking-tight">
                Service Topology & Fault Propagation
              </h1>
              <p className="text-xs sm:text-sm text-[#788579] mt-1">
                Live dependency graph illustrating telemetry degradation and upstream/downstream incident cascading.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#788579] bg-[#FFFFFF] px-3 py-1.5 rounded border border-[#E9E8DF]">
                Cluster: <span className="text-[#25352D] font-semibold">us-east-1-prod</span>
              </span>
            </div>
          </div>

          <TopologyCanvas />
        </main>
      </div>
    </div>
  );
}
