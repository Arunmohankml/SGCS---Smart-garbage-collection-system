"use client";

import { Reveal } from "@/components/landing/reveal";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is SGCS Smart Garbage Collection?",
    a: "SGCS (Smart Garbage Collection System) is a dedicated public portal connecting citizens directly with municipal sanitation departments. When you have garbage at home or in your community, you can request a pickup online, and government admins dispatch crews to collect it.",
  },
  {
    q: "How do I request a waste pickup from my home?",
    a: "Just click 'Request Garbage Pickup', select your municipal ward, pick your waste category (wet, recyclables, e-waste, bulky, etc.), enter your address and preferred pickup window, and submit! It takes less than 1 minute.",
  },
  {
    q: "How do government admins dispatch collection crews?",
    a: "Municipal administrators log into the dispatch console, view incoming requests in a categorized manner (by ward, waste type, and urgency), assign a collection vehicle/crew, and send people to collect the waste.",
  },
  {
    q: "What types of waste can be collected?",
    a: "We support household wet/kitchen waste, dry recyclables (paper, plastic, cardboard, glass), electronic e-waste & appliances, bulky furniture/mattresses, hazardous/sanitary waste, and garden green clippings.",
  },
  {
    q: "How do I know when the garbage has been collected?",
    a: "The municipality crew must photograph the cleared doorstep upon collection. You can see the 'Collected & Cleared' status and the verified photo proof live in the public pickup tracker.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<string | null>(faqs[0].q);

  return (
    <section id="faq" className="py-24 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
            Common Questions
          </div>
          <h2 className="awwwards-h2 text-slate-900 font-bold text-3xl sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 font-medium awwwards-body text-base max-w-md">
            Everything you need to know about doorstep waste collection, municipal dispatching, and tracking.
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
                    className={`h-5 w-5 text-blue-600 transition-transform duration-200 shrink-0 ml-4 ${
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