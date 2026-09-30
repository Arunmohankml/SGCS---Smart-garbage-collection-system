"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, LogOut, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { MUNICIPALITIES } from "@/lib/types";

const municipalityOptions = MUNICIPALITIES.map((m) => `${m} Municipality`);

export function MunicipalityLogin() {
  const router = useRouter();
  const { user, loginAuthority, logout } = useAuth();
  const [selectedMuni, setSelectedMuni] = useState(municipalityOptions[0]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAuthority(selectedMuni);
      setLoading(false);
      router.push("/municipality/dashboard");
    }, 400);
  };

  if (user && user.role === "authority") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center flex flex-col items-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white mb-3 shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Authorized Session</p>
          <p className="text-base font-bold text-slate-900 mt-2 leading-tight">{user.name}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => router.push("/municipality/dashboard")} variant="primary" size="md" className="flex items-center justify-center gap-1.5 h-12 text-sm font-bold rounded-xl shadow-xs">
            Console <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={logout} variant="outline" size="md" className="flex items-center justify-center gap-1.5 h-12 text-sm font-semibold text-slate-700 rounded-xl hover:bg-slate-50">
            <LogOut className="h-4 w-4 text-slate-500" /> Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">
          Select Municipal Jurisdiction:
        </label>
        <select
          value={selectedMuni}
          onChange={(e) => setSelectedMuni(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-350 cursor-pointer h-13 shadow-2xs"
        >
          {municipalityOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-slate-900 font-semibold">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleLogin}
        disabled={loading}
        size="lg"
        className="w-full font-bold text-sm uppercase tracking-wider h-13 rounded-xl flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
        variant="primary"
      >
        <ShieldCheck className="h-5 w-5" /> Sign In as {selectedMuni.split(" — ")[0]} Officer
      </Button>

      <p className="text-[10px] font-semibold text-center text-slate-400 uppercase tracking-wide">
        Saves credentials to browser local storage.
      </p>
    </div>
  );
}
