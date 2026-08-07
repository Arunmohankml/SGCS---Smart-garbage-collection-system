-- CivicEye PostgreSQL schema (Supabase)
-- Run in the Supabase SQL editor.
-- All ID columns use text to be compatible with Firebase Auth UIDs.

create extension if not exists pgcrypto;

-- User profiles mirror Firebase Auth users.
create table if not exists public.profiles (
  id          text primary key,
  email       text not null,
  name        text,
  avatar_url  text,
  role        text not null default 'citizen' check (role in ('citizen', 'authority')),
  fcm_token   text,
  created_at  timestamptz not null default now()
);

-- Categories
create type public.issue_category as enum (
  'pothole', 'garbage', 'water_leakage', 'streetlight',
  'drainage', 'road_damage', 'other'
);

-- Status
create type public.issue_status as enum (
  'open', 'in_progress', 'resolved', 'reopened', 'rejected'
);

-- Complaints
create table if not exists public.issues (
  id                    text primary key default gen_random_uuid()::text,
  reporter_id           text references public.profiles (id),
  reference             text unique,
  category              public.issue_category not null,
  title                 text not null,
  description           text,
  status                public.issue_status not null default 'open',
  location              text,
  address               text,
  landmark              text,
  images                jsonb not null default '[]',
  department            text,
  ai_category_confidence numeric(4,3) default 0,
  ai_spam_score          numeric(4,3) default 0,
  ai_duplicate_of        text references public.issues (id),
  priority_score         smallint default 0,
  votes                  integer not null default 0,
  fixed_votes            integer not null default 0,
  still_exists_votes     integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  resolved_at            timestamptz
);

create index if not exists issues_status_idx on public.issues (status);
create index if not exists issues_priority_idx on public.issues (priority_score desc);

-- Resolution verification votes (one per user per issue)
create table if not exists public.resolution_votes (
  id        text primary key default gen_random_uuid()::text,
  issue_id  text not null references public.issues (id) on delete cascade,
  voter_id  text not null references public.profiles (id) on delete cascade,
  vote      text not null default 'fixed',
  created_at timestamptz not null default now(),
  unique (issue_id, voter_id)
);

-- Trigger: bump updated_at on changes
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_issues_updated on public.issues;
create trigger trg_issues_updated before update on public.issues
  for each row execute procedure public.set_updated_at();

-- Auto-reopen when enough citizens say an issue still exists
create or replace function public.maybe_reopen() returns trigger as $$
begin
  if new.votes >= 5 and new.still_exists_votes >= 5 then
    new.status := 'reopened';
  end if;
  return new;
end; $$ language plpgsql;

-- Row Level Security
alter table public.issues enable row level security;
alter table public.profiles enable row level security;
alter table public.resolution_votes enable row level security;

-- Anyone can read issues; only authenticated users can create/report.
create policy "Issues are public" on public.issues for select using (true);
create policy "Citizens can report" on public.issues
  for insert with check (auth.uid()::text = reporter_id);