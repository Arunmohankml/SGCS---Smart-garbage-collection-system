"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  MapPin,
  X,
  Truck,
  Building2,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
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
        Collection request not found.{" "}
        <Link href="/issues" className="text-blue-600 font-bold underline ml-1">
          Return to live collection queue
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <Link
        href="/issues"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Collection Queue
      </Link>

      {/* Main Ticket Card */}
      <div className="card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-500 tracking-wider">
              #{issue.reference}
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-900">
              {issue.municipality || "Poonamallee"}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-bold text-slate-700">
              {CATEGORY_LABELS[issue.category] || "Waste"}
            </span>
          </div>
          <StatusBadge status={issue.status} />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
          {issue.title}
        </h1>

        {/* Dynamic Photo Comparison: Before vs. After Collected proof */}
        {issue.images && issue.images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider z-10">
                Citizen Upload: Doorstep Waste
              </span>
              <img
                src={reportImage}
                alt="Citizen waste request"
                className="object-cover aspect-video w-full transition-transform duration-300 hover:scale-102"
                loading="lazy"
              />
            </div>

            {/* After Photo Proof */}
            {resolutionImage ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-emerald-50/10 shadow-sm">
                <span className="absolute top-3 left-3 bg-emerald-600 px-3 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider z-10 flex items-center gap-1 shadow-md">
                  <Check className="h-3 w-3 stroke-[3]" /> After: Collected & Cleared
                </span>
                <img
                  src={resolutionImage}
                  alt="Resolution proof collected image"
                  className="object-cover aspect-video w-full transition-transform duration-300 hover:scale-102"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center aspect-video">
                <Truck className="h-8 w-8 text-blue-500 mb-2 animate-bounce" />
                <span className="text-sm font-bold text-slate-800">
                  {issue.status === "in_progress" ? "Crew En Route" : "Awaiting Crew Assignment"}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Collection photo proof will appear here once cleared by municipal team.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Metadata badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
          <a
            href={`https://www.google.com/maps?q=${issue.location?.lat || 12.9716},${issue.location?.lng || 77.5946}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2 text-blue-900 font-bold hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>{issue.address || issue.landmark || "Doorstep Address"} (Open in Maps)</span>
          </a>

          {issue.assignedCrew && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-100/60 px-4 py-2 text-blue-900 font-bold">
              <Truck className="h-4 w-4 text-blue-600" />
              {issue.assignedCrew}
            </span>
          )}

          {issue.pickupWindow && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Slot: {issue.pickupWindow}
            </span>
          )}

          {issue.contactPhone && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <Phone className="h-4 w-4 text-slate-500" />
              {issue.contactPhone}
            </span>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Citizen Instructions
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 leading-relaxed">
            {issue.description || "No special instructions provided."}
          </div>
        </div>

        {/* Community Verification Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <span className="text-slate-400 block text-xs">Municipality Jurisdiction</span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {issue.municipality || "Poonamallee"}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <span className="text-slate-400 block text-xs">Community Upvotes</span>
            <span className="text-base font-bold text-slate-900 mt-1 block">
              {issue.votes} Neighbor Confirmations
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
              <p className="font-bold text-slate-900 text-base">Marked Collected by Municipal Crew</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Did the sanitation team collect the waste from your doorstep?
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="primary"
              className="py-4 text-sm font-bold rounded-xl h-12 uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => castVote("fixed")}
              disabled={!!vote}
            >
              <Check className="h-5 w-5" /> Yes, Collected
            </Button>
            <Button
              variant="secondary"
              className="py-4 text-sm font-bold rounded-xl h-12 uppercase tracking-wide border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white"
              onClick={() => castVote("still_exists")}
              disabled={!!vote}
            >
              <X className="h-5 w-5" /> Still Pending
            </Button>
          </div>

          {vote && (
            <p className="mt-4 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3 uppercase tracking-wider">
              ✓ Thank you! Your verification feedback has been saved.
            </p>
          )}
        </div>
      )}
    </div>
  );
}