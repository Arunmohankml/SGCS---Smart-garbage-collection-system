import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ReportForm } from "@/components/report/report-form";

import { Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Report an Issue — CivicEye Portal",
  description:
    "Report potholes, garbage dumps, water leaks, or streetlight outages quickly to your city council.",
};

export default function ReportPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 px-4 pb-24 pt-36">
        <div className="mx-auto mb-10 max-w-2xl text-left">
          <h1 className="awwwards-h2 text-slate-900 leading-none tracking-[-0.03em] uppercase mb-2">
            File Citizen Report
          </h1>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            A photo and location are all we need. The city municipality will assign crews instantly.
          </p>
        </div>
        <ReportForm />
      </main>
      <Footer />
    </>
  );
}