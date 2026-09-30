"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Building2, CheckCircle2, LogOut, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { MUNICIPALITIES } from "@/lib/types";

interface CitizenLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function CitizenLogin({ onSuccess, redirectTo = "/my-reports" }: CitizenLoginProps) {
  const router = useRouter();
  const { user, loginCitizen, logout } = useAuth();

  const [name, setName] = useState(user?.role === "citizen" ? user.name : "");
  const [phone, setPhone] = useState(user?.role === "citizen" ? user.phone || "" : "");
  const [municipality, setMunicipality] = useState(
    user?.role === "citizen" ? user.municipality || MUNICIPALITIES[0] : MUNICIPALITIES[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginCitizen(name.trim(), phone.trim(), municipality);
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    }, 350);
  };

  const handleQuickLogin = (demoName = "Arun Mohan", demoPhone = "98451 22310", demoMun = "Poonamallee") => {
    setLoading(true);
    setTimeout(() => {
      loginCitizen(demoName, demoPhone, demoMun);
      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    }, 250);
  };

  // If already logged in as citizen
  if (user && user.role === "citizen") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white mb-2 shadow-xs">
            <User className="h-6 w-6" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Signed In as Citizen</p>
          <p className="text-base font-bold text-slate-900 mt-0.5">{user.name}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
            {user.phone && <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-blue-100"><Phone className="h-3 w-3 text-blue-600" /> {user.phone}</span>}
            {user.municipality && <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-blue-100"><Building2 className="h-3 w-3 text-blue-600" /> {user.municipality}</span>}
          </div>
        </div>

        <button
          onClick={() => router.push(redirectTo)}
          className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span>Continue to My Reports</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={logout}
          className="w-full h-10 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <LogOut className="h-4 w-4 text-slate-500" /> Sign Out Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Your Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arun Mohan"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition-colors focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Mobile Number (for pickup SMS/status)
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98451 22310"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition-colors focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Your Municipality Ward
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-xs font-semibold text-slate-900 outline-none transition-colors focus:border-blue-600 focus:bg-white"
            >
              {MUNICIPALITIES.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> Sign In as Citizen
            </>
          )}
        </button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Or Quick Access
        </span>
      </div>

      <button
        type="button"
        onClick={() => handleQuickLogin()}
        disabled={loading}
        className="w-full h-10 text-xs font-bold text-blue-700 border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5 text-blue-600" /> 1-Click Citizen Demo Login (Arun Mohan)
      </button>

      <p className="text-[11px] font-medium text-center text-slate-500">
        Saved securely in browser cache for seamless pickup tracking.
      </p>
    </div>
  );
}
