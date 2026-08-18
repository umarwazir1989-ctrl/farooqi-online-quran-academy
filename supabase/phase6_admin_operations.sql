-- ==========================================================
-- Farooqi Online Quran Academy — Phase 6
-- Announcements + Teacher Leave + Academic Calendar
-- + Audit Log + Backup support
-- Run AFTER Phase 5.
-- ==========================================================

create extension if not exists pgcrypto;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ur text,
  body_en text not null,
  body_ur text,
  audience text not null default 'all'
    check (audience in ('all','students','parents','teachers')),
  priority text not null default 'normal'
    check (priority in ('normal','important','urgent')),
  publish_from timestamptz not null default now(),
  publish_until timestamptz,
  status text not null default 'published'
    check (status in ('draft','published','archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists announcements_status_idx
on public.announcements(status, publish_from desc);

create table if not exists public.teacher_leave_requests (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  leave_type text not null default 'personal'
    check (leave_type in ('personal','sick','emergency','vacation','other')),
  start_date date not null,
  end_date date not null,
  reason text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','cancelled')),
  admin_notes text,
  decided_by uuid references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists teacher_leave_status_idx
on public.teacher_leave_requests(status, start_date);

create table if not exists public.academic_calendar (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ur text,
  event_type text not null default 'holiday'
    check (event_type in ('holiday','exam','event','training','closure','other')),
  start_date date not null,
  end_date date not null,
  description_en text,
  description_ur text,
  applies_to text not null default 'all'
    check (applies_to in ('all','students','teachers','staff')),
  status text not null default 'active'
    check (status in ('active','cancelled')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists academic_calendar_date_idx
on public.academic_calendar(start_date, end_date);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  actor_role text,
  action text not null,
  entity_type text,
  entity_id text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx
on public.audit_logs(created_at desc);

create index if not exists audit_logs_actor_idx
on public.audit_logs(actor_user_id, created_at desc);

create or replace function public.set_phase6_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_phase6_updated_at();

drop trigger if exists set_teacher_leave_updated_at on public.teacher_leave_requests;
create trigger set_teacher_leave_updated_at
before update on public.teacher_leave_requests
for each row execute function public.set_phase6_updated_at();

drop trigger if exists set_academic_calendar_updated_at on public.academic_calendar;
create trigger set_academic_calendar_updated_at
before update on public.academic_calendar
for each row execute function public.set_phase6_updated_at();

alter table public.announcements enable row level security;
alter table public.teacher_leave_requests enable row level security;
alter table public.academic_calendar enable row level security;
alter table public.audit_logs enable row level security;

create or replace view public.teacher_leave_overview as
select
  l.id,
  l.leave_type,
  l.start_date,
  l.end_date,
  l.reason,
  l.status,
  l.admin_notes,
  l.created_at,
  t.id as teacher_id,
  t.teacher_code,
  t.full_name as teacher_name
from public.teacher_leave_requests l
join public.teachers t on t.id = l.teacher_id;

create or replace view public.active_announcements as
select *
from public.announcements
where status = 'published'
  and publish_from <= now()
  and (publish_until is null or publish_until >= now());
