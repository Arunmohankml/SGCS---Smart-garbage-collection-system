import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { reference } from "@/lib/utils";
import type { ResolutionVote } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  let body: { vote: ResolutionVote };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.vote !== "fixed" && body.vote !== "still_exists") {
    return NextResponse.json({ error: "vote must be 'fixed' or 'still_exists'" }, { status: 400 });
  }

  try {
    const supabase = await getSupabaseServer();

    const voteId = String(Date.now());
    const { error } = await supabase
      .from("resolution_votes")
      .insert({
        id: voteId,
        issue_id: id,
        voter_id: null,
        vote: body.vote === "fixed" ? "fixed" : "still_exists",
      });

    if (error) throw error;

    return NextResponse.json({ id, vote: body.vote, recorded: true });
  } catch {
    return NextResponse.json(
      { error: "Supabase is not configured. See .env.example." },
      { status: 503 }
    );
  }
}