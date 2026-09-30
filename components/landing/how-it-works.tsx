import { Reveal } from "@/components/landing/reveal";
import {
  CalendarClock,
  MapPin,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const simpleSteps = [
  {
    icon: CalendarClock,
    title: "1. Schedule Pickup",
    text: "Select your municipality ward and choose your waste type (wet, recyclable, e-waste, bulky).",
  },
  {
    icon: MapPin,
    title: "2. Pin Doorstep",
    text: "Provide your house address, landmark, and optional photo of the waste items.",
  },
  {
    icon: Truck,
    title: "3. Crew Dispatched",
    text: "Government admin assigns a dedicated sanitation vehicle and dispatches people to collect it.",
  },
  {
    icon: CheckCircle2,
    title: "4. Collected & Cleared",
    text: "Sanitation crew clears the waste and uploads a completion photo proof to close the ticket.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Simple 4-Step Process
          </div>
          <h2 className="awwwards-h2 text-slate-900 font-bold text-3xl sm:text-4xl">
            How CivicEye Waste Collection Works
          </h2>
          <p className="mt-2 text-base font-medium text-slate-600 max-w-xl">
            A seamless on-demand waste collection cycle connecting households with city sanitation fleets.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {simpleSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="card h-full p-6 bg-white border border-slate-200 rounded-3xl shadow-xs hover:border-blue-300 transition-all">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                  <s.icon className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}