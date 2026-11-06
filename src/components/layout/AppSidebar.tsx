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
  ExternalLink,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      title: "Command Center",
      href: "/command",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Active Incidents",
      href: "/incidents",
      icon: AlertTriangle,
      badge: "1",
      badgeColor: "bg-red-500/20 text-red-400 border border-red-500/40",
    },
    {
      title: "Incident History",
      href: "/incidents?filter=history",
      icon: History,
      badge: null,
    },
    {
      title: "AI Investigation",
      href: "/investigate",
      icon: BrainCircuit,
      badge: "AI",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    },
    {
      title: "Memory Vault",
      href: "/vault",
      icon: Database,
      badge: "Hindsight",
      badgeColor: "bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 font-mono",
    },
    {
      title: "Post-Mortems",
      href: "/postmortems",
      icon: FileText,
      badge: null,
    },
    {
      title: "Service Topology",
      href: "/topology",
      icon: Network,
      badge: null,
    },
    {
      title: "Runbooks",
      href: "/runbooks",
      icon: BookOpen,
      badge: null,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "Demo Theatre",
      href: "/theatre",
      icon: Tv,
      badge: "LIVE",
      badgeColor: "bg-purple-950/80 text-purple-300 border border-purple-700/50",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative z-40 bg-[#090d16] border-r border-[#1c263c] flex flex-col transition-all duration-300 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header / Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#1c263c] justify-between">
        {!collapsed ? (
          <Logo size="sm" showWordmark={true} />
        ) : (
          <Logo size="sm" showWordmark={false} className="mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-[#0e1524] text-slate-400 hover:text-cyan-300 border border-[#1e2d4a] hover:border-cyan-500/50 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-cyan-950/70 to-slate-900/60 text-cyan-300 border border-cyan-800/60 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0e1524] border border-transparent"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.title : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium uppercase tracking-wider ${
                        item.badgeColor || "bg-slate-800 text-slate-300"
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

      {/* Bottom Card / System Status */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-[#0e1524] border border-[#1e2d4a]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Hindsight Engine
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-snug">
            Persistent memory active across 4 historical incidents.
          </p>
          <Link
            href="/theatre"
            className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-700/50 text-[11px] font-mono text-cyan-300 transition-colors"
          >
            <span>Launch Theatre</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        <div className="p-2 text-center border-t border-[#1c263c]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" title="Hindsight Active" />
        </div>
      )}
    </aside>
  );
}
