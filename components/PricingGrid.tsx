"use client";

import { useState } from "react";
import Image from "next/image";

const plans = [
  {
    name: "Modern Coffee Shop Website",
    slug: "coffee-shop-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_COFFEE ?? "",
    price: 499,
    sold: 12,
    rating: 4.8,
    image: "/images/coffee-shop.jpg",
    description:
      "8–10 sections, glassmorphism UI, full animations, fully responsive.",
  },
  {
    name: "Developer Portfolio",
    slug: "developer-portfolio",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PORTFOLIO ?? "",
    price: 499,
    sold: 8,
    rating: 4.9,
    image: "/images/developer-portfolio.jpg",
    description:
      "Interactive project cards, working contact form, dark mode.",
  },
  {
    name: "SaaS Landing Page",
    slug: "saas-landing-page",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_SAAS ?? "",
    price: 499,
    sold: 15,
    rating: 4.7,
    image: "/images/saas-landing-page.jpg",
    description: "Pricing tables, features, FAQ, testimonials built in.",
  },
  {
    name: "Restaurant Website",
    slug: "restaurant-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_RESTAURANT ?? "",
    price: 499,
    sold: 6,
    rating: 4.6,
    image: "/images/restaurant.jpg",
    description: "Modern food gallery, animated menu, reservation form.",
  },
  {
    name: "Gym Website",
    slug: "gym-website",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_GYM ?? "",
    price: 499,
    sold: 9,
    rating: 4.8,
    image: "/images/gym.jpg",
    description: "Membership plans, trainer profiles, BMI calculator.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-market-accent text-xs">
      {"★★★★★".split("").map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? "" : "opacity-20"}>
          ★
        </span>
      ))}
    </div>
  );
}

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
    } catch (err) {
      console.error("Checkout request failed:", err);
      alert("Couldn't start checkout. Please check your connection and try again.");
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <section id="pricing" className="bg-market-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-market-text font-bold text-xl sm:text-2xl mb-1">
          All templates
        </h2>
        <p className="text-market-muted text-sm mb-4 sm:mb-6">
          5 ready-to-launch designs, ₱499 each
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className="bg-white border border-market-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="relative aspect-square bg-market-surface">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>

              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <p className="text-xs sm:text-sm text-market-text font-semibold leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]">
                  {plan.name}
                </p>
                <p className="hidden sm:block text-xs text-market-muted mt-1 line-clamp-2 min-h-[2rem]">
                  {plan.description}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={plan.rating} />
                  <span className="text-xs text-market-muted">
                    {plan.rating}
                  </span>
                </div>

                <p className="text-market-accent font-bold text-lg sm:text-xl mt-2 sm:mt-3">
                  ₱{plan.price.toFixed(2)}
                </p>
                <p className="text-xs text-market-muted -mt-0.5 mb-2 sm:mb-3">
                  {plan.sold} sold
                </p>

                {/* min-h-[44px] keeps the tap target comfortably sized
                    for mobile per standard touch-target guidance. */}
                <button
                  onClick={() => handleBuy(plan.variantId, plan.slug)}
                  disabled={loadingSlug === plan.slug}
                  className="mt-auto w-full min-h-[44px] bg-market-accent hover:bg-market-accent-dark text-white text-sm font-semibold rounded-md transition disabled:opacity-60 active:scale-[0.98]"
                >
                  {loadingSlug === plan.slug ? "Redirecting…" : "Buy now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
