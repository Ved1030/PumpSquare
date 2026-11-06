-- ============================================================================
-- PUMPSQUARE - Dynamic product review tabs
--
-- Lets administrators add custom technical information tabs alongside the
-- eight standard tabs. Safe to run: idempotent, keeps every existing row and
-- only widens the schema. Run in the Supabase SQL editor or with
-- `npm run db:migrate:dynamic-tabs`.
--
-- Safe to run before or after backend/migration-technical-tables.sql: the
-- tables are created here too if they do not exist yet.
-- ============================================================================

create table if not exists public.product_review_tabs (
  product_id uuid not null references public.products (id) on delete cascade,
  tab_key text not null,
  enabled boolean not null default true,
  heading text not null default '',
  intro text not null default '',
  updated_at timestamptz not null default now(),
  primary key (product_id, tab_key)
);

-- Older installs restricted tab_key to the eight standard keys.
alter table public.product_review_tabs drop constraint if exists product_review_tabs_tab_key_check;

alter table public.product_review_tabs add column if not exists label text not null default '';
alter table public.product_review_tabs add column if not exists is_custom boolean not null default false;
alter table public.product_review_tabs add column if not exists sort_order int not null default 0;

-- Existing products keep the standard order; custom tabs follow afterwards.
update public.product_review_tabs
set sort_order = case tab_key
  when 'series' then 0
  when 'operational' then 1
  when 'installation' then 2
  when 'advantages' then 3
  when 'industry' then 4
  when 'sector' then 5
  when 'application' then 6
  when 'measures' then 7
  else 8
end
where sort_order = 0
  and tab_key in ('series', 'operational', 'installation', 'advantages', 'industry', 'sector', 'application', 'measures');

-- Custom tabs saved before the label column existed keep an empty label: their
-- key is a lowercased slug with no reliable casing, so the admin is asked to
-- name them instead of the public page showing an inferred name.
-- (label is plain text, stored exactly as entered by the administrator.)

create index if not exists product_review_tabs_product_order_idx
  on public.product_review_tabs (product_id, sort_order);

create table if not exists public.product_review_features (
  id uuid primary key,
  product_id uuid not null,
  tab_key text not null,
  label text,
  detail text not null default '',
  sort_order int not null default 0,
  foreign key (product_id, tab_key) references public.product_review_tabs (product_id, tab_key) on delete cascade
);

create index if not exists product_review_features_product_idx
  on public.product_review_features (product_id, tab_key, sort_order);

alter table public.product_review_tabs enable row level security;
alter table public.product_review_features enable row level security;

-- Public visitors: visible tabs of published, non-deleted products only.
-- Writes go through the backend with the service role key.
drop policy if exists "product_review_tabs_public_read" on public.product_review_tabs;
create policy "product_review_tabs_public_read" on public.product_review_tabs for select using (
  enabled
  and exists (select 1 from public.products p where p.id = product_id and p.status = 'published' and p.deleted_at is null)
);

drop policy if exists "product_review_features_public_read" on public.product_review_features;
create policy "product_review_features_public_read" on public.product_review_features for select using (
  exists (
    select 1 from public.product_review_tabs t
    join public.products p on p.id = t.product_id
    where t.product_id = product_review_features.product_id
      and t.tab_key = product_review_features.tab_key
      and t.enabled
      and p.status = 'published'
      and p.deleted_at is null
  )
);

-- Keep updated_at current when tabs are edited.
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_product_review_tabs_updated_at on public.product_review_tabs;
create trigger update_product_review_tabs_updated_at
  before update on public.product_review_tabs
  for each row execute function public.update_updated_at_column();
