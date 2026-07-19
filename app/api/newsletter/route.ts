import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// POST /api/newsletter
// Body: { email: string }
// Writes straight to the `leads` table. Point a scheduled sync (Zapier,
// a nightly cron, or MailerLite/Loops' native Supabase/CSV import) at
// this table to run email marketing on autopilot.
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("leads")
      .insert({ email: email.toLowerCase().trim(), source: "footer_newsletter" });

    // Unique violation just means they already subscribed — treat as success.
    if (error && error.code !== "23505") {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Could not save email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter route error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
