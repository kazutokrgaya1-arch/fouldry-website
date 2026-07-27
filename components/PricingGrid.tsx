"use client";

import { useState } from "react";

// Each template is its own Lemon Squeezy product/variant, so each needs
// its own variant ID env var. Fill these in once you've created all 5
// products in Lemon Squeezy (see setup notes for exact steps).
const plans = [
  {
    name: "Modern Coffee Shop Website",
    slug: "coffee-shop-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_COFFEE ?? "",
    price: "₱499",
    description:
      "8–10 sections with a premium glassmorphism UI, full animations, and a fully responsive layout.",
    features: [
      "8–10 page sections",
      "Glassmorphism UI + animations",
      "100% HTML/CSS/JS",
      "Fully responsive",
    ],
  },
  {
    name: "Developer Portfolio",
    slug: "developer-portfolio",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PORTFOLIO ?? "",
    price: "₱499",
    description:
      "A professional portfolio layout with interactive project cards, a working contact form, and dark mode.",
    features: [
      "Interactive project cards",
      "Working contact form",
      "Dark mode included",
      "100% HTML/CSS/JS",
    ],
  },
  {
    name: "SaaS Landing Page",
    slug: "saas-landing-page",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_SAAS ?? "",
    price: "₱499",
    description:
      "A startup-style landing page with pricing tables, a features section, FAQ, and testimonials built in.",
    features: [
      "Pricing table section",
      "Features + testimonials",
      "FAQ section included",
      "100% HTML/CSS/JS",
    ],
  },
  {
    name: "Restaurant Website",
    slug: "restaurant-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_RESTAURANT ?? "",
    price: "₱499",
    description:
      "A modern food gallery layout with an animated menu and a built-in reservation form.",
    features: [
      "Modern food gallery",
      "Animated menu section",
      "Reservation form",
      "100% HTML/CSS/JS",
    ],
  },
  {
    name: "Gym Website",
    slug: "gym-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_GYM ?? "",
    price: "₱499",
    description:
      "A membership-focused gym site with trainer profiles and a built-in BMI calculator.",
    features: [
      "Membership plans layout",
      "Trainer profile section",
      "Interactive BMI calculator",
      "100% HTML/CSS/JS",
    ],
  },
];

export default function PricingGrid() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  async function handleBuy(variantId: string, slug: string) {
    if (!variantId) {
      alert("This template isn't set up yet — check back soon.");
      return;
    }
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
          Five templates. Pick your build.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className="rounded-lg border border-line bg-ink-2/30 p-8 flex flex-col"
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
