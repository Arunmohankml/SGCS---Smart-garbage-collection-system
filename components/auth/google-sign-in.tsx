"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.15-4.08 1.15-3.13 0-5.78-2.12-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.35.6 4.6 1.8l3.44-3.45A11.99 11.99 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.76 12 4.76Z"
      />
    </svg>
  );
}

export function GoogleSignIn({ role = "citizen" }: { role?: "citizen" | "authority" }) {
  const router = useRouter();
  const { user, loginCitizen, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      loginCitizen("Demo Citizen", "citizen@civiceye.gov");
      setLoading(false);
      router.push("/issues");
    }, 400);
  };

  if (user && user.role === "citizen") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-white/20 bg-zinc-900 p-4 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black mb-2">
            <User className="h-5 w-5" />
          </div>
          <p className="text-xs font-mono font-bold text-white">SIGNED IN AS CITIZEN</p>
          <p className="text-sm font-bold text-white mt-1">{user.name}</p>
          <p className="text-xs font-mono text-zinc-400">{user.email}</p>
        </div>

        <Button onClick={logout} variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4 text-white" /> Logout Session
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleSignIn} disabled={loading} size="lg" className="w-full font-sans font-bold">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Simulate Google Sign-In (Demo)
      </Button>
      <p className="text-[11px] font-mono text-center text-zinc-500">
        Demo login saves session state into localStorage automatically.
      </p>
    </div>
  );
}