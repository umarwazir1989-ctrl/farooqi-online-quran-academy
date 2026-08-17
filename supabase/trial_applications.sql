-- Farooqi Online Quran Academy — Phase 2B
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.trial_applications (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_name text,
  email text,
  whatsapp text not null,
  country text not null,
  city text,
  age integer,
  gender text,
  preferred_teacher_gender text,
  course text not null,
  preferred_language text,
  timezone text,
  preferred_days text[],
  preferred_time text,
  previous_level text,
  message text,
  locale text not null default 'en',
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new','contacted','trial_scheduled','trial_completed','approved','enrolled','closed')),
  assigned_teacher text,
  trial_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trial_applications_status_idx
  on public.trial_applications(status);

create index if not exists trial_applications_created_at_idx
  on public.trial_applications(created_at desc);

alter table public.trial_applications enable row level security;

-- No public direct access policies are added.
-- The website API uses the service-role key only on the server.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_trial_applications_updated_at on public.trial_applications;

create trigger set_trial_applications_updated_at
before update on public.trial_applications
for each row execute function public.set_updated_at();
