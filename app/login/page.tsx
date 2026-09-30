import type { Metadata } from "next";
import Link from "next/link";
import { CitizenLogin } from "@/components/auth/citizen-login";
import { Logo } from "@/components/ui/logo";
import { UserCheck, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Citizen Sign In — SGCS",
  description: "Sign in to track your personal doorstep garbage collection requests and status updates.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 py-20">
      <div className="bg-grid absolute inset-0 -z-10 opacity-50" />
      <Link href="/" className="mb-8">
        <Logo size="lg" />
      </Link>

      <div className="card w-full max-w-md p-7 sm:p-8 bg-white border border-slate-200 shadow-xl rounded-3xl">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              Citizen Portal
            </span>
            <h1 className="text-xl font-extrabold text-slate-900">Citizen Sign In</h1>
          </div>
        </div>

        <CitizenLogin />
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          ← Return Home
        </Link>
        <span>·</span>
        <Link
          href="/municipality"
          className="text-blue-600 hover:underline flex items-center gap-1.5"
        >
          <Building2 className="h-3.5 w-3.5" /> Government Admin Login →
        </Link>
      </div>
    </main>
  );
}