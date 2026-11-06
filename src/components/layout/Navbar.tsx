"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../common/Logo";
import { LivePulse } from "../common/LivePulse";
import { ArrowRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E9E8DF] py-3.5 shadow-subtle"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#788579]">
            <Link
              href="#problem"
              className="hover:text-[#25352D] transition-colors"
            >
              The Problem
            </Link>
            <Link
              href="#solution"
              className="hover:text-[#25352D] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/vault"
              className="hover:text-[#25352D] transition-colors"
            >
              Memory Vault
            </Link>
            <Link
              href="/theatre"
              className="text-[#267B5B] hover:text-[#194B38] font-mono text-xs px-2.5 py-1 rounded bg-[#EAF2EC] border border-[#BFD8C6] transition-colors"
            >
              Memory Benchmark
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LivePulse status="active_incident" label="INC-142 Active" />

            <Link
              href="/command"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded bg-[#267B5B] hover:bg-[#194B38] text-white shadow-subtle transition-all duration-150"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LivePulse status="active_incident" label="INC-142" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded bg-[#FFFFFF] border border-[#E9E8DF] text-[#25352D]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-4 pb-5 border-t border-[#E9E8DF] bg-[#FFFFFF] rounded-xl p-4 flex flex-col gap-3 text-sm shadow-editorial">
            <Link
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#25352D] py-1.5"
            >
              The Problem
            </Link>
            <Link
              href="#solution"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#25352D] py-1.5"
            >
              How It Works
            </Link>
            <Link
              href="/vault"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#25352D] py-1.5"
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
