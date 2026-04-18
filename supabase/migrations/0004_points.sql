create table if not exists public.patient_points (
  id uuid primary key default gen_random_uuid(),
  patient_profile_id uuid not null unique references public.profiles(id) on delete cascade,
  total_points integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  patient_profile_id uuid not null references public.profiles(id),
  appointment_id uuid references public.appointments(id),
  type text not null check (type in ('earn', 'redeem', 'adjustment')),
  points integer not null,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_point_transactions_patient_profile_id
  on public.point_transactions (patient_profile_id);

create index if not exists idx_point_transactions_appointment_id
  on public.point_transactions (appointment_id);

create index if not exists idx_point_transactions_created_at
  on public.point_transactions (created_at);
