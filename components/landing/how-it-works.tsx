import { Reveal } from "@/components/landing/reveal";
import {
  Camera,
  MapPin,
  Building2,
  CheckCircle2,
  ImageUp,
  Vote,
  Sparkles,
} from "lucide-react";

const simpleSteps = [
  {
    icon: Camera,
    title: "1. Snap a Photo",
    text: "Take a quick picture of the problem using your phone camera.",
  },
  {
    icon: MapPin,
    title: "2. Pin Location",
    text: "GPS automatically attaches your location address.",
  },
  {
    icon: Building2,
    title: "3. Sent to City Desk",
    text: "Your local municipality receives the complaint immediately.",
  },
  {
    icon: CheckCircle2,
    title: "4. Crew Repairs It",
    text: "City workers repair the damage and mark it fixed.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-900">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Simple 4-Step Process
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 font-sans">
            How CivicEye Helps You
          </h2>
          <p className="mt-1 text-base font-semibold text-slate-600 max-w-xl">
            Designed to be extremely simple so anyone can report a problem in under 1 minute.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {simpleSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="card h-full p-6 bg-white border border-slate-200 shadow-sm hover:border-blue-400">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-sans">{s.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}