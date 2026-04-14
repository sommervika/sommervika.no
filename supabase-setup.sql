-- =========================================================================
-- Supabase-oppsett for sommervika.no /co2
-- Kjør dette én gang i Supabase SQL Editor (Dashboard → SQL → New query).
-- =========================================================================

-- 1) Aktiver pgcrypto for passord-hashing (bcrypt).
-- Supabase installerer extensions i `extensions`-skjema.
create extension if not exists pgcrypto with schema extensions;

-- 2) Tabell for flyreiser.
create table if not exists public.flights (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  date          date not null,
  traveler      text,
  note          text,
  legs          jsonb not null,         -- [{ "from": "OSL", "to": "LHR", "aircraft": "B737MAX8" }, ...]
  passengers    int  not null check (passengers >= 1),
  travel_class  text not null check (travel_class in ('economy','business','first')),
  round_trip    boolean not null
);

create index if not exists flights_date_idx on public.flights (date desc);

-- 3) Enkel config-tabell for å holde hashet familiepassord.
create table if not exists public.app_config (
  key   text primary key,
  value text not null
);

-- 4) Sett familie-passordet. ENDRE 'ditt-hemmelige-passord' før du kjører.
--    (Dobbel-kjøring overskriver forrige hash.)
insert into public.app_config (key, value)
values ('family_password_hash', extensions.crypt('ditt-hemmelige-passord', extensions.gen_salt('bf')))
on conflict (key) do update set value = excluded.value;

-- 5) RLS: alle kan lese, ingen kan skrive direkte (kun via RPC under).
alter table public.flights enable row level security;
alter table public.app_config enable row level security;

drop policy if exists flights_read on public.flights;
create policy flights_read on public.flights
  for select using (true);

-- Ingen policies på app_config = ingen lese/skrive-tilgang for anon.

-- 6) RPC for å legge til reise (passordbeskyttet).
create or replace function public.add_flight(
  p_password     text,
  p_date         date,
  p_traveler     text,
  p_note         text,
  p_legs         jsonb,
  p_passengers   int,
  p_travel_class text,
  p_round_trip   boolean
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_id   uuid;
begin
  select value into v_hash from app_config where key = 'family_password_hash';
  if v_hash is null or crypt(p_password, v_hash) <> v_hash then
    raise exception 'Invalid password' using errcode = '28P01';
  end if;
  insert into flights (date, traveler, note, legs, passengers, travel_class, round_trip)
  values (p_date, p_traveler, p_note, p_legs, p_passengers, p_travel_class, p_round_trip)
  returning id into v_id;
  return v_id;
end;
$$;

-- 7) RPC for å slette reise (passordbeskyttet).
create or replace function public.delete_flight(p_password text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_hash text;
begin
  select value into v_hash from app_config where key = 'family_password_hash';
  if v_hash is null or crypt(p_password, v_hash) <> v_hash then
    raise exception 'Invalid password' using errcode = '28P01';
  end if;
  delete from flights where id = p_id;
end;
$$;

-- 8) Gi anon-rollen rett til å kalle funksjonene.
grant execute on function public.add_flight(text,date,text,text,jsonb,int,text,boolean) to anon;
grant execute on function public.delete_flight(text,uuid) to anon;

-- 9) (valgfritt) Endre passordet senere:
-- update public.app_config
-- set value = crypt('nytt-passord', gen_salt('bf'))
-- where key = 'family_password_hash';
