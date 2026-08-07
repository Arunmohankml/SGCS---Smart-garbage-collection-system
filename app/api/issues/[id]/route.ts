import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { IssueStatus } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let body: { status?: IssueStatus; resolvedProof?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  try {
    const supabase = await getSupabaseServer();

    const { data, error } = await supabase
      .from("issues")
      .update({
        status: body.status,
        resolved_at: body.status === "resolved" ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, status: data.status, updated: true });
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured. See .env.example." },
      { status: 503 }
    );
  }
}