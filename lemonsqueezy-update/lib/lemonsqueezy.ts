// Thin wrapper around the Lemon Squeezy REST API (JSON:API format).
// Docs: https://docs.lemonsqueezy.com/api

const LEMONSQUEEZY_API_BASE = "https://api.lemonsqueezy.com/v1";

async function lemonSqueezyFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${LEMONSQUEEZY_API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lemon Squeezy API error (${res.status}): ${body}`);
  }

  return res.json();
}

// Creates a hosted checkout URL for a given variant (= a specific
// product's price/plan in Lemon Squeezy's data model).
export async function createCheckout({
  variantId,
  email,
  productSlug,
  userId,
}: {
  variantId: string;
  email?: string;
  productSlug: string;
  userId?: string;
}) {
  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: email || undefined,
          // Custom data comes back untouched on the webhook payload,
          // which is how we link the sale back to a product + user.
          custom: {
            productSlug,
            userId: userId || "",
          },
        },
        product_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
        },
        variant: {
          data: { type: "variants", id: variantId },
        },
      },
    },
  };

  const json = await lemonSqueezyFetch("/checkouts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return json.data.attributes.url as string;
}
