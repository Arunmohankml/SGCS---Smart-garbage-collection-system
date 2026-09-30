"use client";

import { useMemo, useState } from "react";
import {
  Search,
  LayoutGrid,
  ListFilter,
  MapPin,
  X,
  Truck,
  Leaf,
  Recycle,
  Cpu,
  Package,
  AlertTriangle,
  Sparkles,
  Building2,
} from "lucide-react";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueDrawer } from "@/components/issues/issue-drawer";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  MUNICIPALITIES,
  type Issue,
  type IssueCategory,
  type IssueStatus,
} from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";

const CategoryIcons: Record<string, any> = {
  organic_kitchen: Leaf,
  dry_recyclable: Recycle,
  electronic_ewaste: Cpu,
  bulky_debris: Package,
  hazardous_sanitary: AlertTriangle,
  garden_green: Sparkles,
  all: LayoutGrid,
};

const statusTabs: { label: string; value: "all" | IssueStatus }[] = [
  { label: "All Pickups", value: "all" },
  { label: "Pending", value: "open" },
  { label: "Crew Dispatched", value: "in_progress" },
  { label: "Collected", value: "resolved" },
];

type SortOption = "priority" | "votes" | "recent";

export function IssuesExplorer({ limit }: { limit?: number }) {
  const { issues, upvoteIssue } = useIssuesStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | IssueStatus>("all");
  const [cat, setCat] = useState<"all" | IssueCategory>("all");
  const [municipality, setMunicipality] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const filtered = useMemo(() => {
    let result = issues.filter((issue) => {
      if (tab !== "all" && issue.status !== tab) return false;
      if (cat !== "all" && issue.category !== cat) return false;
      if (municipality !== "all" && issue.municipality !== municipality) return false;

      const haystack = (
        issue.title +
        issue.description +
        (issue.address || "") +
        (issue.landmark || "") +
        (issue.municipality || "") +
        (issue.assignedCrew || "") +
        issue.reference
      ).toLowerCase();

      if (query && !haystack.includes(query.toLowerCase())) return false;
      return true;
    });

    if (sortBy === "priority") {
      result.sort((a, b) => b.priorityScore - a.priorityScore);
    } else if (sortBy === "votes") {
      result.sort((a, b) => b.votes - a.votes);
    } else if (sortBy === "recent") {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [issues, query, tab, cat, municipality, sortBy, limit]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Top Filter & Toolbar Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Large Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by address, landmark, ward, or tracking code..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white text-slate-900"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Municipality Ward Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">All Municipality Wards</option>
              {MUNICIPALITIES.map((mun) => (
                <option key={mun} value={mun}>
                  {mun}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statusTabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "rounded-full border px-4 py-2 font-bold text-xs transition-all shadow-2xs",
                  tab === t.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Waste Category Chips Bar */}
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCat("all")}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                cat === "all"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              All Types
            </button>
            {(Object.keys(CATEGORY_LABELS) as IssueCategory[])
              .filter((c) => c !== "pothole" && c !== "garbage" && c !== "other")
              .map((c) => {
                const Icon = CategoryIcons[c] || LayoutGrid;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                      cat === c
                        ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{CATEGORY_LABELS[c]}</span>
                  </button>
                );
              })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="priority">Urgency Priority</option>
              <option value="votes">Community Requests</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Collection Cards */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <Truck className="mx-auto h-10 w-10 text-slate-400 mb-3" />
            <p className="text-base font-bold text-slate-900">No collection requests found</p>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Try adjusting your ward or waste type filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onSelect={(iss) => setSelectedIssue(iss)}
                onVote={(id) => upvoteIssue(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Drawer when Card is Clicked */}
      {selectedIssue && (
        <IssueDrawer
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onVote={(id) => upvoteIssue(id)}
        />
      )}
    </div>
  );
}