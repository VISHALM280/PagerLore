"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, ShieldCheck, Database, Sparkles, ChevronDown } from "lucide-react";
import { LivePulse } from "../common/LivePulse";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Nodes and telemetry particles
    const nodes: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const nodeCount = Math.min(36, Math.floor(width / 35));

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        color: i % 3 === 0 ? "#00f0ff" : i % 5 === 0 ? "#38bdf8" : "#1e293b",
      });
    }

    // Telemetry packet pulses traveling across lines
    const packets: Array<{ from: number; to: number; progress: number; speed: number }> = [];
    for (let i = 0; i < 12; i++) {
      packets.push({
        from: Math.floor(Math.random() * nodes.length),
        to: Math.floor(Math.random() * nodes.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = "rgba(28, 38, 60, 0.25)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.35;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw traveling telemetry packets
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.from = Math.floor(Math.random() * nodes.length);
          pkt.to = Math.floor(Math.random() * nodes.length);
        }

        const start = nodes[pkt.from];
        const end = nodes[pkt.to];
        if (start && end) {
          const px = start.x + (end.x - start.x) * pkt.progress;
          const py = start.y + (end.y - start.y) * pkt.progress;

          ctx.fillStyle = "#00f0ff";
          ctx.shadowColor = "#00f0ff";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Draw nodes
      nodes.forEach((n) => {
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Canvas Interactive Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* Atmospheric Radial Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Operational Pill */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0d1627]/90 border border-cyan-800/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] mb-8 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase font-medium">
            Hindsight Persistent Memory Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono text-slate-300">INC-142 Ingested</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl">
          Your infrastructure has <br />
          <span className="text-gradient-cyan">seen this before.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
          The next incident shouldn&apos;t start from zero. PagerLore uses persistent engineering
          memory to recall past failures, surface proven resolutions, and make every outage a
          permanent lesson for the next.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/command"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] flex items-center justify-center gap-2.5 group transform active:scale-95"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/theatre"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0e1628] hover:bg-[#152038] text-slate-200 border border-[#1e2f50] hover:border-cyan-500/50 text-sm font-medium transition-all flex items-center justify-center gap-2 font-mono"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Memory ON vs OFF Demo</span>
          </Link>
        </div>

        {/* Live Telemetry Bar Preview */}
        <div className="w-full max-w-3xl rounded-xl bg-[#0a0f1b]/80 border border-[#1c263c] backdrop-blur-md p-4 text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1c263c] pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-red-400 uppercase">
                Active Incident INC-2024-142
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                · payments-service:checkout
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Matched Memory: INC-2024-089 (96% confidence)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0e1524] border border-[#1a253c]">
              <div className="text-slate-400 text-[10px] uppercase">Observed Symptom</div>
              <div className="text-slate-200 mt-0.5 truncate">HikariPool connection timeout</div>
              <div className="text-red-400 text-[11px] mt-1 font-semibold">PSQLException 30005ms</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e1524] border border-[#1a253c]">
              <div className="text-cyan-400 text-[10px] uppercase">Recalled Resolution</div>
              <div className="text-slate-200 mt-0.5 truncate">pgBouncer idle timeout fix</div>
              <div className="text-cyan-300 text-[11px] mt-1 font-semibold">maxLifetime &lt; 600s</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0e1524] border border-[#1a253c]">
              <div className="text-emerald-400 text-[10px] uppercase">Resolution Outcome</div>
              <div className="text-slate-200 mt-0.5 truncate">Zero code changes required</div>
              <div className="text-emerald-300 text-[11px] mt-1 font-semibold">MTTR cut from 120m to 14m</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center text-slate-400 animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-widest mb-1">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
    </section>
  );
}
