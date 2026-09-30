import { cn } from "@/lib/utils";
import { STATUS_LABELS, type IssueStatus } from "@/lib/types";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700",
        className
      )}
    >
      {children}
    </span>
  );
}

const statusStyles: Record<IssueStatus, string> = {
  open: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  in_progress: "bg-blue-100 text-blue-900 border-blue-300 font-bold",
  resolved: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold",
  cancelled: "bg-slate-100 text-slate-600 border-slate-300 font-normal line-through",
  reopened: "bg-red-100 text-red-900 border-red-300 font-bold",
  rejected: "bg-slate-100 text-slate-600 border-slate-300 font-normal line-through",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  const isInProgress = status === "in_progress";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-xs",
        statusStyles[status] || statusStyles.open
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "resolved"
            ? "bg-emerald-600"
            : isInProgress
            ? "animate-pulse bg-blue-600"
            : "bg-amber-600"
        )}
      />
      {STATUS_LABELS[status] || status}
    </span>
  );
}