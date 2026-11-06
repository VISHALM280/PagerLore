import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { IntelligencePipeline } from "@/components/landing/IntelligencePipeline";
import { LearningLoopSection } from "@/components/landing/LearningLoopSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Logo } from "@/components/common/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Cinematic Top Navbar */}
      <Navbar />

      {/* Main Narrative Flow */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <IntelligencePipeline />
        <LearningLoopSection />
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#161f33] bg-[#040609] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="text-xs font-mono text-slate-500 text-center sm:text-right">
            <div>PagerLore · Memory-Powered Incident Response Platform</div>
            <div className="mt-1 text-slate-600">Built with Hindsight (Vectorize) persistent memory architecture.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
