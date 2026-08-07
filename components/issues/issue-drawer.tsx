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
  AlertTriangle,
  Flame,
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
            <span className="font-mono text-xs text-slate-500 font-bold uppercase">
              {issue.reference}
            </span>
            <StatusBadge status={issue.status} />
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Title & category */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {CATEGORY_LABELS[issue.category]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
              <Flame className="h-4 w-4 text-blue-600" /> Priority Rank {issue.priorityScore}/100
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
            {issue.title}
          </h2>
        </div>

        {/* Location & Department Metadata */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="truncate">{issue.landmark || issue.address || "Location pinned"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="truncate">{issue.department || "Municipal Works Desk"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Complaint Details
          </h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base font-medium text-slate-800 leading-relaxed">
            {issue.description || "No additional description supplied by reporter."}
          </div>
        </div>

        {/* Workflow Timeline */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" /> Resolution Timeline
          </h3>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Complaint Reported & Pinned
              </span>
              <span className="text-slate-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-blue-600" /> City Department Notified
              </span>
              <span className="text-slate-500">Priority {issue.priorityScore}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-800">
                {issue.status === "resolved" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                {issue.status === "resolved" ? "Repair Work Completed & Verified" : "Work Dispatched / In Progress"}
              </span>
              <span className="text-slate-500">
                {issue.status === "resolved" ? "Completed" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Upvote & Action Bar */}
        <div className="mt-8 border-t border-slate-200 pt-5 flex items-center justify-between gap-4">
          <button
            onClick={handleUpvote}
            disabled={upvoted}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-extrabold transition-all shadow-xs ${
              upvoted
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            {upvoted ? `Upvoted (${localVotes})` : `Upvote Issue (${localVotes})`}
          </button>

          <Link href={`/issues/${issue.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center justify-center gap-1.5" size="md">
              View Full Case <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

