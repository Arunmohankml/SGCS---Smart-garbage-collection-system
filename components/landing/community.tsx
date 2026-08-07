import { Reveal } from "@/components/landing/reveal";
import { Users, MessageCircle, CheckCircle2 } from "lucide-react";

export function Community() {
  return (
    <section className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/4 top-1/2 h-80 w-80 animate-blob rounded-full bg-sage/[0.04] blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-warm">
            Community
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-white">
            Verified by the people it affects
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            Every report is public record. Citizens verify whether fixes are
            real — creating accountability that no closed system can match.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              value: "14.8K",
              label: "Reports filed",
              sub: "Across 42 partner cities",
            },
            {
              icon: MessageCircle,
              value: "84.2%",
              label: "Resolution rate",
              sub: "Above national average",
            },
            {
              icon: CheckCircle2,
              value: "2.8d",
              label: "Avg. dispatch time",
              sub: "From report to action",
            },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="card p-6 transition-colors hover:border-white/20">
                <stat.icon className="mb-3 h-5 w-5 text-amber-warm/60" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-xs text-zinc-300">{stat.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}