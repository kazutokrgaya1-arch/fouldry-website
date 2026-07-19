import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /auth/callback?code=...
// Supabase redirects here after the user clicks their magic link.
// Exchanging the code sets the session cookie, then we send them
// straight to the dashboard — zero manual steps.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
