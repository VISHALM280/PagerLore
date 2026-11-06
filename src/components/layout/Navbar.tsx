"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";
import { LivePulse } from "../common/LivePulse";
import { ArrowRight, Terminal, BrainCircuit, Activity, ShieldCheck, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07090e]/90 backdrop-blur-md border-b border-[#1c263c]/80 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link
              href="#problem"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              The Problem
            </Link>
            <Link
              href="#solution"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              Hindsight Memory
            </Link>
            <Link
              href="#engine"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              Investigation Pipeline
            </Link>
            <Link
              href="/theatre"
              className="hover:text-cyan-400 text-cyan-300/90 font-mono text-xs px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/40 transition-all hover:border-cyan-500/60"
            >
              Memory ON vs OFF
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LivePulse status="active_incident" label="Live INC-142" />

            <Link
              href="/theatre"
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg border border-[#1c263c] hover:border-slate-700 bg-[#0d1424]/50 transition-all"
            >
              Demo Theatre
            </Link>

            <Link
              href="/command"
              className="relative group inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sans shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all transform active:scale-95"
            >
              <span>Enter Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LivePulse status="active_incident" label="INC-142" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0d1424] border border-[#1c263c] text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-[#1c263c] bg-[#07090e]/95 backdrop-blur-xl rounded-2xl p-4 flex flex-col gap-4 text-sm">
            <Link
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-2"
            >
              The Problem
            </Link>
            <Link
              href="#solution"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-2"
            >
              Hindsight Memory
            </Link>
            <Link
              href="#engine"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-2"
            >
              Investigation Pipeline
            </Link>
            <Link
              href="/theatre"
              onClick={() => setMobileMenuOpen(false)}
              className="text-cyan-300 py-2 font-mono text-xs"
            >
              Memory ON vs OFF Demo Theatre
            </Link>
            <Link
              href="/command"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 font-sans shadow-lg"
            >
              Enter Command Center
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
