-- =========================================================
-- STORAGE: private "products" bucket + access policy
-- Run after schema.sql. Creates the bucket buyers' files live
-- in, and a policy so a signed URL only ever validates for
-- someone with a matching row in `purchases`.
-- =========================================================

insert into storage.buckets (id, name, public)
values ('products', 'products', false)
on conflict (id) do nothing;

-- Only allow SELECT (download) on an object if the requesting user
-- has a completed purchase whose product's file_path matches the
-- object's path. This is what makes `createSignedUrl` fail for
-- anyone who hasn't paid, even if they guess the file path.
create policy "Users can download files they purchased"
  on storage.objects for select
  using (
    bucket_id = 'products'
    and exists (
      select 1
      from public.purchases
      join public.products on public.products.id = public.purchases.product_id
      where public.purchases.user_id = auth.uid()
        and public.purchases.status = 'completed'
        and public.products.file_path = storage.objects.name
    )
  );

-- Uploading/managing files is done by you via the Supabase dashboard
-- or service-role scripts — no public insert policy is defined here.
