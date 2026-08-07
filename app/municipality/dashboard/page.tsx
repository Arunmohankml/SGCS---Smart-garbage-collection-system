import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { MunicipalityDashboard } from "@/components/municipality/dashboard";

export const metadata: Metadata = {
  title: "Municipality Dashboard — CivicEye Authority Console",
  description:
    "Manage, prioritize, and resolve citizen complaints by department in real-time.",
};

export default function MunicipalityDashboardPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-32">
        <MunicipalityDashboard />
      </main>
      <Footer />
    </>
  );
}