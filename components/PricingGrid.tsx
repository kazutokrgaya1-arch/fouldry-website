"use client";

import { useState } from "react";

const plans = [
  {
    name: "Single Template",
    slug: "startup-brand-kit",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SINGLE ?? "",
    price: "$49",
    description: "One complete kit: Figma + Notion + a launch checklist.",
    features: ["Lifetime access", "All future v1.x updates", "Commercial use license"],
    highlight: false,
  },
  {
    name: "Full Archive",
    slug: "full-archive",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ARCHIVE ?? "",
    price: "$149",
    description: "Every template in the vault, including new drops.",
    features: [
      "Everything in Single Template",
      "All current + future templates",
      "Priority email support",
    ],
    highlight: true,
  },
];

export default function PricingGrid() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  async function handleBuy(priceId: string, slug: string) {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, productSlug: slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Couldn't start checkout. Please try again.");
      }
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <section id="pricing" className="border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <p className="font-mono text-xs tracking-[0.2em] text-blueprint mb-3">
          03 / BILL OF MATERIALS
        </p>
        <h2 className="font-display text-3xl text-paper mb-12">
          Pick a scope, ship this weekend.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-lg border p-8 flex flex-col ${
                plan.highlight
                  ? "border-blueprint bg-blueprint/5"
                  : "border-line bg-ink-2/30"
              }`}
            >
              {plan.highlight && (
                <span className="font-mono text-xs text-blueprint mb-3">
                  MOST BUILT WITH
                </span>
              )}
              <h3 className="font-display text-xl text-paper">{plan.name}</h3>
              <p className="text-slate text-sm mt-2">{plan.description}</p>
              <p className="font-display text-4xl text-paper mt-6">
                {plan.price}
              </p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-slate flex gap-2">
                    <span className="text-blueprint">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(plan.priceId, plan.slug)}
                disabled={loadingSlug === plan.slug}
                className={`mt-8 rounded-md font-semibold py-3 transition disabled:opacity-60 ${
                  plan.highlight
                    ? "bg-brass text-ink hover:bg-brass/90"
                    : "bg-transparent border border-line text-paper hover:border-blueprint"
                }`}
              >
                {loadingSlug === plan.slug ? "Redirecting…" : "Buy now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
