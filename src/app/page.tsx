import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { IntelligencePipeline } from "@/components/landing/IntelligencePipeline";
import { ProductPreviewSection } from "@/components/landing/ProductPreviewSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { Logo } from "@/components/common/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#25352D] flex flex-col">
      {/* Editorial Navbar */}
      <Navbar />

      {/* Main Narrative Sections */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <IntelligencePipeline />
        <ProductPreviewSection />
        <FinalCtaSection />
      </main>

      {/* Editorial Minimal Footer */}
      <footer className="border-t border-[#E9E8DF] bg-[#FFFFFF] py-12 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <div className="text-xs font-mono text-[#788579] text-center sm:text-right">
            <div>PagerLore · Intelligent Incident Response Platform</div>
            <div className="mt-0.5 text-[#9A9C91]">Engineering remembers. Built with Hindsight persistent memory.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
