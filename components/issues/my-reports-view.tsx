"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Truck,
  Building2,
  ChevronDown,
  Layers,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Filter,
  Plus,
  User,
  Phone,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueDrawer } from "@/components/issues/issue-drawer";
import {
  CATEGORY_LABELS,
  type Issue,
  type IssueCategory,
  type IssueStatus,
} from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";
import { useAuth } from "@/lib/auth";

type SortOption = "recent" | "priority";

export function MyReportsView() {
  const { user } = useAuth();
  const { getMyReports, upvoteIssue, issues } = useIssuesStore();

  const myReports = useMemo(() => {
    return getMyReports(user);
  }, [getMyReports, user, issues]);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | IssueStatus>("all");
  const [cat, setCat] = useState<"all" | IssueCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const resetFilters = () => {
    setQuery("");
    setTab("all");
    setCat("all");
    setSortBy("recent");
  };

  const hasActiveFilters = Boolean(query) || tab !== "all" || cat !== "all" || sortBy !== "recent";

  const filtered = useMemo(() => {
    let result = myReports.filter((issue) => {
      if (tab !== "all" && issue.status !== tab) return false;
      if (cat !== "all" && issue.category !== cat) return false;

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
    } else if (sortBy === "recent") {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [myReports, query, tab, cat, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Citizen Profile Status Banner */}
      <div className="mb-6 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <ClipboardList className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                Personal Sanitation Queue
              </span>
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {myReports.length} {myReports.length === 1 ? "Request" : "Requests"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {user?.role === "citizen" ? `${user.name}'s Collection Requests` : "My Doorstep Waste Pickups"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user?.role === "citizen" ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/80 border border-blue-200/80 rounded-2xl px-4 py-2">
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span>{user.name}</span>
              {user.phone && <span className="text-slate-400">({user.phone})</span>}
            </div>
          ) : (
            <Link href="/login">
              <button className="text-xs font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-2xl px-4 py-2 flex items-center gap-1.5 transition-colors shadow-2xs">
                <User className="h-3.5 w-3.5" /> Sign In to Link Phone
              </button>
            </Link>
          )}

          <Link href="/report">
            <button className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20">
              <Plus className="h-4 w-4 stroke-[2.5]" /> Request Pickup
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Bar (Only shown when there are reports or filters active) */}
      {myReports.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          {/* Top Search & Reset Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your requests by address, tracking code, or waste type..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-xs font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white text-slate-900"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Clean Expandable Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            {/* 1. Waste Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-600" />
                Waste Category
              </label>
              <div className="relative">
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as "all" | IssueCategory)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-xs font-bold text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="all">All Waste Types</option>
                  {(Object.keys(CATEGORY_LABELS) as IssueCategory[])
                    .filter((c) => c !== "pothole" && c !== "garbage" && c !== "other")
                    .map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* 2. Pickup Status Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Pickup Status
              </label>
              <div className="relative">
                <select
                  value={tab}
                  onChange={(e) => setTab(e.target.value as "all" | IssueStatus)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-xs font-bold text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Pending Pickup</option>
                  <option value="in_progress">Crew Dispatched / En Route</option>
                  <option value="resolved">Doorstep Collected</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* 3. Sort By Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-purple-600" />
                Sort Priority
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-9 text-xs font-bold text-slate-800 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="recent">Most Recent First</option>
                  <option value="priority">Urgency Priority Score</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div>
        {filtered.length === 0 ? (
          myReports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                <ClipboardList className="h-8 w-8 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Pickup Requests Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-6">
                You haven&apos;t scheduled any doorstep garbage collections yet. Need a pickup for wet kitchen waste, dry recyclables, e-waste, or bulky items?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/report">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all">
                    <Plus className="h-4 w-4" /> Request Doorstep Pickup
                  </button>
                </Link>
                {!user && (
                  <Link href="/login">
                    <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all">
                      <User className="h-4 w-4" /> Citizen Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                <Filter className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-slate-900">No reports match your filters</p>
              <p className="text-xs font-medium text-slate-500 mt-1 mb-4">
                Try selecting a different waste category or status filter.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
              </button>
            </div>
          )
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
