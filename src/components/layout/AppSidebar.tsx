"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../common/Logo";
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  BrainCircuit,
  Database,
  FileText,
  BookOpen,
  BarChart3,
  Tv,
  Settings,
  Network,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { title: "Overview", href: "/command", icon: LayoutDashboard, badge: null },
    { title: "Active Incidents", href: "/incidents", icon: AlertTriangle, badge: "1", badgeColor: "bg-[#FAF0F0] text-[#C94F4F] border border-[#E8BABA]" },
    { title: "Incident History", href: "/incidents?filter=history", icon: History, badge: null },
    { title: "AI Investigation", href: "/investigate", icon: BrainCircuit, badge: null },
    { title: "Memory Vault", href: "/vault", icon: Database, badge: "Hindsight", badgeColor: "bg-[#EAF2EC] text-[#267B5B] border border-[#BFD8C6]" },
    { title: "Post-Mortems", href: "/postmortems", icon: FileText, badge: null },
    { title: "Service Topology", href: "/topology", icon: Network, badge: null },
    { title: "Runbooks", href: "/runbooks", icon: BookOpen, badge: null },
    { title: "Analytics", href: "/analytics", icon: BarChart3, badge: null },
    { title: "Demo Theatre", href: "/theatre", icon: Tv, badge: "Benchmark", badgeColor: "bg-[#F7F3EC] text-[#8C7752] border border-[#E0D5C3]" },
    { title: "Settings", href: "/settings", icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`relative z-40 bg-[#FFFFFF] border-r border-[#E9E8DF] flex flex-col transition-all duration-200 select-none ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Top Header / Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#E9E8DF] justify-between">
        {!collapsed ? (
          <Logo size="sm" showWordmark={true} />
        ) : (
          <Logo size="sm" showWordmark={false} className="mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded bg-[#F8F7F2] text-[#788579] hover:text-[#25352D] border border-[#E9E8DF] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/command"
              ? pathname === "/command"
              : item.href.includes("?")
              ? pathname + (typeof window !== "undefined" ? window.location.search : "") === item.href
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all group ${
                isActive
                  ? "bg-[#EAF2EC] text-[#194B38] font-semibold shadow-subtle"
                  : "text-[#788579] hover:text-[#25352D] hover:bg-[#F8F7F2]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.title : undefined}
            >
              <Icon
                className={`w-3.5 h-3.5 flex-shrink-0 ${
                  isActive ? "text-[#267B5B]" : "text-[#788579] group-hover:text-[#25352D]"
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                        item.badgeColor || "bg-[#F1F0E9] text-[#788579]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Memory Status */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-lg bg-[#F8F7F2] border border-[#E9E8DF] text-xs">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#788579] mb-1">
            <span>Hindsight Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#267B5B]" />
          </div>
          <p className="text-[11px] text-[#25352D] font-sans leading-snug">
            Persistent incident bank active with verified rules.
          </p>
        </div>
      ) : (
        <div className="p-2 text-center border-t border-[#E9E8DF]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#267B5B]" title="Hindsight Active" />
        </div>
      )}
    </aside>
  );
}
