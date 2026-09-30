"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  X,
  LogOut,
  User,
  Building2,
  Plus,
  Truck,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/issues", label: "Pickup Tracker", icon: Truck },
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
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300">
      <nav
        className={cn(
          "flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ease-in-out border",
          scrolled
            ? "bg-white/95 border-slate-200/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
            : "bg-white/90 border-slate-200/70 shadow-md shadow-slate-900/5 backdrop-blur-md"
        )}
      >
        {/* Brand Logo: SGCS */}
        <Link
          href="/"
          aria-label="SGCS Home"
          className="flex items-center gap-2 shrink-0 transition-transform duration-200 hover:scale-102"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 border border-slate-200/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200 rounded-full whitespace-nowrap",
                  isActive
                    ? "bg-white text-blue-700 shadow-xs font-extrabold"
                    : "text-slate-650 hover:text-slate-950 hover:bg-white/60 font-semibold"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-2 text-xs font-bold text-blue-900 whitespace-nowrap">
                {user.role === "authority" ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                ) : (
                  <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                )}
                <span>{user.name.split(" ")[0]}</span>
              </div>

              <button
                onClick={logout}
                className="rounded-full bg-white border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>

              <Link href="/report">
                <button className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 whitespace-nowrap">
                  <Plus className="h-4 w-4 stroke-[2.5]" /> Request Pickup
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/municipality">
                <button className="h-10 px-4 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 rounded-full transition-colors whitespace-nowrap flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  Admin Sign In
                </button>
              </Link>

              <Link href="/report">
                <button className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 whitespace-nowrap">
                  <Plus className="h-4 w-4 stroke-[2.5]" /> Request Pickup
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle button */}
        <button
          className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {open && (
        <div className="mt-2 w-full rounded-3xl bg-white/95 border border-slate-200 p-5 shadow-2xl backdrop-blur-xl animate-fade-in lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-100 pt-3 mt-1 flex flex-col gap-2">
              <Link href="/report" onClick={() => setOpen(false)}>
                <button className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-600 text-white flex items-center justify-center gap-2 shadow-sm">
                  <Plus className="h-4 w-4" /> Request Pickup
                </button>
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full h-11 text-xs font-bold text-slate-700 border border-slate-200 rounded-full flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              ) : (
                <Link href="/municipality" onClick={() => setOpen(false)}>
                  <button className="w-full h-11 text-xs font-bold text-slate-700 border border-slate-200 rounded-full flex items-center justify-center gap-2 hover:bg-slate-50">
                    <Building2 className="h-4 w-4 text-blue-600" /> Admin Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
