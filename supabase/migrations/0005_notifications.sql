create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  notification_id uuid references public.notifications(id) on delete set null,
  email_to text not null,
  subject text not null,
  template_key text,
  status text not null check (status in ('queued', 'sent', 'failed')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_recipient_profile_id
  on public.notifications (recipient_profile_id);

create index if not exists idx_notifications_is_read
  on public.notifications (is_read);

create index if not exists idx_notifications_created_at_desc
  on public.notifications (created_at desc);

create index if not exists idx_notifications_recipient_profile_id_is_read
  on public.notifications (recipient_profile_id, is_read);
