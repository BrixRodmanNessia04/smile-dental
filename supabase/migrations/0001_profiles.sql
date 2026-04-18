create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'patient')),
  username text unique,
  email text not null unique,
  first_name text not null,
  last_name text not null,
  middle_name text,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles (role);

create table if not exists public.patient_details (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  birth_date date,
  sex text,
  address_line text,
  city text,
  province text,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  duration_minutes integer not null,
  base_price numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointment_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  max_capacity integer not null default 1,
  booked_count integer not null default 0,
  is_active boolean not null default true,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointment_slots_capacity_check check (max_capacity > 0),
  constraint appointment_slots_booked_non_negative_check check (booked_count >= 0),
  constraint appointment_slots_booked_within_capacity_check check (booked_count <= max_capacity)
);

create index if not exists idx_appointment_slots_slot_date
  on public.appointment_slots (slot_date);

create index if not exists idx_appointment_slots_is_active
  on public.appointment_slots (is_active);

create index if not exists idx_appointment_slots_slot_date_is_active
  on public.appointment_slots (slot_date, is_active);
