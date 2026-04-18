create extension if not exists "uuid-ossp";

-- ADMIN
with new_user as (
  insert into auth.users (
    id,
    email,
    email_confirmed_at,
    role,
    aud,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    'admin@clinic.com',
    now(),
    'authenticated',
    'authenticated',
    now(),
    now()
  )
  returning id
)
insert into public.profiles (
  auth_user_id,
  role,
  email,
  first_name,
  last_name
)
select id, 'admin', 'admin@clinic.com', 'System', 'Admin'
from new_user;

-- PATIENT 1
with new_user as (
  insert into auth.users (
    id,
    email,
    email_confirmed_at,
    role,
    aud,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    'patient1@test.com',
    now(),
    'authenticated',
    'authenticated',
    now(),
    now()
  )
  returning id
)
insert into public.profiles (
  auth_user_id,
  role,
  email,
  first_name,
  last_name
)
select id, 'patient', 'patient1@test.com', 'John', 'Doe'
from new_user;

-- PATIENT 2
with new_user as (
  insert into auth.users (
    id,
    email,
    email_confirmed_at,
    role,
    aud,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    'patient2@test.com',
    now(),
    'authenticated',
    'authenticated',
    now(),
    now()
  )
  returning id
)
insert into public.profiles (
  auth_user_id,
  role,
  email,
  first_name,
  last_name
)
select id, 'patient', 'patient2@test.com', 'Jane', 'Smith'
from new_user;

-- PATIENT 3
with new_user as (
  insert into auth.users (
    id,
    email,
    email_confirmed_at,
    role,
    aud,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    'patient3@test.com',
    now(),
    'authenticated',
    'authenticated',
    now(),
    now()
  )
  returning id
)
insert into public.profiles (
  auth_user_id,
  role,
  email,
  first_name,
  last_name
)
select id, 'patient', 'patient3@test.com', 'Mark', 'Lee'
from new_user;