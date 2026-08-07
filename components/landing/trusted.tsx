import { Reveal } from "@/components/landing/reveal";

const communities = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Kochi", "Mumbai", "Delhi", "Ahmedabad"];

export function TrustedBy() {
  return (
    <section className="border-y border-white/5 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-soft">
            Trusted by communities across India
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {communities.map((c) => (
              <span
                key={c}
                className="text-lg font-semibold text-white/25 transition-colors hover:text-white/60"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}