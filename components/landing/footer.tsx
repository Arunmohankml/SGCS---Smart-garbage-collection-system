import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const links = {
  Services: [
    { label: "Report an Issue", href: "/report" },
    { label: "Browse Public Feed", href: "/issues" },
    { label: "Municipal Authority Desk", href: "/municipality" },
  ],
  Governance: [
    { label: "How It Works", href: "/#workflow" },
    { label: "Frequently Asked Questions", href: "/#faq" },
    { label: "City Partner Console", href: "/municipality/dashboard" },
  ],
};


export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 font-medium">
              CivicEye bridges citizens and municipal governance. Transparent, accessible, and community-driven civic complaint tracking.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
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
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs font-semibold text-slate-500">
          &copy; {new Date().getFullYear()} CivicEye Public Governance Portal. Built for all citizens.
        </div>
      </div>
    </footer>
  );
}