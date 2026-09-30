import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { IssuesExplorer } from "@/components/issues/issues-explorer";
import { AiFeatures } from "@/components/landing/ai-features";
import { Municipality } from "@/components/landing/municipality";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Top Hero Section */}
        <Hero />

        {/* Primary Focus: Live Public Waste Collection Tracker */}
        <section id="issues-feed" className="py-24 border-b border-slate-200 bg-slate-100/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                <Truck className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> LIVE MUNICIPAL SANITATION FEED
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                Active Waste Collections in Your Municipality
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Real-time doorstep pickup requests, assigned sanitation crews, and collected verification proofs.
              </p>
            </div>

            <Link
              href="/issues"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Track All Collection Requests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <IssuesExplorer limit={6} />
        </section>

        {/* Secondary Visual Feature Sections */}
        <AiFeatures />
        <Municipality />
        <div id="faq">
          <Faq />
        </div>
        <Cta />
      </main>
      <Footer />
    </>
  );
}