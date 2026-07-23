import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";

// POST /api/webhooks/lemonsqueezy
// This is the "hands-off" heart of the business for Lemon Squeezy sales.
// Lemon Squeezy calls this URL the moment an order completes. We verify
// the signature, then use the SERVICE ROLE client (bypasses RLS) to
// write the purchase and link it to a Supabase auth user automatically.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify the request really came from Lemon Squeezy using the
  // signing secret you set when creating the webhook.
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature, "utf8"),
    Buffer.from(expectedSignature, "utf8")
  );

  if (!isValid) {
    console.error("Lemon Squeezy webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta?.event_name;

  const supabase = createServiceRoleClient();

  if (eventName === "order_created") {
    const order = event.data.attributes;
    const email: string | undefined = order.user_email;
    const customData = event.meta?.custom_data ?? {};
    const productSlug: string | undefined = customData.productSlug;
    const knownUserId: string | undefined = customData.userId || undefined;
    const orderId: string = String(event.data.id);
    const amountPaidCents: number = order.total ?? 0;

    if (!email || !productSlug) {
      console.error("Webhook missing email or productSlug", orderId);
      return NextResponse.json({ received: true });
    }

    // 1. Look up the product being purchased.
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price_cents")
      .eq("slug", productSlug)
      .single();

    if (productError || !product) {
      console.error("Product not found for slug:", productSlug);
      return NextResponse.json({ received: true });
    }

    // 2. Resolve the buyer to a Supabase user, creating one if this is
    // their first-ever purchase (no prior signup required).
    let userId = knownUserId ?? null;

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
          return NextResponse.json({ received: true });
        }
        userId = created.user.id;
      }
    }

    // 3. Record the purchase. Unique constraint on the order id makes
    // this handler safe to run twice (Lemon Squeezy retries webhooks).
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      product_id: product.id,
      stripe_checkout_session_id: orderId, // reused column name; holds the LS order id
      stripe_payment_intent_id: orderId,
      amount_paid_cents: amountPaidCents,
      status: "completed",
    });

    if (purchaseError && purchaseError.code !== "23505") {
      // 23505 = unique_violation -> duplicate webhook delivery, safe to ignore
      console.error("Failed to record purchase:", purchaseError);
    }

    // 4. Generate a magic link so the buyer can get straight into their
    // dashboard. NOTE: generateLink() only creates the link — it does
    // NOT email it. Either rely on Lemon Squeezy's own receipt email
    // plus a manual "log in" prompt on your site, or pipe this link
    // through a transactional email provider (Resend, Postmark, etc.)
    // for a fully custom "here's your download" email.
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard` },
    });
  }

  if (eventName === "order_refunded") {
    const orderId = String(event.data.id);
    await supabase
      .from("purchases")
      .update({ status: "refunded" })
      .eq("stripe_checkout_session_id", orderId);
  }

  return NextResponse.json({ received: true });
}
