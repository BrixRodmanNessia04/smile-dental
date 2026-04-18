create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_profile_id uuid not null references public.profiles(id),
  service_id uuid not null references public.services(id),
  slot_id uuid references public.appointment_slots(id),
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rescheduled', 'cancelled', 'completed', 'no_show', 'rejected')),
  reason text,
  admin_notes text,
  cancellation_reason text,
  approved_by uuid references public.profiles(id),
  completed_by uuid references public.profiles(id),
  cancelled_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointment_status_logs (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by uuid not null references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_appointments_patient_profile_id
  on public.appointments (patient_profile_id);

create index if not exists idx_appointments_service_id
  on public.appointments (service_id);

create index if not exists idx_appointments_slot_id
  on public.appointments (slot_id);

create index if not exists idx_appointments_status
  on public.appointments (status);

create index if not exists idx_appointments_appointment_date
  on public.appointments (appointment_date);

create index if not exists idx_appointments_patient_profile_id_appointment_date
  on public.appointments (patient_profile_id, appointment_date);

create index if not exists idx_appointments_status_appointment_date
  on public.appointments (status, appointment_date);

create index if not exists idx_appointment_status_logs_appointment_id
  on public.appointment_status_logs (appointment_id);
