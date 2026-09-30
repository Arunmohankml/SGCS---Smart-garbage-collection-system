import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const links = {
  Services: [
    { label: "Request Waste Pickup", href: "/report" },
    { label: "My Reports", href: "/my-reports" },
    { label: "Citizen Sign In", href: "/login" },
    { label: "Ward Admin Desk", href: "/municipality" },
  ],
  Operations: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Frequently Asked Questions", href: "/#faq" },
    { label: "Admin Dispatch Console", href: "/municipality/dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 font-medium">
              SGCS — Smart Garbage Collection System. Transparent, on-demand doorstep waste pickup and municipal fleet dispatching.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs font-semibold text-slate-400">
          &copy; {new Date().getFullYear()} SGCS — Smart Garbage Collection System.
        </div>
      </div>
    </footer>
  );
}