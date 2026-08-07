import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { IssuesExplorer } from "@/components/issues/issues-explorer";
import { ShieldCheck, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Public Issues Feed — CivicEye Community Portal",
  description:
    "Real-time public infrastructure complaint feed. Track reports, upvote local issues, and monitor municipal resolution dispatch.",
};

export default function IssuesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-28">
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 mb-2">
                  <HeartHandshake className="h-4 w-4 text-blue-600" /> PUBLIC TRANSPARENCY FEED
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
                  Public Infrastructure & Citizen Feed
                </h1>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified Municipal Governance
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              Browse reported complaints in your neighbourhood. Filter by category, vote to raise priority, and track repair status directly from your local city council.
            </p>
          </div>
        </div>

        <IssuesExplorer />
      </main>
      <Footer />
    </>
  );
}