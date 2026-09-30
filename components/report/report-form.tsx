"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Loader2,
  MapPin,
  Building2,
  CheckCircle2,
  Sparkles,
  Truck,
  Leaf,
  Recycle,
  Cpu,
  Package,
  AlertTriangle,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  MUNICIPALITIES,
  type IssueCategory,
  type GeoPoint,
  type YoloDetectionResult,
} from "@/lib/types";
import { useIssuesStore } from "@/lib/issues-store";

const wasteCategoryCards: { id: IssueCategory; label: string; desc: string; icon: any; color: string }[] = [
  {
    id: "organic_kitchen",
    label: "Kitchen & Wet Waste",
    desc: "Food scraps, vegetable peels, compostable items",
    icon: Leaf,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    id: "dry_recyclable",
    label: "Dry Recyclables",
    desc: "Cardboard, paper, plastics, glass bottles, cans",
    icon: Recycle,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "electronic_ewaste",
    label: "E-Waste & Electronics",
    desc: "Old gadgets, wires, lithium batteries, appliances",
    icon: Cpu,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    id: "bulky_debris",
    label: "Bulky & Furniture",
    desc: "Old mattresses, wooden furniture, renovation items",
    icon: Package,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "hazardous_sanitary",
    label: "Hazardous & Sanitary",
    desc: "Expired chemicals, paint cans, medical/sanitary",
    icon: AlertTriangle,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "garden_green",
    label: "Garden & Yard Green",
    desc: "Tree clippings, pruned branches, dry foliage",
    icon: Sparkles,
    color: "text-teal-600 bg-teal-50 border-teal-200",
  },
];

const quantityOptions = ["1-2 Bags (Small)", "3-5 Bags (Medium)", "Bulky / Truckload"];
const pickupWindows = ["Morning (8 AM - 12 PM)", "Afternoon (1 PM - 5 PM)", "Urgent (Within 4 Hours)"];

