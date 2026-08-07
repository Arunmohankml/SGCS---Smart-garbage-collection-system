export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Broadcast waves above pin */}
      <path d="M28 22 C40 12, 60 12, 72 22" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M35 30 C44 23, 56 23, 65 30" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Blue Map Pin with Eye */}
      <path d="M50 36 C35 36, 24 47, 24 61 C24 77, 50 95, 50 95 C50 95, 76 77, 76 61 C76 47, 65 36, 50 36 Z" fill="#2563eb" />

      {/* Outer White Eye Circle */}
      <circle cx="50" cy="58" r="14" fill="white" />

      {/* Blue Pupil */}
      <circle cx="50" cy="58" r="8.5" fill="#2563eb" />

      {/* Specular Catchlight Dot */}
      <circle cx="53.5" cy="55" r="2.5" fill="white" />

      {/* Shadow Ellipse Underneath */}
      <ellipse cx="50" cy="98" rx="20" ry="2.5" fill="#bfdbfe" opacity="0.8" />
    </svg>
  );
}

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span className={className ? className : "inline-flex items-center gap-2.5"}>
      <LogoMark className={size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"} />
      <div className="flex flex-col leading-tight">
        <span
          className={
            "font-extrabold tracking-tight text-slate-900 font-sans " +
            (size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl")
          }
        >
          Civic<span className="text-blue-600">Eye</span>
        </span>
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Citizen Portal
        </span>
      </div>
    </span>
  );
}