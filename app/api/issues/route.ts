import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { reference } from "@/lib/utils";
import { CATEGORY_LABELS, type GeoPoint, type IssueCategory } from "@/lib/types";

export interface CreateIssueRequest {
  image: string;
  category: IssueCategory;
  landmark?: string;
  remarks?: string;
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
  if (!body.image) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  const ai = {
    category: (CATEGORY_LABELS[body.category] ? body.category : "other") as IssueCategory,
    categoryConfidence: 0.92,
    spamScore: 0.03,
    duplicateOf: null as string | null,
    priorityScore: 70,
  };

  try {
    const supabase = await getSupabaseServer();

    const id = String(Date.now());
    const { data, error } = await supabase
      .from("issues")
      .insert({
        id,
        reporter_id: null,
        reference: reference(id),
        category: ai.category,
        title: `New ${CATEGORY_LABELS[ai.category]} reported`,
        description: body.remarks ?? "",
        location: `POINT(${body.location.lng} ${body.location.lat})`,
        landmark: body.landmark ?? "",
        ai_category_confidence: ai.categoryConfidence,
        ai_spam_score: ai.spamScore,
        priority_score: ai.priorityScore,
        images: [],
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        id: data.id,
        reference: reference(data.id),
        status: "open",
        ai,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        issues: [],
        message: "Supabase not configured — see .env.example.",
      },
      { status: 503 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("priority_score", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ issues: data ?? [] });
  } catch {
    return NextResponse.json(
      {
        issues: [],
        message: "Supabase not configured — see .env.example.",
      },
      { status: 503 }
    );
  }
}