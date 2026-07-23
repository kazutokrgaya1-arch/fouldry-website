import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/lemonsqueezy";
import { createClient } from "@/lib/supabase/server";

// POST /api/checkout
// Body: { variantId: string, productSlug: string }
// Creates a Lemon Squeezy hosted checkout URL and redirects the buyer
// there. Buyer identity (email + Supabase user id, if known) is passed
// through as custom checkout data so the webhook can match the sale
// back to a user even if they check out before creating an account.
export async function POST(request: Request) {
  try {
    const { variantId, productSlug } = await request.json();

    if (!variantId || !productSlug) {
      return NextResponse.json(
        { error: "variantId and productSlug are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const url = await createCheckout({
      variantId,
      email: user?.email,
      userId: user?.id,
      productSlug,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}
