"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
  Trash2,
  UploadCloud,
  Truck,
  Recycle,
  Building2,
  Phone,
  UserCheck,
  Package,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MUNICIPALITIES,
  CATEGORY_LABELS,
  type Issue,
  type IssueCategory,
  type IssueStatus,
} from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";
import { useAuth } from "@/lib/auth";

const crewOptions = [
  "Sanitation Truck #01 - Morning Shift",
  "Eco-Recycle Van #03 - Dry Waste Team",
  "Heavy Haulage Truck #08 - Bulky Unit",
  "Green Squad #04 - Organic Logistics",
  "Bio-Hazard Van #02 - Specialized Handling",
];

export function MunicipalityDashboard() {
  const { issues, updateStatus, dispatchCrew, deleteIssue } = useIssuesStore();
  const { user } = useAuth();

  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Crew dispatch assignment modal/inline state
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string>(crewOptions[0]);

  // Local state for uploaded collection proof images
  const [proofImages, setProofImages] = useState<Record<string, string>>({});

  // Filter requests categorized by Municipality, Category, and Status
  const visible = issues.filter((i) => {
    const matchesWard = selectedWard === "all" || i.municipality === selectedWard;
    const matchesCategory = selectedCategory === "all" || i.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "pending"
        ? i.status === "open"
        : selectedStatus === "dispatched"
        ? i.status === "in_progress"
        : selectedStatus === "collected"
        ? i.status === "resolved"
        : true;

    return matchesWard && matchesCategory && matchesStatus;
  });

  const totalCount = issues.length;
  const pendingCount = issues.filter((i) => i.status === "open").length;
  const dispatchedCount = issues.filter((i) => i.status === "in_progress").length;
  const collectedCount = issues.filter((i) => i.status === "resolved").length;

  const handleDispatch = (issueId: string) => {
    setUpdatingId(issueId);
    setTimeout(() => {
      dispatchCrew(issueId, selectedCrew);
      setUpdatingId(null);
      setDispatchingId(null);
    }, 400);
  };

  const handleProofImageChange = (issueId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImages((prev) => ({ ...prev, [issueId]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCollection = (issueId: string) => {
    setUpdatingId(issueId);
    setTimeout(() => {
      updateStatus(issueId, "resolved", proofImages[issueId]);
      setUpdatingId(null);
      setProofImages((prev) => {
        const copy = { ...prev };
        delete copy[issueId];
        return copy;
      });
    }, 450);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Admin Authority Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            Government Administration
          </div>
          <h1 className="awwwards-h2 text-slate-900 font-bold tracking-tight text-2xl sm:text-3xl">
            Sanitation & Waste Dispatch Console
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Categorized citizen requests, on-demand sanitation crew dispatching, and doorstep collection verification.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-900 shrink-0">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          <span>{user?.municipality || "Municipal Sanitation Officer"}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            icon: Package,
            label: "Total Requests",
            value: totalCount,
            bg: "bg-slate-50 border-slate-200 text-slate-800",
          },
          {
            icon: AlertCircle,
            label: "Pending Pickup",
            value: pendingCount,
            bg: "bg-amber-50/70 border-amber-200 text-amber-900",
          },
          {
            icon: Truck,
            label: "Crews En Route",
            value: dispatchedCount,
            bg: "bg-blue-50/70 border-blue-200 text-blue-900",
          },
          {
            icon: CheckCircle2,
            label: "Collected & Cleared",
            value: collectedCount,
            bg: "bg-emerald-50/70 border-emerald-200 text-emerald-900",
          },
        ].map((k) => (
          <div
            key={k.label}
            className={cn(
              "rounded-2xl p-5 border shadow-2xs transition-all duration-200 flex flex-col justify-between h-28",
              k.bg
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">{k.label}</span>
              <k.icon className="h-4 w-4 opacity-70" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Categorized Filter Controls */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        {/* Filter 1: By Municipality Ward */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Categorize by Municipality Ward:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedWard("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                selectedWard === "all"
                  ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              All Wards ({issues.length})
            </button>
            {MUNICIPALITIES.map((mun) => {
              const count = issues.filter((i) => i.municipality === mun).length;
              return (
                <button
                  key={mun}
                  onClick={() => setSelectedWard(mun)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                    selectedWard === mun
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {mun} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter 2: By Waste Category */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            2. Categorize by Waste Type:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
                selectedCategory === "all"
                  ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              All Types
            </button>
            {(Object.keys(CATEGORY_LABELS) as IssueCategory[])
              .filter((c) => c !== "pothole" && c !== "garbage" && c !== "other")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
                    selectedCategory === cat
                      ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
          </div>
        </div>

        {/* Filter 3: By Status */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            3. Filter by Status:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Statuses" },
              { id: "pending", label: "Pending Pickup" },
              { id: "dispatched", label: "Crew En Route" },
              { id: "collected", label: "Collected & Cleared" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                  selectedStatus === st.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Queue */}
      <div className="mt-8 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="bg-slate-50/80 px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Active Collection Queue ({visible.length} Requests Found)
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Categorized by {selectedWard === "all" ? "All Wards" : selectedWard}
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium text-sm">
            No collection requests match your selected categories.
          </div>
        ) : (
          visible.map((issue) => {
            const mainImage = issue.images?.find((img) => img.kind === "report")?.url || issue.images?.[0]?.url;
            const resolutionImage = issue.images?.find((img) => img.kind === "resolution")?.url;

            return (
              <div
                key={issue.id}
                className="flex flex-col gap-5 p-6 hover:bg-slate-50/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  {/* Photo & Info */}
                  <div className="flex gap-4 items-start sm:items-center min-w-0 flex-1">
                    {/* Images display */}
                    <div className="relative shrink-0 flex gap-2">
                      {mainImage ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={mainImage}
                            alt="Waste photo"
                            className="h-20 w-28 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                            loading="lazy"
                          />
                          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            Citizen Photo
                          </span>
                        </div>
                      ) : (
                        <div className="h-20 w-28 shrink-0 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">No Photo</span>
                        </div>
                      )}

                      {resolutionImage && (
                        <div className="flex flex-col items-center">
                          <img
                            src={resolutionImage}
                            alt="Collected proof"
                            className="h-20 w-28 rounded-2xl object-cover border border-emerald-300 shadow-2xs"
                            loading="lazy"
                          />
                          <span className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">
                            Collected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <StatusBadge status={issue.status} />
                        <span className="font-mono text-xs text-slate-400 font-semibold">
                          #{issue.reference}
                        </span>
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-900">
                          {issue.municipality || "Poonamallee"}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {CATEGORY_LABELS[issue.category] || "Waste"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {issue.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1 text-slate-800">
                          <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          {issue.address || issue.landmark || "Doorstep Location"}
                        </span>
                        {issue.pickupWindow && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            Slot: {issue.pickupWindow}
                          </span>
                        )}
                        {issue.contactPhone && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {issue.contactPhone}
                          </span>
                        )}
                        {issue.assignedCrew && (
                          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                            <Truck className="h-3.5 w-3.5" />
                            Crew: {issue.assignedCrew}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <a
                      href={`https://www.google.com/maps?q=${issue.location?.lat || 12.9716},${issue.location?.lng || 77.5946}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs h-11"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                      Map
                    </a>

                    {/* Action 1: Pending -> Dispatch Crew ("Send people to collect it") */}
                    {issue.status === "open" && (
                      <button
                        onClick={() => setDispatchingId(dispatchingId === issue.id ? null : issue.id)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.98] border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 h-11"
                      >
                        <Truck className="h-4 w-4" />
                        Send People / Dispatch Crew
                      </button>
                    )}

                    {/* Action 2: In Progress -> Upload Proof & Mark Collected */}
                    {issue.status === "in_progress" && (
                      proofImages[issue.id] ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={proofImages[issue.id]}
                            alt="Resolution Proof Thumbnail"
                            className="h-11 w-11 rounded-xl object-cover border border-slate-200"
                          />
                          <button
                            onClick={() => handleConfirmCollection(issue.id)}
                            disabled={updatingId === issue.id}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-[0.98] border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 h-11"
                          >
                            {updatingId === issue.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 stroke-[3]" />
                            )}
                            Confirm Collected
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
                            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs h-11"
                          >
                            <UploadCloud className="h-4 w-4 text-amber-600" />
                            Upload Collection Proof
                          </label>
                        </div>
                      )
                    )}

                    {/* Case Completed */}
                    {issue.status === "resolved" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200 h-11">
                        <Check className="h-4 w-4 stroke-[3]" /> Collected & Cleared
                      </span>
                    )}

                    {/* Delete Report Button for Municipal Admin */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete garbage request #${issue.reference}?`)) {
                          deleteIssue(issue.id);
                        }
                      }}
                      className="inline-flex items-center justify-center p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors h-11 shadow-2xs"
                      title="Delete Request"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Dispatch Drawer when clicking "Send People" */}
                {dispatchingId === issue.id && (
                  <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Assign Sanitation Crew / Vehicle:
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Dispatch team to {issue.address || issue.landmark}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={selectedCrew}
                        onChange={(e) => setSelectedCrew(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        {crewOptions.map((crew) => (
                          <option key={crew} value={crew}>
                            {crew}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDispatch(issue.id)}
                        disabled={updatingId === issue.id}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        {updatingId === issue.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <UserCheck className="h-3.5 w-3.5" />
                        )}
                        Confirm Dispatch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}