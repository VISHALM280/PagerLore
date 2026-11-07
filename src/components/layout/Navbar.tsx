"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";
import { LivePulse } from "../common/LivePulse";
import { ArrowRight, Menu, X, RotateCcw } from "lucide-react";
import { MagneticLink } from "../common/MagneticButton";

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
          ? "bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E9E8DF] py-3.5 shadow-subtle"
          : "bg-[#0A1210]/75 backdrop-blur-md border-b border-[#ffffff12] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" theme={scrolled ? "light" : "dark"} />

          {/* Desktop Nav Links */}
          <nav
            className={`hidden lg:flex items-center gap-7 text-xs font-mono font-medium transition-colors ${
              scrolled ? "text-[#788579]" : "text-[#A3B2A8]"
            }`}
          >
            <Link
              href="#time-reversal"
              className={`relative py-1 transition-colors group ${
                scrolled ? "hover:text-[#25352D]" : "hover:text-white"
              }`}
            >
              <span>Time Machine</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#267B5B] transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              href="#history-repeats"
              className={`relative py-1 transition-colors group ${
                scrolled ? "hover:text-[#25352D]" : "hover:text-white"
              }`}
            >
              <span>Pattern Memory</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#267B5B] transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              href="#memory-engine"
              className={`relative py-1 transition-colors group ${
                scrolled ? "hover:text-[#25352D]" : "hover:text-white"
              }`}
            >
              <span>Hindsight Engine</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#267B5B] transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              href="#investigation-walkthrough"
              className={`relative py-1 transition-colors group ${
                scrolled ? "hover:text-[#25352D]" : "hover:text-white"
              }`}
            >
              <span>SRE Walkthrough</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#267B5B] transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              href="/vault"
              className={`relative py-1 transition-colors group ${
                scrolled ? "hover:text-[#25352D]" : "hover:text-white"
              }`}
            >
              <span>Memory Vault</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#267B5B] transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link
              href="/theatre"
              className="text-[#267B5B] hover:text-[#194B38] font-mono text-[11px] px-2.5 py-1 rounded bg-[#EAF2EC] border border-[#BFD8C6] transition-all hover:shadow-sm"
            >
              Benchmark
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LivePulse status="active_incident" label="INC-142 Active" />

            <MagneticLink
              href="/command"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded bg-[#267B5B] hover:bg-[#194B38] text-white shadow-subtle transition-all duration-150"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MagneticLink>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <LivePulse status="active_incident" label="INC-142" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 rounded border transition-colors ${
                scrolled
                  ? "bg-[#FFFFFF] border-[#E9E8DF] text-[#25352D]"
                  : "bg-[#13231E] border-[#267B5B]/30 text-white"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-3 pt-4 pb-5 rounded-xl p-4 flex flex-col gap-3 text-sm shadow-editorial border ${
              scrolled
                ? "bg-[#FFFFFF] border-[#E9E8DF] text-[#25352D]"
                : "bg-[#0E1A16] border-[#267B5B]/30 text-[#F8F7F2]"
            }`}
          >
            <Link
              href="#time-reversal"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#267B5B]"
            >
              Time Machine
            </Link>
            <Link
              href="#history-repeats"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#267B5B]"
            >
              Pattern Memory
            </Link>
            <Link
              href="#memory-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#267B5B]"
            >
              Hindsight Engine
            </Link>
            <Link
              href="#investigation-walkthrough"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#267B5B]"
            >
              SRE Walkthrough
            </Link>
            <Link
              href="/vault"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#267B5B]"
            >
              Memory Vault
            </Link>
            <Link
              href="/theatre"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#267B5B] py-1.5 font-mono text-xs"
            >
              Memory Benchmark
            </Link>
            <Link
              href="/command"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded bg-[#267B5B] text-white"
            >
              Enter Command Center
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
