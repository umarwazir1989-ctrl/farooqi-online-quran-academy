-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11L
-- Release Candidate / Automation / Cleanup / Monitoring
-- Run AFTER Phase 11K SQL.
-- ==========================================================

create extension if not exists pgcrypto;

alter table public.quran_parent_digests
  add column if not exists delivered_at timestamptz,
  add column if not exists delivery_status text
    check (delivery_status is null or delivery_status in ('queued','sent','failed','skipped')),
  add column if not exists delivery_error text;

create index if not exists quran_parent_digests_delivery_idx
  on public.quran_parent_digests(delivery_status, week_start desc);

create table if not exists public.quran_release_checks (
  id uuid primary key default gen_random_uuid(),
  check_name text not null,
  check_status text not null
    check (check_status in ('pass','warn','fail')),
  details jsonb not null default '{}'::jsonb,
  checked_at timestamptz not null default now()
);

create index if not exists quran_release_checks_checked_idx
  on public.quran_release_checks(checked_at desc);

alter table public.quran_release_checks enable row level security;

drop policy if exists "No direct Quran release check access"
on public.quran_release_checks;

create policy "No direct Quran release check access"
on public.quran_release_checks
for all to authenticated
using (false)
with check (false);

create or replace function public.cleanup_quran_api_rate_limits()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.quran_api_rate_limits
  where window_start < now() - interval '24 hours';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
