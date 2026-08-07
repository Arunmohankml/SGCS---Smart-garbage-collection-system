import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { Logo } from "@/components/ui/logo";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — CivicEye",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900 px-4 py-24">
      <div className="bg-grid absolute inset-0 -z-10 opacity-50" />
      <Link href="/" className="mb-8">
        <Logo />
      </Link>

      <div className="card w-full max-w-sm p-8 bg-white border-slate-200 shadow-xl rounded-2xl">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Citizen Sign In</h1>
            <p className="text-xs font-semibold text-slate-500">Quick & secure account access</p>
          </div>
        </div>
        <GoogleSignIn role="citizen" />
        <p className="mt-6 text-center text-xs font-semibold text-slate-500">
          By continuing you agree to the Civic Portal Terms of Use.
        </p>
      </div>

      <Link
        href="/municipality"
        className="mt-6 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        Are you a municipal authority? Go to City Portal →
      </Link>
    </main>
  );
}