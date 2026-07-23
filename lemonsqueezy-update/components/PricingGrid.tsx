"use client";

import { useState } from "react";

const plans = [
  {
    name: "Single Template",
    slug: "startup-brand-kit",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID ?? "",
    price: "$49",
    description: "One complete kit: Figma + Notion + a launch checklist.",
    features: ["Lifetime access", "All future v1.x updates", "Commercial use license"],
    highlight: true,
  },
];

export default function PricingGrid() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  async function handleBuy(variantId: string, slug: string) {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, productSlug: slug }),
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-lg border p-8 flex flex-col ${
                plan.highlight
                  ? "border-blueprint bg-blueprint/5"
                  : "border-line bg-ink-2/30"
              }`}
            >
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
                onClick={() => handleBuy(plan.variantId, plan.slug)}
                disabled={loadingSlug === plan.slug}
                className="mt-8 rounded-md bg-brass text-ink font-semibold py-3 hover:bg-brass/90 transition disabled:opacity-60"
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
