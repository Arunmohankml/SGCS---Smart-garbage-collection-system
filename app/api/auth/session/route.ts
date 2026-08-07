import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { getSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let body: { idToken?: string; role?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.idToken) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  try {
    // Verify the Firebase ID token
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(body.idToken);

    const supabase = await getSupabaseServer();

    // Upsert profile from Firebase user data
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: decoded.uid,
        email: decoded.email ?? "",
        name: decoded.name ?? decoded.email?.split("@")[0] ?? "",
        avatar_url: decoded.picture ?? "",
        role: (body.role ?? "citizen") as "citizen" | "authority",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    // Create or link the Supabase user (idempotent — duplicate is fine)
    const { error: userError } = await supabase.auth.admin.createUser({
      id: decoded.uid,
      email: decoded.email,
      user_metadata: {
        name: decoded.name,
        avatar_url: decoded.picture,
      },
    });

    if (userError && userError.code !== "23505") {
      console.error("Supabase user upsert error:", userError);
    }

    // Set a server-only httpOnly cookie with the Firebase UID
    const cookieStore = await cookies();
    cookieStore.set("ce_session", decoded.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        role: body.role ?? "citizen",
      },
    });
  } catch (e) {
    console.error("Auth error:", e);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}