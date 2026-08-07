import { Reveal } from "@/components/landing/reveal";
import {
  Tag,
  Ban,
  Gauge,
  Circle,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  Construction,
  Ellipsis,
} from "lucide-react";

const categories = [
  { icon: Circle, label: "Potholes" },
  { icon: Trash2, label: "Garbage Overflow" },
  { icon: Droplets, label: "Water Leakage" },
  { icon: Lightbulb, label: "Streetlight Outages" },
  { icon: Waves, label: "Drainage Blockage" },
  { icon: Construction, label: "Road Damage" },
  { icon: Ellipsis, label: "Other Public Works" },
];

const aiFeatures = [
  {
    icon: Tag,
    title: "Smart Categorization",
    text: "Automatically classifies photo evidence into the correct category with urgency ranking.",
  },
  {
    icon: Ban,
    title: "Duplicate & Spam Filtering",
    text: "Detects duplicate complaints in the same street and clusters them into single master tickets.",
  },
  {
    icon: Gauge,
    title: "Priority Dispatch Engine",
    text: "Ranks safety hazards based on community upvotes, severity, and nearby traffic.",
  },
];

export function AiFeatures() {
  return (
    <section id="ai" className="relative py-24 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="awwwards-h2 text-slate-900 font-bold max-w-xl">
            Intelligent Complaint Processing
          </h2>
          <p className="mt-3 text-slate-650 font-medium awwwards-body text-base max-w-xl">
            Ensuring every report is verified, prioritized, and sent to the right department.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {aiFeatures.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="card h-full p-8 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm hover:border-slate-350 hover:bg-slate-50/50 transition-all duration-200 flex flex-col items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-wide leading-none">{f.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-600">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-10 border border-slate-200 rounded-3xl bg-slate-50 p-8 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Supported Categories:</p>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-250 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-350 transition-colors"
                >
                  <c.icon className="h-4 w-4 text-blue-600" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}