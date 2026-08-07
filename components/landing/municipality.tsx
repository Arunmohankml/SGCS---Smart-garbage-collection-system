import { Reveal } from "@/components/landing/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Municipality() {
  return (
    <section className="relative py-24 border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="awwwards-h2 text-slate-900 font-bold max-w-xl">
            Turn Citizen Complaints into Swift Field Action
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600 font-medium awwwards-body text-base">
            CivicEye provides municipal departments with a single, synchronized dispatch dashboard. Issues are automatically categorized, assigned to specialized field crews, and updated with completion proof.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Instant AI complaint categorization",
            "Priority dispatch ranking",
            "Community resolution voting",
            "Public record transparency",
            "Multi-jurisdiction municipal desks",
            "Real-time status updates",
          ].map((feature, i) => (
            <Reveal key={feature} delay={i * 60}>
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-slate-300 transition-all duration-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-semibold text-slate-800 tracking-wide">{feature}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-10">
            <Link href="/municipality">
              <Button size="lg" variant="primary" className="font-bold px-8 py-3.5 h-13 rounded-xl flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border-none shadow-sm uppercase text-xs tracking-wider">
                Access City Authority Console <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}