-- =========================================================
-- FOUNDRY TEMPLATES — DATABASE SCHEMA
-- Run this in the Supabase SQL editor (or via CLI migration)
-- =========================================================

-- ---------------------------------------------------------
-- 1. PROFILES
-- One row per authenticated user. Created automatically
-- by a trigger the moment someone signs up via magic link.
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- 2. PRODUCTS
-- The digital templates/ebooks you sell. Managed by you
-- (service role / Supabase dashboard), read-only to buyers.
-- ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_cents integer not null,
  stripe_price_id text not null,
  file_path text not null, -- path inside a private Supabase Storage bucket
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true);

-- ---------------------------------------------------------
-- 3. PURCHASES
-- Written only by the Stripe webhook (service role key),
-- read by the owning user to power their dashboard.
-- ---------------------------------------------------------
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  amount_paid_cents integer not null,
  status text not null default 'completed', -- completed | refunded
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Users can view their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- No insert/update policy for regular users — only the service role
-- (used server-side in the webhook) can write purchases. This is the
-- enforcement point that makes access "automatic" and tamper-proof.

-- ---------------------------------------------------------
-- 4. LEADS
-- Footer newsletter signups. Public insert (anyone can join
-- the list), no public read (protects your list from scraping).
-- ---------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'footer_newsletter',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can submit a lead"
  on public.leads for insert
  with check (true);

-- ---------------------------------------------------------
-- 5. Helpful index for dashboard queries
-- ---------------------------------------------------------
create index if not exists purchases_user_id_idx on public.purchases (user_id);
create index if not exists leads_email_idx on public.leads (email);

-- ---------------------------------------------------------
-- 6. Seed one example product (edit before going live)
-- ---------------------------------------------------------
insert into public.products (slug, name, description, price_cents, stripe_price_id, file_path)
values (
  'startup-brand-kit',
  'Startup Brand Kit',
  'A complete Figma + Notion kit: pitch deck, brand guidelines, and a launch checklist.',
  4900,
  'price_replace_with_real_stripe_price_id',
  'startup-brand-kit/startup-brand-kit-v1.zip'
)
on conflict (slug) do nothing;
