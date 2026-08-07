"use client";

import { Reveal } from "@/components/landing/reveal";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is CivicEye?",
    a: "CivicEye is an easy public portal for citizens to report potholes, water leaks, broken streetlights, or garbage problems. Reports are sent directly to your local city municipality to fix.",
  },
  {
    q: "Is CivicEye free to use?",
    a: "Yes! CivicEye is completely free for all citizens and senior community members.",
  },
  {
    q: "How do I report a problem?",
    a: "Just click '+ Report a Problem' at the top, take or upload a photo, tap 'Detect Location', and click submit. It takes under 1 minute!",
  },
  {
    q: "Can I check if my reported problem has been fixed?",
    a: "Yes. Every report appears on the live public feed. You can check its status (Open, In Progress, or Resolved) anytime.",
  },
  {
    q: "Who fixes the complaints?",
    a: "Local municipal departments (such as Road Works, Water Sanitation, and Electrical Services) receive your complaint and dispatch field crews to repair it.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<string | null>(faqs[0].q);

  return (
    <section id="faq" className="py-24 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="awwwards-h2 text-slate-900 font-bold text-center mb-4">
            Have Questions? We Have Answers.
          </h2>
          <p className="mt-3 text-slate-600 font-medium awwwards-body text-base text-center max-w-md mx-auto">
            Everything you need to know about reporting, tracking, and municipal resolutions.
          </p>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="card overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl shadow-2xs hover:border-slate-300 transition-colors">
                <button
                  className="flex w-full items-center justify-between p-6 text-left font-bold text-slate-900 text-base"
                  onClick={() => setOpen(open === f.q ? null : f.q)}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-blue-600 transition-transform duration-200 ${
                      open === f.q ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === f.q && (
                  <div className="px-6 pb-6 text-sm font-medium leading-relaxed text-slate-600 border-t border-slate-200/60 pt-4">
                    {f.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}