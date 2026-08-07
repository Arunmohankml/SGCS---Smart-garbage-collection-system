import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Search } from "lucide-react";

export function Cta() {
  return (
    <section className="relative py-24 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="awwwards-h2 text-slate-900 font-bold mb-4">
          Ready to Improve Your Neighborhood?
        </h2>
        <p className="mt-4 text-slate-600 font-medium awwwards-body text-base max-w-lg mx-auto">
          Snap a photo and report any local pothole, lighting, water, or waste issues in less than 1 minute.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/report">
            <Button size="lg" variant="primary" className="flex items-center gap-2 text-sm font-bold px-8 py-3.5 h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm uppercase tracking-wider">
              <Plus className="h-4 w-4" /> Report Problem Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/issues">
            <Button size="lg" variant="outline" className="flex items-center gap-2 text-sm font-bold px-8 py-3.5 h-13 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-xs uppercase tracking-wider">
              <Search className="h-4 w-4 text-blue-650" /> Browse Issues Feed
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}