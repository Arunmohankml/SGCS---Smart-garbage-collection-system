import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-sm font-bold text-base",
  secondary:
    "bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 font-semibold",
  outline:
    "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-semibold shadow-xs",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold",
  danger:
    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold",
  accent:
    "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700 shadow-sm font-bold",
};

const sizes = {
  sm: "h-9 px-4 text-xs font-semibold",
  md: "h-11 px-5 text-sm font-semibold",
  lg: "h-13 px-7 text-base font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

