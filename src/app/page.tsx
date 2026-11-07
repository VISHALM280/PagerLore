import { Navbar } from "@/components/layout/Navbar";
import { TemporalHeroSection } from "@/components/landing/TemporalHeroSection";
import { TimeReversalSequence } from "@/components/landing/TimeReversalSequence";
import { HistoryRepeatsSection } from "@/components/landing/HistoryRepeatsSection";
import { MemoryEngineSection } from "@/components/landing/MemoryEngineSection";
import { InvestigationExperienceSection } from "@/components/landing/InvestigationExperienceSection";
import { TemporalFinalSection } from "@/components/landing/TemporalFinalSection";
import { Logo } from "@/components/common/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#25352D] flex flex-col selection:bg-[#267B5B]/20 selection:text-[#194B38]">
      {/* Dynamic Editorial Navbar with Dark/Light Scroll Contrast */}
      <Navbar />

      {/* Cinematic Temporal Narrative Sections */}
      <main className="flex-1">
        {/* 1. Hero: The Temporal Clock & Rewind Premise */}
        <TemporalHeroSection />

        {/* 2. Interactive Scroll-Driven Time Reversal Sequence */}
        <TimeReversalSequence />

        {/* 3. History Repeats: Tribal Knowledge Loss & Recurring Anti-Patterns */}
        <HistoryRepeatsSection />

        {/* 4. The Memory Engine: Retain, Recall, Reflect with 3D Knowledge Network */}
        <MemoryEngineSection />

        {/* 5. Investigation Experience: 7-Stage SRE Walkthrough */}
        <InvestigationExperienceSection />

        {/* 6. Final Section: Look Back. Learn Faster. Move Forward */}
        <TemporalFinalSection />
      </main>

      {/* Editorial Minimal Footer */}
      <footer className="border-t border-[#E9E8DF] bg-[#FFFFFF] py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="text-xs font-mono text-[#788579] text-center sm:text-right">
            <div>PagerLore · Intelligent Incident Response Platform</div>
            <div className="mt-0.5 text-[#9A9C91]">
              Engineering remembers. Powered by Hindsight persistent memory.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
