"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, type Issue, type IssueStatus } from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";
import { useAuth } from "@/lib/auth";

const nextStatus: Record<IssueStatus, IssueStatus | null> = {
  open: "in_progress",
  in_progress: "resolved",
  resolved: null,
  reopened: "in_progress",
  rejected: null,
};

export function MunicipalityDashboard() {
  const { issues, updateStatus, deleteIssue } = useIssuesStore();
  const { user } = useAuth();
  const [department, setDepartment] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Local state to keep track of uploaded resolution proof images (issue.id -> base64)
  const [proofImages, setProofImages] = useState<Record<string, string>>({});

  const visible =
    department === "all"
      ? issues
      : issues.filter((i) => i.department === DEPARTMENTS.find((d) => d.id === department)?.name);

  const openCount = issues.filter((i) => i.status === "open").length;
  const inProgress = issues.filter((i) => i.status === "in_progress").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;

  const advance = (issue: Issue) => {
    const next = nextStatus[issue.status];
    if (!next) return;
    setUpdatingId(issue.id);
    setTimeout(() => {
      updateStatus(issue.id, next);
      setUpdatingId(null);
    }, 400);
  };

  const handleProofImageChange = (issueId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImages((prev) => ({ ...prev, [issueId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* Clean Single Authority Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="awwwards-h2 text-slate-900 font-bold tracking-tight text-2xl sm:text-3xl">
            Department Dispatch Console
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Review complaints, dispatch repair crews, and update resolution statuses in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-900 shrink-0">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>{user?.municipality || "Municipality 1 — Central Ward"}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: AlertCircle,
            label: "Open Complaints",
            value: openCount,
            bg: "bg-amber-50/60 border-amber-200/80 text-amber-900",
            badgeColor: "bg-amber-100 text-amber-800",
          },
          {
            icon: Clock,
            label: "Work In Progress",
            value: inProgress,
            bg: "bg-blue-50/60 border-blue-200/80 text-blue-900",
            badgeColor: "bg-blue-100 text-blue-800",
          },
          {
            icon: CheckCircle2,
            label: "Resolved Complaints",
            value: resolved,
            bg: "bg-emerald-50/60 border-emerald-200/80 text-emerald-900",
            badgeColor: "bg-emerald-100 text-emerald-800",
          },
        ].map((k) => (
          <div
            key={k.label}
            className={cn(
              "rounded-2xl p-6 border shadow-xs transition-all duration-200 flex flex-col justify-between h-32",
              k.bg
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{k.label}</span>
              <k.icon className="h-5 w-5 opacity-70" />
            </div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Department Switcher Pills */}
      <div className="mt-10">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Filter by Department:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDepartment("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 shadow-2xs",
              department === "all"
                ? "border-blue-600 bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold"
            )}
          >
            All Departments
          </button>
          {DEPARTMENTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDepartment(d.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 shadow-2xs",
                department === d.id
                  ? "border-blue-600 bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold"
              )}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Complaint Queue */}
      <div className="mt-8 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {visible.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium text-sm">
            No complaints found for this department filter.
          </div>
        ) : (
          visible.map((issue) => {
            const next = nextStatus[issue.status];
            const mainImage = issue.images?.[0]?.url;
            const resolutionImage = issue.images?.find((img) => img.kind === "resolution")?.url;

            // Sanitize title to remove duplicate words like "Issue Issue"
            const cleanTitle = issue.title
              .replace(/Issue Issue/gi, "Issue")
              .replace(/Reported Reported/gi, "Reported");

            return (
              <div
                key={issue.id}
                className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex gap-4 items-center min-w-0 flex-1">
                  {mainImage ? (
                    <div className="relative shrink-0 flex gap-2">
                      <div className="flex flex-col items-center">
                        <img
                          src={mainImage}
                          alt={cleanTitle}
                          className="h-20 w-28 rounded-2xl object-cover border border-slate-150 shadow-2xs"
                          loading="lazy"
                        />
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Before</span>
                      </div>
                      
                      {resolutionImage && (
                        <div className="flex flex-col items-center">
                          <img
                            src={resolutionImage}
                            alt="Resolution proof"
                            className="h-20 w-28 rounded-2xl object-cover border border-emerald-150 shadow-2xs"
                            loading="lazy"
                          />
                          <span className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">Fixed</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-20 w-28 shrink-0 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400">
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No image</span>
                    </div>
                  )}

                  <div className="min-w-0 flex-1 ml-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={issue.status} />
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        #{issue.reference}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[10px] font-bold text-slate-600">
                        {issue.department || "Municipal Desk"}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                      {cleanTitle}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        {issue.landmark || issue.address || "Pinned on map"}
                      </span>
                      <span>• Upvotes: {issue.votes}</span>
                      <span>• Priority: {issue.priorityScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
                  <a
                    href={`https://www.google.com/maps?q=${issue.location?.lat || 13.0827},${issue.location?.lng || 80.2707}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs h-11"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                    Show in Map
                  </a>

                  {next ? (
                    next === "resolved" ? (
                      proofImages[issue.id] ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={proofImages[issue.id]}
                            alt="Resolution Proof Thumbnail"
                            className="h-11 w-11 rounded-xl object-cover border border-slate-200"
                          />
                          <button
                            onClick={() => {
                              setUpdatingId(issue.id);
                              setTimeout(() => {
                                updateStatus(issue.id, "resolved", proofImages[issue.id]);
                                setUpdatingId(null);
                                setProofImages((prev) => {
                                  const copy = { ...prev };
                                  delete copy[issue.id];
                                  return copy;
                                });
                              }, 450);
                            }}
                            disabled={updatingId === issue.id}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.98] border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 h-11"
                          >
                            {updatingId === issue.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 stroke-[3]" />
                            )}
                            Confirm & Resolve
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id={`proof-upload-${issue.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleProofImageChange(issue.id, file);
                            }}
                          />
                          <label
                            htmlFor={`proof-upload-${issue.id}`}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-amber-250 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs h-11"
                          >
                            <UploadCloud className="h-4 w-4 text-amber-600" />
                            Upload Fixed Image
                          </label>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => advance(issue)}
                        disabled={updatingId === issue.id}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.98] border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 h-11"
                      >
                        {updatingId === issue.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        Start Repair Work
                      </button>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 h-11">
                      <Check className="h-4 w-4 stroke-[3]" /> Case Closed
                    </span>
                  )}

                  {/* Delete Report Button for Municipal Authority Members */}
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this complaint report?")) {
                        deleteIssue(issue.id);
                      }
                    }}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors h-11 shadow-2xs"
                    title="Delete Report"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}