"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Loader2,
  MapPin,
  Landmark,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Sparkles,
  Flame,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  type IssueCategory,
  type GeoPoint,
  type YoloDetectionResult,
} from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";

const categoryOptions = Object.entries(CATEGORY_LABELS) as [IssueCategory, string][];

interface GeoStatus {
  state: "idle" | "locating" | "found" | "error";
  point?: GeoPoint;
}

export function ReportForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { addIssue } = useIssuesStore();
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [geo, setGeo] = useState<GeoStatus>({ state: "idle" });
  const [landmark, setLandmark] = useState("");
  const [remarks, setRemarks] = useState("");
  const [category, setCategory] = useState<IssueCategory>("pothole");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // AI Detection States
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState<YoloDetectionResult | null>(null);
  const [userSelectedCategory, setUserSelectedCategory] = useState(false);

  const detectAiCategory = async (file: File, currentRemarks: string = "") => {
    setAnalyzingAi(true);
    setAiResult(null);
    setUserSelectedCategory(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("remarks", currentRemarks);

      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as YoloDetectionResult;
        setAiResult(data);
        if (data.category) {
          setCategory(data.category);
        }
        if (data.suggestedLandmark && !landmark) {
          setLandmark(data.suggestedLandmark);
        }
      }
    } catch (err) {
      console.error("AI Detection Error:", err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    detectAiCategory(file, remarks);
  };

  // Recalculate estimated priority score when user types remarks
  useEffect(() => {
    if (aiResult && remarks) {
      const textLower = remarks.toLowerCase();
      let extraBoost = 0;
      if (textLower.includes("burst") || textLower.includes("electric") || textLower.includes("danger") || textLower.includes("accident") || textLower.includes("severe") || textLower.includes("broken")) {
        extraBoost += 10;
      }
      if (textLower.includes("traffic") || textLower.includes("urgent") || textLower.includes("main road")) {
        extraBoost += 6;
      }
      if (extraBoost > 0) {
        const newScore = Math.min(aiResult.priorityScore + extraBoost, 98);
        const newLevel = newScore >= 85 ? "Critical" : newScore >= 70 ? "High" : "Medium";
        setAiResult((prev) => prev ? { ...prev, priorityScore: newScore, priorityLevel: newLevel } : prev);
      }
    }
  }, [remarks]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ state: "error" });
      return;
    }
    setGeo({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setGeo({ state: "found", point });

        // Reverse geocoding to auto-fill Landmark
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood;
            const city = data.address?.city || data.address?.town || data.address?.county;
            const detectedStreet = road
              ? `${road}${city ? `, ${city}` : ""}`
              : data.display_name?.split(",").slice(0, 2).join(",") || `Sector ${Math.floor(point.lat * 10) % 100} Main Road`;
            setLandmark(detectedStreet);
          } else {
            setLandmark(`Main Sector Road (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`);
          }
        } catch {
          setLandmark(`Main Sector Road (${point.lat.toFixed(4)}, ${point.lng.toFixed(4)})`);
        }
      },
      () => {
        const fallbackPoint = { lat: 13.0827, lng: 80.2707 };
        setGeo({ state: "found", point: fallbackPoint });
        setLandmark("Main Central Avenue, Sector 4");
      }
    );
  }, []);

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url: string };
      return data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySelect = (selected: IssueCategory) => {
    setCategory(selected);
    setUserSelectedCategory(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!image) {
      setError("Please take or upload a photo of the issue.");
      return;
    }

    setSubmitting(true);

    try {
      const imageUrl = await uploadImage();

      addIssue({
        category,
        title: aiResult?.suggestedTitle || `Reported ${CATEGORY_LABELS[category]} Issue`,
        description: remarks || `Public complaint regarding ${CATEGORY_LABELS[category]}.`,
        landmark: landmark || "Central Ward Metro Crossing",
        address: landmark || "Main Street Sector 4",
        location: geo.point || { lat: 13.0827, lng: 80.2707 },
        images: imageUrl
          ? [{ url: imageUrl, capturedAt: new Date().toISOString(), kind: "report" }]
          : [],
        aiCategoryConfidence: aiResult?.confidence || 0.95,
        aiSpamScore: 0.02,
        priorityScore: aiResult?.priorityScore || 85,
        status: "open",
        department: `${CATEGORY_LABELS[category]} Maintenance Division`,
      });

      setDone(true);
      setTimeout(() => router.push("/issues"), 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center p-10 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-250">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Report Submitted!</h2>
        <p className="mt-2 text-sm text-slate-650 leading-relaxed font-medium">
          Your report has been received and prioritized for municipal dispatch. Redirecting to live feed...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 divide-y divide-slate-100 text-slate-900 shadow-lg space-y-6">
      {/* Step 1: Photo */}
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            01 — Upload Photo
          </label>
          <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700">
            <Sparkles className="h-3 w-3 fill-blue-600 text-blue-600" /> AI Auto-Categorize
          </span>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors">
          {image ? (
            <div className="relative h-full w-full">
              <img
                src={image}
                alt="Selected issue preview"
                className="h-full w-full object-cover animate-fade-in"
              />

              {/* Simple Citizen Scanning Loader */}
              {analyzingAi && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs text-white">
                  <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                  <span className="text-xs font-semibold text-white tracking-wider uppercase">
                    Analyzing photo...
                  </span>
                </div>
              )}

              {/* Change Photo Button */}
              {!analyzingAi && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-3 right-3 rounded-xl bg-black/75 px-3.5 py-2 text-xs font-bold text-white hover:bg-black/90 transition-all flex items-center gap-1.5"
                >
                  <Camera className="h-3.5 w-3.5" /> Retake Photo
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-600 hover:bg-blue-50/20 transition-colors"
            >
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-full text-blue-600">
                <ImagePlus className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tap here to take photo or upload image
              </span>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />

        {/* Clean Citizen Detection & Priority Card */}
        {aiResult && !analyzingAi && (
          <div className="mt-4 border border-slate-200 rounded-2xl bg-slate-50 p-4 text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2 text-white rounded-xl">
                  <Sparkles className="h-4 w-4 fill-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Problem Identified
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 leading-none mt-1">
                    {CATEGORY_LABELS[aiResult.category]}{" "}
                    <span className="text-[11px] font-semibold text-slate-500 tracking-normal normal-case">
                      ({Math.round(aiResult.confidence * 100)}% Match)
                    </span>
                  </h4>
                </div>
              </div>

              {/* Priority Estimate Badge */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-2xs">
                <Flame className={cn("h-4 w-4", aiResult.priorityLevel === "Critical" || aiResult.priorityLevel === "High" ? "text-red-600 animate-pulse" : "text-amber-500")} />
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase block leading-none tracking-wider">
                    Estimated Priority
                  </span>
                  <span className={cn("text-xs font-bold mt-0.5 block", aiResult.priorityLevel === "Critical" ? "text-red-600" : aiResult.priorityLevel === "High" ? "text-amber-600" : "text-emerald-600")}>
                    {aiResult.priorityLevel} ({aiResult.priorityScore}/100)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Location */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            02 — Detect Location
          </label>
          {geo.point && (
            <a
              href={`https://www.google.com/maps?q=${geo.point.lat},${geo.point.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Show in Google Maps
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={locate}
          className={cn(
            "flex w-full items-center justify-center gap-3 border p-4 text-xs font-bold uppercase tracking-wider transition-all rounded-xl",
            geo.state === "found"
              ? "border-emerald-600 bg-emerald-50 text-emerald-900"
              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          )}
        >
          {geo.state === "locating" ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : (
            <MapPin className="h-4 w-4 text-blue-600" />
          )}
          {geo.state === "found"
            ? `Location Pinned: (${geo.point!.lat.toFixed(4)}, ${geo.point!.lng.toFixed(4)})`
            : geo.state === "locating"
              ? "Acquiring GPS Signal & Street Address..."
              : "Tap to Detect My Location Automatically"}
        </button>
      </div>

      {/* Step 3: Category & Remarks */}
      <div className="py-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              03 — Issue Category
            </label>
            {aiResult && (
              <span className="text-[10px] font-semibold text-slate-450">
                {userSelectedCategory ? "User selected" : "Auto-selected"}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categoryOptions.map(([value, label]) => {
              const isSelected = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleCategorySelect(value)}
                  className={cn(
                    "border p-3.5 text-xs font-bold uppercase tracking-wider transition-all text-left flex flex-col justify-between min-h-[52px] rounded-xl",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                  )}
                >
                  <span className="leading-snug">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="landmark" className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Landmark className="h-3.5 w-3.5 text-slate-500" /> Landmark / Street (Editable)
            </label>
            <input
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Metro Exit 2"
              className="w-full border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:bg-white focus:border-slate-350 text-slate-900 rounded-xl"
            />
          </div>
          <div>
            <label htmlFor="remarks" className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MessageSquare className="h-3.5 w-3.5 text-slate-500" /> Remarks (Optional)
            </label>
            <input
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Dangerous road cavity, causing traffic..."
              className="w-full border border-slate-200 bg-slate-50 p-3.5 text-sm font-semibold outline-none focus:bg-white focus:border-slate-350 text-slate-900 rounded-xl"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-800 rounded-xl">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          {error}
        </div>
      )}

      <div className="pt-6">
        <Button type="submit" size="lg" disabled={submitting || uploading || analyzingAi} className="w-full font-bold text-sm uppercase py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm">
          {submitting || uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {uploading ? "Uploading Image..." : "Submitting Report..."}
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" /> Submit Complaint to Municipality
            </>
          )}
        </Button>
      </div>
    </form>
  );
}