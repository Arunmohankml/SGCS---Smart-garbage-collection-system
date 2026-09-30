import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { IssuesExplorer } from "@/components/issues/issues-explorer";
import { ShieldCheck, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Waste Collection Tracker — SGCS",
  description:
    "Track active doorstep and neighborhood garbage collections, assigned municipal sanitation vehicles, and verified cleanup proofs.",
};

export default function IssuesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-32">
        <div className="mx-auto mb-8 max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-900 mb-2 uppercase tracking-wider">
                  <Truck className="h-3.5 w-3.5 text-blue-600" /> LIVE MUNICIPAL COLLECTION TRACKER
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans tracking-tight">
                  Doorstep & Neighborhood Waste Queue
                </h1>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Municipal Sanitation
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              Track real-time garbage pickup requests across all municipal wards. Monitor which sanitation vehicle has been dispatched and view before/after collection proof photos.
            </p>
          </div>
        </div>

        <IssuesExplorer />
      </main>
      <Footer />
    </>
  );
}