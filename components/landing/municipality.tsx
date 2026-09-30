import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Municipality() {
  return (
    <section className="relative py-24 border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
            Government Administration
          </div>
          <h2 className="awwwards-h2 text-slate-900 font-bold max-w-xl text-3xl sm:text-4xl">
            Modern Municipal Dispatch & Fleet Management
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600 font-medium awwwards-body text-base">
            CivicEye gives government sanitation administrators a centralized, categorized dispatch console. Review incoming household pickup requests by ward, dispatch collection crews with vehicles in one click, and require completion photos before closing cases.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Categorized views by Ward & Waste Type",
            "One-click sanitation crew & vehicle dispatch",
            "Mandatory collection proof photo verification",
            "Live doorstep GPS & Google Maps navigation",
            "Real-time citizen status notifications",
            "Spam and duplicate pickup filtering",
          ].map((feature, i) => (
            <Reveal key={feature} delay={i * 60}>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all duration-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-slate-800 tracking-wide">{feature}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-10">
            <Link href="/municipality">
              <Button size="lg" variant="primary" className="font-bold px-8 py-4 h-13 rounded-full flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border-none shadow-sm uppercase text-xs tracking-wider">
                Open Admin Dispatch Console <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}