import { Reveal } from "@/components/landing/reveal";
import { Inbox, Copy, EyeOff } from "lucide-react";

const problems = [
  {
    icon: Inbox,
    title: "Lost in the inbox",
    text: "Complaints arrive through calls, social media, and messaging apps — fragmented and easy to lose.",
  },
  {
    icon: Copy,
    title: "Duplicated reports",
    text: "The same pothole gets reported a dozen times, splitting attention and inflating numbers.",
  },
  {
    icon: EyeOff,
    title: "No follow-through",
    text: "Most reports are never tracked to resolution — citizens are left in the dark.",
  },
];

export function Problem() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-warm">
            The problem
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-white">
            Cities receive thousands of complaints a day. Most are never tracked.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
            Calls, social media, and messaging apps flood municipal desks with
            unstructured reports that are difficult to track, duplicated, or
            never followed up. CivicEye centralizes the entire reporting
            process — from citizen submission to municipal resolution — with AI
            assisting at every stage.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="card h-full p-6 transition-colors hover:border-white/20">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <p.icon className="h-5 w-5 text-amber-warm/70" />
                </div>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}