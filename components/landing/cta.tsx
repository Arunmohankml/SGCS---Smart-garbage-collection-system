import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, ClipboardList } from "lucide-react";

export function Cta() {
  return (
    <section className="relative py-24 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="awwwards-h2 text-slate-900 font-bold mb-4 text-3xl sm:text-4xl">
          Ready to Schedule Your Waste Pickup?
        </h2>
        <p className="mt-4 text-slate-600 font-medium awwwards-body text-base max-w-lg mx-auto">
          Request doorstep garbage or recyclable collection in less than 1 minute. Your municipal sanitation department dispatches a collection vehicle right to your home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/report">
            <Button
              size="lg"
              variant="primary"
              className="flex items-center gap-2 text-sm font-bold px-8 py-4 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-600/20 uppercase tracking-wider"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" /> Request Garbage Pickup <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/my-reports">
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2 text-sm font-bold px-8 py-4 h-13 rounded-full border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 shadow-xs uppercase tracking-wider"
            >
              <ClipboardList className="h-4 w-4 text-blue-600" /> My Reports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}