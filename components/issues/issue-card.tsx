"use client";

import { useState } from "react";
import { MapPin, ThumbsUp, Clock, CheckCircle2, Truck, Image as ImageIcon } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type Issue } from "@/lib/types";

interface IssueCardProps {
  issue: Issue;
  onSelect?: (issue: Issue) => void;
  onVote?: (id: string) => void;
}

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

  const mainImage = issue.images?.find((img) => img.kind === "report")?.url || issue.images?.[0]?.url;
  const resolutionImage = issue.images?.find((img) => img.kind === "resolution")?.url;
  
  // Display resolved image if collected so citizens see proof immediately
  const displayImage = issue.status === "resolved" && resolutionImage ? resolutionImage : mainImage;

  return (
    <div
      onClick={() => onSelect && onSelect(issue)}
      className="group relative flex flex-col bg-white border border-slate-200 cursor-pointer transition-all duration-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300"
    >
      {/* Image Container */}
      {displayImage ? (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          <img
            src={displayImage}
            alt={issue.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={issue.status} />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              {issue.municipality || "Central Ward"}
            </span>
          </div>
          
          {issue.status === "resolved" && resolutionImage && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" /> Collected & Cleared Proof
            </span>
          )}

          {issue.assignedCrew && issue.status === "in_progress" && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-blue-600/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              <Truck className="h-3.5 w-3.5" /> Crew Dispatched
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
          <div className="flex flex-col items-center gap-1.5 text-slate-400">
            <ImageIcon className="h-8 w-8 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Photo Attached</span>
          </div>
          <div className="absolute top-3 left-3">
            <StatusBadge status={issue.status} />
          </div>
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-slate-200/80 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              {issue.municipality || "Central Ward"}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] font-bold text-slate-400 tracking-wider">
              #{issue.reference}
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-900 uppercase tracking-wider">
              {CATEGORY_LABELS[issue.category] || "Waste"}
            </span>
            {issue.quantityEstimate && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                {issue.quantityEstimate}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>

          <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
            {issue.description || "No additional instructions provided."}
          </p>
        </div>

        <div>
          {/* Location & Slot */}
          <div className="mt-3 flex flex-col gap-1 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{issue.address || issue.landmark || "Doorstep location"}</span>
            </div>
            {issue.pickupWindow && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                <span>Slot: {issue.pickupWindow}</span>
              </div>
            )}
          </div>

          {/* Footer Card Info */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {issue.assignedCrew || issue.department || "Municipal Sanitation"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleVote}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all border ${
                  voted
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
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