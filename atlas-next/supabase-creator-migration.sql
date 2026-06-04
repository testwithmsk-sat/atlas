-- Run this in your Supabase SQL editor to set up the digital_products table

create table if not exists digital_products (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  goal        text not null,
  category    text not null default 'general',
  title       text not null,
  output      jsonb not null,
  created_at  timestamptz not null default now()
);

-- Index for fast per-user lookups
create index if not exists digital_products_user_id_idx
  on digital_products(user_id, created_at desc);

-- Row Level Security: users can only see and write their own rows
alter table digital_products enable row level security;

create policy "Users can read own products"
  on digital_products for select
  using (auth.uid() = user_id);

create policy "Users can insert own products"
  on digital_products for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own products"
  on digital_products for delete
  using (auth.uid() = user_id);
