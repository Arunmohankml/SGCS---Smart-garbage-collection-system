import { Reveal } from "@/components/landing/reveal";
import { ChevronRight, CircleCheck, Circle } from "lucide-react";

const phases = [
  {
    status: "done",
    title: "Phase 1",
    date: "Launched",
    items: ["AI categorization", "Spam detection", "Priority scoring", "Public transparency record"],
  },
  {
    status: "done",
    title: "Phase 2",
    date: "Q2 2026",
    items: ["Municipality dashboard", "Community verification", "Completion proof upload"],
  },
  {
    status: "current",
    title: "Phase 3",
    date: "Q3 2026",
    items: ["Multi-city rollout", "Mobile app", "Deep analytics"],
  },
  {
    status: "upcoming",
    title: "Phase 4",
    date: "Q4 2026",
    items: ["Predictive dispatch", "Budget analytics", "Open API for partners"],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-warm">
            Roadmap
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-white">
            Building civic infrastructure, one phase at a time
          </h2>
        </Reveal>

        <div className="mt-10 space-y-6">
          {phases.map((phase, i) => (
            <Reveal key={phase.title} delay={i * 80}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  {phase.status === "done" ? (
                    <CircleCheck className="h-5 w-5 text-sage" />
                  ) : phase.status === "current" ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber-warm bg-amber-warm/10">
                      <span className="h-2 w-2 rounded-full bg-amber-warm" />
                    </span>
                  ) : (
                    <Circle className="h-5 w-5 text-zinc-600" />
                  )}
                  {i < phases.length - 1 && (
                    <div className="mt-2 flex-1 border-l border-white/10" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-base font-semibold text-white">
                      {phase.title}
                    </h3>
                    <span className="text-xs text-zinc-300">{phase.date}</span>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}