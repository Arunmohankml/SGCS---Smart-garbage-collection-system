import { Reveal } from "@/components/landing/reveal";
import {
  Tag,
  Gauge,
  Leaf,
  Recycle,
  Cpu,
  Package,
  AlertTriangle,
  Sparkles,
  Truck,
  CheckCircle2,
} from "lucide-react";

const categories = [
  { icon: Leaf, label: "Kitchen & Wet Waste" },
  { icon: Recycle, label: "Dry Recyclables" },
  { icon: Cpu, label: "E-Waste & Electronics" },
  { icon: Package, label: "Bulky & Furniture" },
  { icon: AlertTriangle, label: "Hazardous & Sanitary" },
  { icon: Sparkles, label: "Garden & Green" },
];

const wasteFeatures = [
  {
    icon: Tag,
    title: "Instant Waste Segregation",
    text: "AI automatically identifies the waste type from photo uploads so the municipality dispatches the appropriate collection vehicle.",
  },
  {
    icon: Truck,
    title: "Smart Ward Dispatching",
    text: "Requests are grouped by municipality wards for route-optimized collection runs, minimizing municipal fuel and response time.",
  },
  {
    icon: CheckCircle2,
    title: "Doorstep Verification Proof",
    text: "Sanitation crews must photograph the cleared doorstep before closing the ticket, ensuring 100% service transparency.",
  },
];

export function AiFeatures() {
  return (
    <section id="ai" className="relative py-24 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
            Smart Sanitation Operations
          </div>
          <h2 className="awwwards-h2 text-slate-900 font-bold max-w-xl text-3xl sm:text-4xl">
            Streamlined Waste Logistics
          </h2>
          <p className="mt-3 text-slate-600 font-medium awwwards-body text-base max-w-xl">
            Empowering citizens to schedule pickups and giving municipal administrators total control over collection fleets.
          </p>
        </Reveal>

        {/* Feature Cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {wasteFeatures.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="card h-full p-8 bg-slate-50 border border-slate-200 rounded-3xl shadow-xs hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 flex flex-col items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                  <f.icon className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Category Pills Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center sm:text-left">
            Supported Waste Categories:
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {categories.map((c) => (
              <div
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs"
              >
                <c.icon className="h-4 w-4 text-blue-600" />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}