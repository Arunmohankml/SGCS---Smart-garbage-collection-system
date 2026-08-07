"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, X, Building2, Flame, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type ResolutionVote } from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";

export function IssueDetail() {
  const params = useParams<{ id: string }>();
  const { issues } = useIssuesStore();
  const issue = issues.find((i) => i.id === params.id);
  const [vote, setVote] = useState<ResolutionVote | null>(null);
  const [verification, setVerification] = useState(issue?.verification || { fixed: 3, stillExists: 0, voters: [] });

  if (!issue) {
    return (
      <div className="py-24 text-center text-slate-600 font-medium text-base">
        Complaint case not found.{" "}
        <Link href="/issues" className="text-blue-600 font-bold underline ml-1">
          Return to live issues feed
        </Link>
      </div>
    );
  }

  const castVote = (v: ResolutionVote) => {
    setVote(v);
    setVerification((prev) => ({
      ...prev,
      fixed: prev.fixed + (v === "fixed" ? 1 : 0),
      stillExists: prev.stillExists + (v === "still_exists" ? 1 : 0),
    }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <Link
        href="/issues"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Public Feed
      </Link>

      {/* Main Ticket Card */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-md rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-slate-600 tracking-wider">
              {issue.reference}
            </span>
            <span className="rounded-md border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
              {CATEGORY_LABELS[issue.category]}
            </span>
          </div>
          <StatusBadge status={issue.status} />
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          {issue.title}
        </h1>

        {/* Image Gallery */}
        {issue.images && issue.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {issue.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Issue photo ${i + 1}`}
                className="rounded-xl border border-slate-200 bg-slate-50 object-cover aspect-video w-full"
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Metadata badges */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700">
          <a
            href={`https://www.google.com/maps?q=${issue.location?.lat || 13.0827},${issue.location?.lng || 80.2707}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-blue-900 font-extrabold hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            {issue.landmark || issue.address || "Location pinned"} (Show in Map)
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            {issue.department || "Municipal Works Desk"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-blue-900 font-extrabold">
            <Flame className="h-4 w-4 text-blue-600" />
            Priority Score {issue.priorityScore}/100
          </span>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Complaint Description
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base font-medium text-slate-800 leading-relaxed">
            {issue.description || "No description provided."}
          </div>
        </div>

        {/* Community Verification Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 block text-xs">AI Category Confidence</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">
              {Math.round(issue.aiCategoryConfidence * 100)}% Match
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-slate-500 block text-xs">Community Upvotes</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">
              {issue.votes} Citizen Votes
            </span>
          </div>
        </div>
      </div>

      {/* Citizen Verification Section */}
      {issue.status === "resolved" && (
        <div className="card mt-6 p-6 sm:p-8 bg-white border border-slate-200 shadow-md rounded-2xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">Marked Fixed by Municipal Crew</p>
              <p className="text-xs font-bold text-slate-500">
                Are you in the neighbourhood? Verify if the issue is actually resolved.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="primary" className="py-4 text-base" onClick={() => castVote("fixed")} disabled={!!vote}>
              <Check className="h-5 w-5" /> Verify Fixed
            </Button>
            <Button variant="secondary" className="py-4 text-base" onClick={() => castVote("still_exists")} disabled={!!vote}>
              <X className="h-5 w-5" /> Report Unfixed
            </Button>
          </div>

          {vote && (
            <p className="mt-4 text-center text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              ✓ Thank you! Your verification vote has been saved.
            </p>
          )}
        </div>
      )}
    </div>
  );
}