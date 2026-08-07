"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, X, Building2, Flame, ShieldCheck, Image as ImageIcon } from "lucide-react";
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
      <div className="py-24 text-center text-slate-650 font-medium text-base">
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

  const reportImage = issue.images?.find((img) => img.kind === "report")?.url || issue.images?.[0]?.url;
  const resolutionImage = issue.images?.find((img) => img.kind === "resolution")?.url;

  return (
    <div className="mx-auto max-w-4xl px-4">
      <Link
        href="/issues"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Public Feed
      </Link>

      {/* Main Ticket Card */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-500 tracking-wider">
              #{issue.reference}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              {CATEGORY_LABELS[issue.category]}
            </span>
          </div>
          <StatusBadge status={issue.status} />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {issue.title}
        </h1>

        {/* Dynamic Photo Comparison: Before vs. After Resolved proof */}
        {issue.images && issue.images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider z-10">
                Before: Reported Issue
              </span>
              <img
                src={reportImage}
                alt="Original reported civic issue"
                className="object-cover aspect-video w-full transition-transform duration-300 hover:scale-102"
                loading="lazy"
              />
            </div>

            {/* After Photo Proof */}
            {resolutionImage ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-emerald-50/10 shadow-sm">
                <span className="absolute top-3 left-3 bg-emerald-600 px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider z-10 flex items-center gap-1 shadow-md">
                  <Check className="h-3 w-3 stroke-[3]" /> After: Fixed & Resolved
                </span>
                <img
                  src={resolutionImage}
                  alt="Resolution proof fixed image"
                  className="object-cover aspect-video w-full transition-transform duration-300 hover:scale-102"
                  loading="lazy"
                />
              </div>
            ) : (
              // Fallback if multiple images uploaded at report time but not fixed yet
              issue.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {issue.images.filter((img) => img.url !== reportImage).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`Additional photo ${i + 1}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 object-cover aspect-video w-full"
                      loading="lazy"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Metadata badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
          <a
            href={`https://www.google.com/maps?q=${issue.location?.lat || 13.0827},${issue.location?.lng || 80.2707}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-blue-900 font-bold hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>{issue.landmark || issue.address || "Location pinned"} (Google Maps)</span>
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            {issue.department || "Municipal Works Desk"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-blue-900 font-bold">
            <Flame className="h-4 w-4 text-blue-600" />
            Priority Score {issue.priorityScore}/100
          </span>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Complaint Description
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 leading-relaxed">
            {issue.description || "No description provided."}
          </div>
        </div>

        {/* Community Verification Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <span className="text-slate-400 block text-xs">AI Category Confidence</span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {Math.round(issue.aiCategoryConfidence * 100)}% Match
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <span className="text-slate-400 block text-xs">Community Upvotes</span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {issue.votes} Citizen Votes
            </span>
          </div>
        </div>
      </div>

      {/* Citizen Verification Section */}
      {issue.status === "resolved" && (
        <div className="card mt-6 p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Marked Fixed by Municipal Crew</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Are you in the neighbourhood? Verify if the issue is actually resolved.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="primary" className="py-4 text-sm font-bold rounded-xl h-12 uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => castVote("fixed")} disabled={!!vote}>
              <Check className="h-5 w-5" /> Verify Fixed
            </Button>
            <Button variant="secondary" className="py-4 text-sm font-bold rounded-xl h-12 uppercase tracking-wide border border-slate-350 text-slate-700 hover:bg-slate-50 bg-white" onClick={() => castVote("still_exists")} disabled={!!vote}>
              <X className="h-5 w-5" /> Report Unfixed
            </Button>
          </div>

          {vote && (
            <p className="mt-4 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 rounded-xl p-3 uppercase tracking-wider">
              ✓ Thank you! Your verification vote has been saved.
            </p>
          )}
        </div>
      )}
    </div>
  );
}