"use client";

import { useState } from "react";
import { MapPin, ThumbsUp, ArrowRight, Image, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Issue } from "@/lib/types";

interface IssueCardProps {
  issue: Issue;
  onSelect?: (issue: Issue) => void;
  onVote?: (id: string) => void;
}

const statusIcons: Record<string, React.ReactNode> = {
  open: <Clock className="h-4 w-4 text-amber-warm" />,
  in_progress: <AlertTriangle className="h-4 w-4 text-amber-soft" />,
  resolved: <CheckCircle2 className="h-4 w-4 text-sage" />,
  reopened: <AlertTriangle className="h-4 w-4 text-red-400" />,
  rejected: <Clock className="h-4 w-4 text-zinc-400" />,
};

export function IssueCard({ issue, onSelect, onVote }: IssueCardProps) {
  const [votes, setVotes] = useState(issue.votes);
  const [voted, setVoted] = useState(false);

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!voted) {
      setVoted(true);
      setVotes((prev) => prev + 1);
      if (onVote) onVote(issue.id);
    }
  };

  const mainImage = issue.images?.[0]?.url;
  const statusLabel = issue.status.replace("_", " ");

  return (
    <div
      onClick={() => onSelect && onSelect(issue)}
      className="group relative flex flex-col bg-white border border-slate-200 cursor-pointer transition-all duration-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-350"
    >
      {/* Image */}
      {mainImage ? (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          <img
            src={mainImage}
            alt={issue.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <StatusBadge status={issue.status} />
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
            {statusIcons[issue.status]}
            <span className="capitalize">{statusLabel}</span>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Image className="h-10 w-10 text-slate-400" />
            <span className="text-xs font-bold text-slate-655">No image</span>
          </div>
          <div className="absolute top-3 left-3">
            <StatusBadge status={issue.status} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] font-bold text-slate-400 tracking-wider uppercase">
              {issue.reference}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-600 uppercase tracking-wide">
              {CATEGORY_LABELS[issue.category]}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>

          <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
            {issue.description || "No description provided."}
          </p>
        </div>

        <div>
          {/* Location */}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{issue.landmark || issue.address || "Location pinned on map"}</span>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-450">
              {issue.department || "Municipal Desk"}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500">
                Pri: {issue.priorityScore}
              </span>
              <button
                onClick={handleVote}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border border-slate-200 ${
                  voted
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{votes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}