import { Reveal } from "@/components/landing/reveal";
import { StatusBadge } from "@/components/ui/badge";
import { mockIssues } from "@/lib/mock";
import { CATEGORY_LABELS } from "@/lib/types";

const bars = [
  { label: "Resolved", value: 73, className: "bg-sage" },
  { label: "In progress", value: 18, className: "bg-amber-warm" },
  { label: "Open", value: 9, className: "bg-zinc-400" },
];

export function DashboardPreview() {
  const recent = mockIssues.slice(0, 4);
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-warm">
            Live preview
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-white">
            One dashboard. Every issue. Real status.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Latest reports</p>
                  <p className="text-xs text-zinc-300">From citizens in your area</p>
                </div>
                <StatusBadge status="open" />
              </div>
              <div className="divide-y divide-white/[0.06]">
                {recent.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {CATEGORY_LABELS[issue.category]}
                      </p>
                      <p className="truncate text-xs text-zinc-300">
                        {issue.landmark || issue.address}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-zinc-300">AI {issue.priorityScore}</span>
                      <StatusBadge status={issue.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="card p-5">
                <p className="text-sm font-medium text-white">Resolution status</p>
                <div className="mt-4 space-y-3">
                  {bars.map((b) => (
                    <div key={b.label}>
                      <div className="mb-1 flex justify-between text-xs text-zinc-300">
                        <span>{b.label}</span>
                        <span>{b.value}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={"h-full rounded-full " + b.className}
                          style={{ width: `${b.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card flex-1 p-5">
                <p className="text-sm font-medium text-white">AI priority queue</p>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "Water Leakage", score: 90 },
                    { label: "Pothole", score: 82 },
                    { label: "Garbage", score: 74 },
                  ].map((q) => (
                    <div
                      key={q.label}
                      className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2"
                    >
                      <span className="text-sm text-white">{q.label}</span>
                      <span className="text-xs text-amber-warm">{q.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}