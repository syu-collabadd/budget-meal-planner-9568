-- StretchBites — Supabase Schema
-- Run this in your Supabase SQL Editor (Database → SQL Editor → New query)

-- ─────────────────────────────────────────
-- 1. PROFILES
-- ─────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key references auth.users on delete cascade,
  display_name    text,
  weekly_budget   numeric(10, 2) not null default 150.00,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────
-- 2. RECIPES
-- ─────────────────────────────────────────
create table if not exists recipes (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text not null default '',
  category            text not null check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  prep_time_minutes   integer not null default 10,
  cook_time_minutes   integer not null default 20,
  servings            integer not null default 4,
  cost_per_serving    numeric(10, 2) not null default 2.00,
  total_cost          numeric(10, 2) not null default 8.00,
  ingredients         jsonb not null default '[]',
  instructions        text not null default '',
  tags                text[] not null default '{}',
  image_url           text,
  created_at          timestamptz not null default now()
);

alter table recipes enable row level security;

-- Recipes are public read
create policy "Recipes are publicly readable" on recipes for select using (true);


-- ─────────────────────────────────────────
-- 3. MEAL PLANS
-- ─────────────────────────────────────────
create table if not exists meal_plans (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  recipe_id         uuid references recipes on delete set null,
  custom_meal_name  text,
  planned_date      date not null,
  meal_type         text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  servings          integer not null default 1,
  estimated_cost    numeric(10, 2) not null default 0,
  notes             text,
  created_at        timestamptz not null default now()
);

alter table meal_plans enable row level security;

create policy "Users can manage own meal plans" on meal_plans
  for all using (auth.uid() = user_id);

create index if not exists meal_plans_user_date_idx on meal_plans (user_id, planned_date);


-- ─────────────────────────────────────────
-- 4. SHOPPING LIST ITEMS
-- ─────────────────────────────────────────
create table if not exists shopping_list_items (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,
  name              text not null,
  category          text not null default 'Other',
  quantity          text not null default '',
  estimated_cost    numeric(10, 2) not null default 0,
  is_checked        boolean not null default false,
  week_start_date   date not null,
  created_at        timestamptz not null default now()
);

alter table shopping_list_items enable row level security;

create policy "Users can manage own shopping list" on shopping_list_items
  for all using (auth.uid() = user_id);

create index if not exists shopping_list_user_week_idx on shopping_list_items (user_id, week_start_date);
