insert into public.services (name, slug, description, duration_minutes, base_price, is_active)
values
  ('Dental Cleaning', 'dental-cleaning', 'Routine dental cleaning and oral exam.', 60, 1500.00, true),
  ('Tooth Filling', 'tooth-filling', 'Restorative treatment for cavities.', 45, 2200.00, true),
  ('Tooth Extraction', 'tooth-extraction', 'Simple tooth extraction service.', 60, 3000.00, true)
on conflict (slug) do nothing;

with ranked_users as (
  select
    u.id,
    u.email,
    row_number() over (order by u.created_at asc) as rn
  from auth.users u
  where u.email is not null
  limit 2
)
insert into public.profiles (
  auth_user_id,
  role,
  username,
  email,
  first_name,
  last_name,
  middle_name,
  phone,
  avatar_url,
  is_active
)
select
  ru.id,
  case when ru.rn = 1 then 'admin' else 'patient' end,
  case when ru.rn = 1 then 'admin_seed' else 'patient_seed' end,
  ru.email,
  case when ru.rn = 1 then 'Admin' else 'Patient' end,
  'Seed',
  null,
  null,
  null,
  true
from ranked_users ru
on conflict (auth_user_id) do update
set
  role = excluded.role,
  email = excluded.email,
  updated_at = now();

insert into public.notification_preferences (
  profile_id,
  in_app_enabled,
  email_enabled,
  appointment_updates_enabled,
  points_updates_enabled,
  marketing_updates_enabled
)
select
  p.id,
  true,
  true,
  true,
  true,
  false
from public.profiles p
on conflict (profile_id) do nothing;

insert into public.patient_details (
  profile_id,
  birth_date,
  sex,
  city,
  province,
  notes
)
select
  p.id,
  null,
  null,
  'Sample City',
  'Sample Province',
  'Seed patient profile details.'
from public.profiles p
where p.role = 'patient'
on conflict (profile_id) do nothing;

insert into public.patient_points (patient_profile_id, total_points)
select p.id, 0
from public.profiles p
where p.role = 'patient'
on conflict (patient_profile_id) do nothing;

with admin_profile as (
  select id from public.profiles where role = 'admin' order by created_at asc limit 1
)
insert into public.appointment_slots (
  slot_date,
  start_time,
  end_time,
  max_capacity,
  booked_count,
  is_active,
  created_by
)
select
  current_date + 1,
  time '09:00',
  time '10:00',
  3,
  0,
  true,
  a.id
from admin_profile a
where not exists (
  select 1
  from public.appointment_slots s
  where s.slot_date = current_date + 1
    and s.start_time = time '09:00'
    and s.created_by = a.id
);
