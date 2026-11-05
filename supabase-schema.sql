-- Supabase Schema for Pumpsquare Admin Dashboard
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Admin users table
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text not null,
  password_hash text not null,
  role text not null check (role in ('superadmin', 'product_manager', 'read_only')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create unique index if not exists admin_users_email_key on admin_users (lower(email));

-- Admin sessions table
create table if not exists admin_sessions (
  token_hash text primary key,
  user_id uuid not null references admin_users (id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists admin_sessions_user_idx on admin_sessions (user_id);

-- Admin login attempts table
create table if not exists admin_login_attempts (
  identifier text primary key,
  failures int not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz
);

-- Product categories table
create table if not exists product_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  category_id uuid references product_categories (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  summary text not null default '',
  description text not null default '',
  image_url text,
  datasheet_url text,
  datasheet_name text,
  series text[] not null default '{}',
  features text[] not null default '{}',
  applications text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  materials jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on products (status);
create index if not exists products_category_idx on products (category_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
alter table admin_users enable row level security;
alter table admin_sessions enable row level security;
alter table admin_login_attempts enable row level security;
alter table product_categories enable row level security;
alter table products enable row level security;

-- Admin users: only accessible via service role (backend)
create policy "admin_users_service_role_only" on admin_users
  for all using (false);

-- Admin sessions: only accessible via service role (backend)
create policy "admin_sessions_service_role_only" on admin_sessions
  for all using (false);

-- Login attempts: only accessible via service role (backend)
create policy "admin_login_attempts_service_role_only" on admin_login_attempts
  for all using (false);

-- Product categories: public read for published categories
create policy "product_categories_public_read" on product_categories
  for select using (true);

-- Product categories: write only via service role
create policy "product_categories_write_service_role" on product_categories
  for all using (false);

-- Products: public read for published products only
create policy "products_public_read" on products
  for select using (status = 'published');

-- Products: write only via service role
create policy "products_write_service_role" on products
  for all using (false);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Triggers for updated_at
create trigger update_admin_users_updated_at
  before update on admin_users
  for each row execute function update_updated_at_column();

create trigger update_product_categories_updated_at
  before update on product_categories
  for each row execute function update_updated_at_column();

create trigger update_products_updated_at
  before update on products
  for each row execute function update_updated_at_column();