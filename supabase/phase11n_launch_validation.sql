-- ==========================================================
-- Farooqi Online Quran Academy — Phase 11N
-- Launch Validation / Audit Trail / Final Operational Readiness
-- Run AFTER Phase 11M SQL.
-- ==========================================================

create table if not exists public.quran_launch_audits (
  id uuid primary key default gen_random_uuid(),
  audit_type text not null
    check (audit_type in ('smoke','role_test','security','release')),
  result text not null
    check (result in ('pass','warn','fail')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quran_launch_audits_created_idx
on public.quran_launch_audits(created_at desc);

alter table public.quran_launch_audits enable row level security;

drop policy if exists "No direct Quran launch audit access"
on public.quran_launch_audits;

create policy "No direct Quran launch audit access"
on public.quran_launch_audits
for all to authenticated
using (false)
with check (false);

-- Keep recent release checks manageable.
create or replace function public.cleanup_quran_release_checks()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.quran_release_checks
  where checked_at < now() - interval '90 days';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
