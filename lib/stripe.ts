import Stripe from "stripe";

// Single shared Stripe instance for the whole app (checkout + webhook).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
