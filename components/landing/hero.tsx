import Link from "next/link";
import { ArrowRight, Plus, Search, ShieldCheck, Truck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-44 pb-60 border-b border-slate-200 bg-slate-50">
      {/* Background Animated WebP Video with Soft Bluish Blend & Less Opacity */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated WebP Image Background with decreased opacity */}
        <img
          src="/hero_bg.webp"
          alt="Civic Action Background"
          className="absolute inset-0 h-full w-full object-cover opacity-35 filter hue-rotate-190 contrast-110"
        />

        {/* Soft Bluish Tint Gradient Overlay - Fades fully to bg color at the bottom to blend & fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/10 via-blue-100/10 to-slate-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/40 bg-white/70 px-4 py-2 text-xs font-bold text-blue-900 shadow-2xs backdrop-blur-md mb-12">
          <ShieldCheck className="h-4 w-4 text-blue-600 animate-pulse" />
          <span>Smart Government & Citizen Waste Collection System</span>
        </div>

        {/* Clean, Elegant Semibold Heading - Larger Font Size */}
        <h1 className="text-slate-900 font-semibold tracking-tight text-4xl sm:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.12] font-sans">
          Smart Doorstep &
          <br />
          Community Waste Collection.
        </h1>

        {/* Clean, Readable, Minimal Description - Larger Font Size and spacing */}
        <p className="mt-10 text-slate-650 font-medium text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
          SGCS connects citizens directly with municipal sanitation departments. Request doorstep or neighborhood garbage collection from your home, and municipal admins dispatch collection vehicles in real-time.
        </p>

        {/* Primary Action Buttons - Larger spacing */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link href="/report">
            <Button
              size="lg"
              variant="primary"
              className="flex items-center gap-2 text-sm font-bold px-8 py-4 h-13 rounded-full bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30 text-white shadow-md shadow-blue-600/20 uppercase tracking-wider backdrop-blur-md"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" /> Request Garbage Pickup <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/my-reports">
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2 text-sm font-bold px-8 py-4 h-13 rounded-full border border-slate-300 text-slate-800 bg-white/80 hover:bg-white shadow-xs uppercase tracking-wider backdrop-blur-md"
            >
              <ClipboardList className="h-4 w-4 text-blue-600" /> My Reports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}