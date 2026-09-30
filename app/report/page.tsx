import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ReportForm } from "@/components/report/report-form";

export const metadata: Metadata = {
  title: "Request Waste Pickup — CivicEye Smart Sanitation",
  description:
    "Schedule on-demand doorstep or neighborhood garbage collection with your local municipality.",
};

export default function ReportPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 px-4 pb-24 pt-36">
        <div className="mx-auto mb-10 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
            Municipal Doorstep Collection
          </div>
          <h1 className="awwwards-h2 text-slate-900 leading-tight tracking-[-0.02em] font-bold text-3xl sm:text-4xl">
            Request Waste Collection
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">
            Select your municipality ward, choose the waste category, and your local government sanitation department will dispatch a collection vehicle directly to your home.
          </p>
        </div>
        <ReportForm />
      </main>
      <Footer />
    </>
  );
}