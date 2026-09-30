"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, LogOut, User, Building2, Plus, Megaphone, HelpCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/issues", label: "Pickup Tracker", icon: Megaphone },
  { href: "/municipality", label: "Ward Admin Desk", icon: Building2 },
  { href: "/#faq", label: "FAQ", icon: HelpCircle },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Bluish-White Floating Pill Navbar - Transparent initially, slides in background on scroll */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-all duration-300">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-350 ease-in-out",
            scrolled
              ? "bg-white/95 border border-slate-200/90 shadow-lg shadow-blue-950/5 backdrop-blur-xl"
              : "bg-transparent border-transparent shadow-none"
          )}
        >
          <div className="flex items-center gap-4">
            {/* Real Logo Component */}
            <Link
              href="/"
              aria-label="CivicEye Home"
              className="flex items-center gap-2 shrink-0 transition-transform duration-200 hover:scale-102"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links - Translucent white when transparent, slate when scrolled */}
            <div
              className={cn(
                "hidden items-center gap-1 p-1 rounded-full border transition-all duration-350 md:flex",
                scrolled
                  ? "bg-slate-100/90 border-slate-200/70"
                  : "bg-white/50 border-slate-200/30 backdrop-blur-md"
              )}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all duration-300 ease-out rounded-full uppercase tracking-wider",
                      isActive
                        ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/30 scale-102"
                        : "text-slate-800 hover:text-slate-950 hover:bg-white/80 font-bold"
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <div className="flex items-center gap-2">
                {/* User Session Info Pill */}
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all duration-350",
                    scrolled
                      ? "bg-slate-100 border-slate-200 text-slate-800"
                      : "bg-white/60 border-slate-200/40 text-slate-900 backdrop-blur-md"
                  )}
                >
                  {user.role === "authority" ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="rounded-full bg-white border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>

                {/* Report Action Button */}
                <Link href="/report">
                  <button className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20">
                    <Plus className="h-4 w-4 stroke-[2.5]" /> Schedule Pickup
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button
                    className={cn(
                      "h-10 px-4 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-350",
                      scrolled
                        ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
                        : "border-slate-200/50 bg-white/70 text-slate-900 hover:bg-white shadow-sm backdrop-blur-md"
                    )}
                  >
                    Sign In
                  </button>
                </Link>
                <Link href="/report">
                  <button className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20">
                    <Plus className="h-4 w-4 stroke-[2.5]" /> Schedule Pickup
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle button */}
          <button
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Menu Panel */}
        {open && (
          <div className="mt-2 w-full rounded-3xl bg-white/95 border border-slate-200 p-4 shadow-xl backdrop-blur-xl animate-fade-in md:hidden">
            <div className="flex flex-col gap-1.5">
              {user && (
                <div className="mb-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                      isActive
                        ? "bg-blue-600 text-white font-extrabold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-150 pt-3">
                <Link href="/report" onClick={() => setOpen(false)}>
                  <button className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5">
                    <Plus className="h-4 w-4 stroke-[2.5]" /> Report New Problem
                  </button>
                </Link>
                {!user && (
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <button className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all">
                      Sign In / Authority Access
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