export function ReportForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { addIssue } = useIssuesStore();

  const [municipality, setMunicipality] = useState<string>("Central Ward");
  const [category, setCategory] = useState<IssueCategory>("organic_kitchen");
  const [quantityEstimate, setQuantityEstimate] = useState<string>("1-2 Bags (Small)");
  const [pickupWindow, setPickupWindow] = useState<string>("Morning (8 AM - 12 PM)");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [remarks, setRemarks] = useState("");

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<GeoPoint>({ lat: 12.9716, lng: 77.5946 });
  const [hasLocation, setHasLocation] = useState(false);

  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState<YoloDetectionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasLocation(true);
        setLocating(false);
        if (!landmark) {
          setLandmark(`GPS Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocating(false);
        setHasLocation(true);
      },
      { timeout: 10000 }
    );
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // AI Classification of waste
    setAnalyzingAi(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("remarks", remarks);

      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = (await res.json()) as YoloDetectionResult;
        setAiResult(data);
        if (data.category && wasteCategoryCards.some((c) => c.id === data.category)) {
          setCategory(data.category);
        }
      }
    } catch (err) {
      console.error("AI detection error:", err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please provide your doorstep address or house number.");
      return;
    }

    setSubmitting(true);

    const title = `${CATEGORY_LABELS[category]} Doorstep Collection (${quantityEstimate})`;
    const fullDescription = remarks
      ? `${remarks} — [Pickup: ${pickupWindow}, Contact: ${contactPhone || "Not specified"}]`
      : `Pickup requested for ${CATEGORY_LABELS[category]}. Time Window: ${pickupWindow}. Contact: ${contactPhone || "Not specified"}.`;

    const newIssue = addIssue({
      category,
      status: "open",
      title,
      description: fullDescription,
      location: coords,
      address,
      landmark: landmark || `${municipality} Area`,
      municipality,
      quantityEstimate,
      pickupWindow,
      contactPhone,
      department:
        category === "organic_kitchen"
          ? "Wet & Organic Composting"
          : category === "dry_recyclable"
          ? "Dry Recycling Logistics"
          : category === "electronic_ewaste"
          ? "E-Waste & Hazardous Units"
          : category === "bulky_debris"
          ? "Bulky & Heavy Haulage"
          : "Sanitation Department",
      images: image
        ? [
            {
              url: image,
              capturedAt: new Date().toISOString(),
              kind: "report",
            },
          ]
        : [],
      aiCategoryConfidence: aiResult ? aiResult.confidence : 0.95,
      aiSpamScore: 0.01,
      priorityScore: aiResult ? aiResult.priorityScore : 75,
    });

    setTimeout(() => {
      setSubmitting(false);
      setCreatedRef(newIssue.reference);
      setCreatedId(newIssue.id);
    }, 600);
  };

  if (createdRef) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg shadow-emerald-950/5">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 uppercase tracking-wider mb-2">
          Request Logged Successfully
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Garbage Pickup Scheduled!</h2>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          Your collection request has been routed to the <strong>{municipality}</strong> municipal dispatch console.
        </p>

        <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Tracking Code:</span>
            <span className="font-mono font-bold text-slate-900">{createdRef}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Municipality:</span>
            <span className="font-bold text-slate-900">{municipality}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Waste Category:</span>
            <span className="font-bold text-slate-900">{CATEGORY_LABELS[category]}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Preferred Slot:</span>
            <span className="font-bold text-slate-900">{pickupWindow}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">Pending Pickup</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm"
            onClick={() => router.push(`/issues/${createdId}`)}
          >
            Track Collection Live <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50"
            onClick={() => {
              setCreatedRef(null);
              setCreatedId(null);
              setImage(null);
              setAddress("");
              setLandmark("");
              setRemarks("");
            }}
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {/* 1. Municipality Ward Selection */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">1. Select Your Municipality</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Choose the municipal ward where the garbage needs to be collected.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MUNICIPALITIES.map((mun) => (
            <button
              type="button"
              key={mun}
              onClick={() => setMunicipality(mun)}
              className={cn(
                "rounded-2xl border p-4 text-left font-bold text-sm transition-all shadow-2xs",
                municipality === mun
                  ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-600/20"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/60"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{mun}</span>
                {municipality === mun && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Waste Category Selection */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Recycle className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">2. Type of Waste to Collect</h2>
          </div>
          {analyzingAi && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> AI Vision Categorizing...
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Select what kind of waste you have so the municipality sends the right collection crew and vehicle.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {wasteCategoryCards.map((c) => {
            const Icon = c.icon;
            const isSelected = category === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all duration-200 flex flex-col justify-between shadow-2xs",
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20 shadow-xs"
                    : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/60"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={cn("p-2 rounded-xl border", c.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.label}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 leading-snug">{c.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Quantity & Preferred Pickup Window */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">3. Quantity & Pickup Window</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-4">
            Specify how much waste you have and your preferred collection time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Estimated Volume / Bags:
              </label>
              <div className="space-y-2">
                {quantityOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setQuantityEstimate(opt)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-left text-xs font-bold transition-all",
                      quantityEstimate === opt
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Preferred Pickup Window:
              </label>
              <div className="space-y-2">
                {pickupWindows.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setPickupWindow(slot)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-left text-xs font-bold transition-all",
                      pickupWindow === slot
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Pickup Address & GPS Location */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">4. Pickup Location</h2>
          </div>
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors"
          >
            {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5 text-blue-600" />}
            {hasLocation ? "GPS Location Pinned" : "Detect Current GPS"}
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Doorstep Address / House No. *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Flat 302, Green Meadows Apts, 4th Cross"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Prominent Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Sunrise Bakery, Gate #2"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Contact Phone (For Driver Coordination)
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +91 98450 12345"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Waste Photo Upload & Notes */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">5. Photo & Additional Notes (Optional)</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Upload a photo of the waste to help our crew bring the right vehicle.
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFile}
          className="hidden"
          id="waste-photo"
        />

        {image ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video max-h-60 w-full group">
            <img src={image} alt="Uploaded waste" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImageFile(null);
              }}
              className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white px-3 py-1 rounded-full text-xs font-bold"
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <label
            htmlFor="waste-photo"
            className="cursor-pointer flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-250 bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
          >
            <ImagePlus className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-bold text-slate-800">Click to upload waste photo</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP up to 10MB</span>
          </label>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Special Instructions for Sanitation Crew
          </label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Left outside the compound gate, please ring bell #4 on arrival"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          size="lg"
          variant="primary"
          className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Scheduling Pickup...
            </>
          ) : (
            <>
              <Truck className="h-5 w-5" /> Request Garbage Pickup Now
            </>
          )}
        </Button>
      </div>
    </form>
  );
}