import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";

// POST /api/webhooks/stripe
// This is the "hands-off" heart of the business: Stripe calls this URL
// the moment money moves. We verify the signature, then use the
// SERVICE ROLE client (bypasses RLS) to write the purchase and link
// it to a Supabase auth user — no human ever touches this.
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_email ?? session.customer_details?.email;
      const productSlug = session.metadata?.productSlug;
      const clientReferenceId = session.client_reference_id; // supabase user id, if known

      if (!email || !productSlug) {
        console.error("Webhook missing email or productSlug", session.id);
        break;
      }

      // 1. Look up the product being purchased.
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, price_cents")
        .eq("slug", productSlug)
        .single();

      if (productError || !product) {
        console.error("Product not found for slug:", productSlug);
        break;
      }

      // 2. Resolve the buyer to a Supabase user, creating one if this
      // is their first-ever purchase (no prior signup required).
      let userId = clientReferenceId ?? null;

      if (!userId) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const match = existingUsers.users.find((u) => u.email === email);

        if (match) {
          userId = match.id;
        } else {
          const { data: created, error: createError } =
            await supabase.auth.admin.createUser({
              email,
              email_confirm: true,
            });
          if (createError || !created.user) {
            console.error("Failed to create user for buyer:", createError);
            break;
          }
          userId = created.user.id;
        }
      }

      // 3. Attach the Stripe customer id to their profile.
      if (session.customer) {
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: session.customer as string })
          .eq("id", userId);
      }

      // 4. Record the purchase. Unique constraint on the session id
      // makes this handler safe to run twice (Stripe retries webhooks).
      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: userId,
        product_id: product.id,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount_paid_cents: session.amount_total ?? product.price_cents,
        status: "completed",
      });

      if (purchaseError && purchaseError.code !== "23505") {
        // 23505 = unique_violation -> duplicate webhook delivery, safe to ignore
        console.error("Failed to record purchase:", purchaseError);
      }

      // 5. Generate a magic link so the buyer can get straight into their
      // dashboard. NOTE: generateLink() only creates the link — it does
      // NOT email it. Either (a) let Supabase's built-in "Confirm signup"
      // email double as the welcome email (simplest), or (b) pipe the
      // returned link through your transactional email provider (Resend,
      // Postmark, etc.) inside this handler for a fully custom email.
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
      });

      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await supabase
        .from("purchases")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent_id", charge.payment_intent as string);
      break;
    }

    default:
      // Unhandled event types are ignored on purpose — keep this list lean.
      break;
  }

  return NextResponse.json({ received: true });
}
