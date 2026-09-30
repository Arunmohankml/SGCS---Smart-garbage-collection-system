import { Recycle } from "lucide-react";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 text-white shadow-md shadow-emerald-500/20 shrink-0 ${className}`}
    >
      <Recycle className="h-5 w-5 stroke-[2.5]" />
    </div>
  );
}

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const iconSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-10 w-10";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const subtitleSize = size === "sm" ? "text-[8px]" : "text-[9px]";

  return (
    <span className={className ? className : "inline-flex items-center gap-3"}>
      <LogoMark className={iconSize} />
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight text-slate-900 font-sans ${titleSize}`}>
          SGCS
        </span>
        <span className={`font-bold tracking-widest text-slate-500 uppercase mt-0.5 ${subtitleSize}`}>
          Smart Sanitation
        </span>
      </div>
    </span>
  );
}