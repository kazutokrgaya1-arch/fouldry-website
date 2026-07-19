# Foundry — Automated Digital Template Store (MVP)

A hands-off business-in-a-box: sell digital templates/ebooks with zero
manual fulfillment. Stripe handles money, Supabase handles auth + access
control + storage, Next.js glues it together.

## Stack
- **Next.js 14** (App Router, TypeScript) — frontend + API routes
- **Tailwind CSS** — styling (blueprint/drafting-table design system)
- **Supabase** — Postgres DB, magic-link auth, private file storage, RLS
- **Stripe Checkout + Webhooks** — payments and automatic access granting

## The 4 automated systems, and where they live

| System | Files |
|---|---|
| Landing page | `app/page.tsx`, `components/Hero.tsx`, `SocialProof.tsx`, `PricingGrid.tsx`, `FAQ.tsx` |
| Checkout + webhook | `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts` |
| Passwordless auth + delivery | `app/login/page.tsx`, `app/auth/callback/route.ts`, `app/dashboard/page.tsx`, `components/DownloadButton.tsx` |
| Lead capture | `components/NewsletterForm.tsx`, `app/api/newsletter/route.ts` |

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project**, then run, in order, in the SQL editor:
   - `supabase/schema.sql`
   - `supabase/storage_policies.sql`
   - Enable **Email → Magic Link** under Authentication → Providers (on by default).

3. **Upload your product file** to the `products` storage bucket at the
   path stored in `file_path` (e.g. `startup-brand-kit/startup-brand-kit-v1.zip`).

4. **Create Stripe Products/Prices** for each plan in the Stripe dashboard,
   then copy the Price IDs into your `.env.local`.

5. **Copy `.env.example` to `.env.local`** and fill in every value:
   - Supabase URL/keys: Project Settings → API
   - Stripe secret key: Developers → API keys
   - Stripe webhook secret: see next step

6. **Point Stripe at your webhook.** In development:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET`.
   In production, add a webhook endpoint in the Stripe dashboard pointed
   at `https://yourdomain.com/api/webhooks/stripe`, subscribed to
   `checkout.session.completed` and `charge.refunded`.

7. **Run it**
   ```bash
   npm run dev
   ```

## How a sale flows end-to-end
1. Visitor clicks "Buy now" → `POST /api/checkout` creates a Stripe
   Checkout Session and redirects them to Stripe.
2. They pay. Stripe calls `POST /api/webhooks/stripe`.
3. The webhook (using the Supabase **service role** key, which bypasses
   RLS) finds-or-creates their user, records the `purchases` row, and
   links their `stripe_customer_id`.
4. The buyer gets a login link (see the comment in the webhook file for
   wiring up your transactional email provider).
5. They land on `/dashboard`, which reads their `purchases` under RLS —
   only their own rows are visible — and shows a **Download** button.
6. Download requests a 60-second signed URL from Supabase Storage; the
   storage policy re-checks their `purchases` row before issuing it.

## Notes on going to production
- Swap the two placeholder plans in `PricingGrid.tsx` for your real
  products, and update `supabase/schema.sql`'s seed row (or add more).
- Sync the `leads` table to MailerLite/Loops via their native
  integrations, a scheduled Supabase Edge Function, or a nightly Zapier
  poll — this MVP intentionally just captures the data reliably and
  leaves the ESP choice to you.
- Add a `NEXT_PUBLIC_SITE_URL` that matches your real domain before
  deploying, since it's used in Stripe redirect and auth callback URLs.
