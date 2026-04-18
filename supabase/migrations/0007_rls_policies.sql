create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_profile_role() = 'admin', false);
$$;

grant execute on function public.current_profile_id() to anon, authenticated;
grant execute on function public.current_profile_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.patient_details enable row level security;
alter table public.services enable row level security;
alter table public.appointment_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_logs enable row level security;
alter table public.patient_points enable row level security;
alter table public.point_transactions enable row level security;
alter table public.posts enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.email_logs enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select
on public.profiles
for select
using (public.is_admin() or id = public.current_profile_id());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert
on public.profiles
for insert
to authenticated
with check (public.is_admin() or auth_user_id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update
on public.profiles
for update
to authenticated
using (public.is_admin() or id = public.current_profile_id())
with check (public.is_admin() or id = public.current_profile_id());

drop policy if exists patient_details_select on public.patient_details;
create policy patient_details_select
on public.patient_details
for select
using (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists patient_details_insert on public.patient_details;
create policy patient_details_insert
on public.patient_details
for insert
to authenticated
with check (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists patient_details_update on public.patient_details;
create policy patient_details_update
on public.patient_details
for update
to authenticated
using (public.is_admin() or profile_id = public.current_profile_id())
with check (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists services_select on public.services;
create policy services_select
on public.services
for select
using (true);

drop policy if exists services_manage on public.services;
create policy services_manage
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists appointment_slots_select on public.appointment_slots;
create policy appointment_slots_select
on public.appointment_slots
for select
to authenticated
using (true);

drop policy if exists appointment_slots_manage on public.appointment_slots;
create policy appointment_slots_manage
on public.appointment_slots
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists appointments_select on public.appointments;
create policy appointments_select
on public.appointments
for select
to authenticated
using (public.is_admin() or patient_profile_id = public.current_profile_id());

drop policy if exists appointments_insert on public.appointments;
create policy appointments_insert
on public.appointments
for insert
to authenticated
with check (public.is_admin() or patient_profile_id = public.current_profile_id());

drop policy if exists appointments_update on public.appointments;
create policy appointments_update
on public.appointments
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists appointment_status_logs_select on public.appointment_status_logs;
create policy appointment_status_logs_select
on public.appointment_status_logs
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.appointments a
    where a.id = appointment_id
      and a.patient_profile_id = public.current_profile_id()
  )
);

drop policy if exists appointment_status_logs_insert on public.appointment_status_logs;
create policy appointment_status_logs_insert
on public.appointment_status_logs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists patient_points_select on public.patient_points;
create policy patient_points_select
on public.patient_points
for select
to authenticated
using (public.is_admin() or patient_profile_id = public.current_profile_id());

drop policy if exists patient_points_manage on public.patient_points;
create policy patient_points_manage
on public.patient_points
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists point_transactions_select on public.point_transactions;
create policy point_transactions_select
on public.point_transactions
for select
to authenticated
using (public.is_admin() or patient_profile_id = public.current_profile_id());

drop policy if exists point_transactions_manage on public.point_transactions;
create policy point_transactions_manage
on public.point_transactions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists posts_select on public.posts;
create policy posts_select
on public.posts
for select
using (status = 'published' or public.is_admin());

drop policy if exists posts_manage on public.posts;
create policy posts_manage
on public.posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists notifications_select on public.notifications;
create policy notifications_select
on public.notifications
for select
to authenticated
using (public.is_admin() or recipient_profile_id = public.current_profile_id());

drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert
on public.notifications
for insert
to authenticated
with check (public.is_admin() or recipient_profile_id = public.current_profile_id());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update
on public.notifications
for update
to authenticated
using (public.is_admin() or recipient_profile_id = public.current_profile_id())
with check (public.is_admin() or recipient_profile_id = public.current_profile_id());

drop policy if exists notification_preferences_select on public.notification_preferences;
create policy notification_preferences_select
on public.notification_preferences
for select
to authenticated
using (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists notification_preferences_insert on public.notification_preferences;
create policy notification_preferences_insert
on public.notification_preferences
for insert
to authenticated
with check (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists notification_preferences_update on public.notification_preferences;
create policy notification_preferences_update
on public.notification_preferences
for update
to authenticated
using (public.is_admin() or profile_id = public.current_profile_id())
with check (public.is_admin() or profile_id = public.current_profile_id());

drop policy if exists email_logs_admin_only on public.email_logs;
create policy email_logs_admin_only
on public.email_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
