import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { MunicipalityLogin } from "@/components/auth/municipality-login";
import { Building2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Municipality Authority Portal — CivicEye",
  description:
    "Official authority login and department dispatch console for public complaint management.",
};

export default function MunicipalityLoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 py-28">
        <div className="card w-full max-w-md p-8 bg-white border-slate-200 shadow-xl rounded-2xl">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">
                CITY AUTHORITY PORTAL
              </span>
              <h1 className="text-xl font-extrabold text-slate-900">Municipality Sign In</h1>
            </div>
          </div>

          <MunicipalityLogin />

          <p className="mt-6 text-center text-xs font-semibold text-slate-500">
            Select your city department jurisdiction above to authenticate.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm font-bold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            ← Return Home
          </Link>
          <span>·</span>
          <Link
            href="/municipality/dashboard"
            className="text-blue-600 hover:underline font-extrabold"
          >
            Go to Authority Console →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}