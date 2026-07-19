import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// POST /api/checkout
// Body: { priceId: string, productSlug: string }
// Creates a Stripe Checkout session. Buyer identity (email) is attached
// via client_reference_id + metadata so the webhook can match the
// purchase back to a Supabase user even if they check out before
// creating an account.
export async function POST(request: Request) {
  try {
    const { priceId, productSlug } = await request.json();

    if (!priceId || !productSlug) {
      return NextResponse.json(
        { error: "priceId and productSlug are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // Prefill email if the buyer is already logged in.
      customer_email: user?.email,
      client_reference_id: user?.id, // lets the webhook link straight to the user if known
      metadata: { productSlug },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}
