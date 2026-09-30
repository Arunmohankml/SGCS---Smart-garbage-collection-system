"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  MapPin,
  ThumbsUp,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  CheckCircle2,
  Truck,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Issue } from "@/lib/types";

interface IssueDrawerProps {
  issue: Issue | null;
  onClose: () => void;
  onVote?: (id: string) => void;
}

export function IssueDrawer({ issue, onClose, onVote }: IssueDrawerProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [localVotes, setLocalVotes] = useState(0);

  useEffect(() => {
    if (issue) {
      setLocalVotes(issue.votes);
      setUpvoted(false);
    }
  }, [issue]);

  if (!issue) return null;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!upvoted) {
      setUpvoted(true);
      setLocalVotes((prev) => prev + 1);
      if (onVote) onVote(issue.id);
    }
  };

  const reportImage = issue.images?.find((img) => img.kind === "report")?.url || issue.images?.[0]?.url;
  const resolutionImage = issue.images?.find((img) => img.kind === "resolution")?.url;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="Close drawer backdrop"
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-500">
              #{issue.reference}
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-900">
              {issue.municipality || "Poonamallee"}
            </span>
            <StatusBadge status={issue.status} />
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title & Category */}
        <div className="mt-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {CATEGORY_LABELS[issue.category] || "Waste"}
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {issue.title}
          </h2>
        </div>

        {/* Photos (Before & After) */}
        {(reportImage || resolutionImage) && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportImage && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                  Citizen Photo
                </span>
                <img src={reportImage} alt="Citizen waste" className="w-full aspect-video object-cover" />
              </div>
            )}
            {resolutionImage && (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-emerald-50/10">
                <span className="absolute top-2 left-2 bg-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  <Check className="h-2.5 w-2.5 stroke-[3]" /> Collected Proof
                </span>
                <img src={resolutionImage} alt="Resolution proof" className="w-full aspect-video object-cover" />
              </div>
            )}
          </div>
        )}

        {/* Dispatch & Location Meta */}
        <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Doorstep Address:</span>
            <span className="font-bold text-slate-900 text-right">{issue.address || issue.landmark || "N/A"}</span>
          </div>
          {issue.landmark && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Landmark:</span>
              <span className="font-bold text-slate-900 text-right">{issue.landmark}</span>
            </div>
          )}
          {issue.quantityEstimate && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Estimated Quantity:</span>
              <span className="font-bold text-slate-900">{issue.quantityEstimate}</span>
            </div>
          )}
          {issue.pickupWindow && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Preferred Slot:</span>
              <span className="font-bold text-slate-900">{issue.pickupWindow}</span>
            </div>
          )}
          {issue.assignedCrew && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-blue-700 font-bold flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> Dispatched Crew:
              </span>
              <span className="font-bold text-blue-900">{issue.assignedCrew}</span>
            </div>
          )}
        </div>

        {/* Description / Instructions */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Citizen Instructions
          </h3>
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 leading-relaxed shadow-2xs">
            {issue.description || "No special instructions provided."}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleUpvote}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition-all border ${
              upvoted
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{localVotes} Community Upvotes</span>
          </button>

          <Link href={`/issues/${issue.id}`} className="flex-1">
            <Button variant="primary" className="w-full py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white">
              View Full Tracker Page <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
