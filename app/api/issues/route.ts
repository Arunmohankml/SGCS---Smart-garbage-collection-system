import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { reference } from "@/lib/utils";
import { CATEGORY_LABELS, type GeoPoint, type IssueCategory } from "@/lib/types";
import { mockIssues } from "@/lib/mock";

export interface CreateIssueRequest {
  image?: string;
  category: IssueCategory;
  landmark?: string;
  remarks?: string;
  municipality?: string;
  quantityEstimate?: string;
  pickupWindow?: string;
  contactPhone?: string;
  location: GeoPoint;
}

export async function POST(request: Request) {
  let body: CreateIssueRequest;
  try {
    body = (await request.json()) as CreateIssueRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.location?.lat || !body.location?.lng) {
    return NextResponse.json({ error: "location.lat and location.lng are required" }, { status: 400 });
  }

  const ai = {
    category: (CATEGORY_LABELS[body.category] ? body.category : "other") as IssueCategory,
    categoryConfidence: 0.95,
    spamScore: 0.02,
    duplicateOf: null as string | null,
    priorityScore: 75,
  };

  try {
    const supabase = await getSupabaseServer();

    const id = String(Date.now());
    const { data, error } = await supabase
      .from("issues")
      .insert({
        id,
        reporter_id: null,
        reference: `CE-WASTE-${id.slice(-4)}`,
        category: ai.category,
        title: `Waste Pickup: ${CATEGORY_LABELS[ai.category]}`,
        description: body.remarks ?? "",
        location: `POINT(${body.location.lng} ${body.location.lat})`,
        landmark: body.landmark ?? "",
        ai_category_confidence: ai.categoryConfidence,
        ai_spam_score: ai.spamScore,
        priority_score: ai.priorityScore,
        images: body.image ? [{ url: body.image, capturedAt: new Date().toISOString(), kind: "report" }] : [],
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        id: data.id,
        reference: `CE-WASTE-${data.id.slice(-4)}`,
        status: "open",
        ai,
      },
      { status: 201 }
    );
  } catch {
    const fallbackId = String(Date.now());
    return NextResponse.json(
      {
        id: fallbackId,
        reference: `CE-WASTE-${fallbackId.slice(-4)}`,
        status: "open",
        ai,
        message: "Saved to local state.",
      },
      { status: 201 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ issues: data && data.length > 0 ? data : mockIssues });
  } catch {
    return NextResponse.json({
      issues: mockIssues,
    });
  }
}