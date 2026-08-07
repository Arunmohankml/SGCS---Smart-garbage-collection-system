"use client";

import { useMemo, useState } from "react";
import {
  Search,
  LayoutGrid,
  ListFilter,
  Map,
  MapPin,
  X,
  ArrowUpDown,
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  Milestone,
} from "lucide-react";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueDrawer } from "@/components/issues/issue-drawer";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type Issue, type IssueCategory, type IssueStatus } from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";

const CategoryIcons: Record<IssueCategory, any> = {
  pothole: Construction,
  garbage: Trash2,
  water_leakage: Droplets,
  streetlight: Lightbulb,
  drainage: Waves,
  road_damage: Milestone,
  other: MapPin,
};

const statusTabs: { label: string; value: "all" | IssueStatus }[] = [
  { label: "All Cases", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

type ViewMode = "grid" | "list" | "map";
type SortOption = "priority" | "votes" | "recent";

export function IssuesExplorer({ limit }: { limit?: number }) {
  const { issues, upvoteIssue } = useIssuesStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | IssueStatus>("all");
  const [cat, setCat] = useState<"all" | IssueCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const filtered = useMemo(() => {
    let result = issues.filter((issue) => {
      if (tab !== "all" && issue.status !== tab) return false;
      if (cat !== "all" && issue.category !== cat) return false;
      const haystack = (
        issue.title +
        issue.description +
        (issue.address || "") +
        (issue.landmark || "") +
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
  }, [issues, query, tab, cat, sortBy, limit]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Top Filter & Toolbar Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Large Readable Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by street name, landmark, or issue type..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-10 text-base font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white text-slate-900 shadow-xs"
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

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
            {statusTabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  "rounded-xl border px-4 py-2 font-bold text-xs transition-all shadow-xs",
                  tab === t.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCat("all")}
              className={cn(
                "rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs",
                cat === "all"
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              All Categories
            </button>
            {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map((c) => {
              const Icon = CategoryIcons[c];
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5",
                    cat === c
                      ? "border-blue-600 bg-blue-50 text-blue-800 font-extrabold"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-blue-600" />
                  <span>{CATEGORY_LABELS[c]}</span>
                </button>
              );
            })}

          </div>

          {/* Sort & View Mode controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto pt-2 sm:pt-0">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
              <ArrowUpDown className="h-4 w-4 text-blue-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-bold outline-none cursor-pointer text-slate-900"
              >
                <option value="recent">Sort: Newest First</option>
                <option value="votes">Sort: Most Upvoted</option>
                <option value="priority">Sort: Priority Rank</option>
              </select>
            </div>

            <div className="flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid Cards"
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  viewMode === "grid" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="Table View"
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  viewMode === "list" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <ListFilter className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                title="Map Pin View"
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  viewMode === "map" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSelect={(iss) => setSelectedIssue(iss)}
              onVote={upvoteIssue}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "list" && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="p-4">Case Reference</th>
                <th className="p-4">Complaint Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Landmark / Area</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-slate-900">{issue.reference}</td>
                  <td className="p-4 font-bold text-slate-900">{issue.title}</td>
                  <td className="p-4 font-semibold">{CATEGORY_LABELS[issue.category]}</td>
                  <td className="p-4 text-slate-600">{issue.landmark || issue.address || "Location pinned"}</td>
                  <td className="p-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900">{issue.votes} Upvotes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map View */}
      {viewMode === "map" && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 relative min-h-[420px] rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="rounded-xl border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 uppercase">
                Interactive City GIS Map
              </span>
              <span className="text-xs font-bold text-slate-600">
                {filtered.length} Pins Placed
              </span>
            </div>

            <div className="relative my-6 h-64 w-full rounded-xl border border-slate-200 bg-white flex items-center justify-center p-4 shadow-inner">
              <div className="relative w-full h-full">
                {filtered.map((issue, idx) => {
                  const leftPos = `${15 + (idx * 24) % 70}%`;
                  const topPos = `${20 + (idx * 31) % 60}%`;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      style={{ left: leftPos, top: topPos }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 z-10"
                    >
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-600 text-white p-2 shadow-md border-2 border-white">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="mt-1 rounded-md bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold whitespace-nowrap">
                          {issue.reference}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Click any pin to inspect the complaint details and resolution progress.
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="card p-4 bg-white border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-slate-500">{issue.reference}</span>
                  <StatusBadge status={issue.status} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{issue.title}</h4>
                <p className="mt-1 text-xs text-slate-500 truncate">{issue.landmark || issue.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero Results State */}
      {filtered.length === 0 && (
        <div className="card mt-6 p-12 text-center bg-white border-slate-200">
          <p className="text-base font-bold text-slate-700">
            No complaint tickets match your selected filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setTab("all");
              setCat("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Drawer slide-over modal */}
      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onVote={upvoteIssue}
      />
    </div>
  );
}