-- ─────────────────────────────────────────────────────────────────
-- Music Machaanz Academy — Initial Schema
-- Run this in Supabase SQL Editor or via Supabase CLI
-- ─────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Batches ──────────────────────────────────────────────────────
create table if not exists batches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  schedule    text,
  created_at  timestamptz not null default now()
);

-- ── Students ─────────────────────────────────────────────────────
create table if not exists students (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  phone                 text,
  batch_id              uuid references batches(id) on delete set null,
  fee_per_day_override  numeric(10,2),
  created_at            timestamptz not null default now()
);

-- ── Attendance ───────────────────────────────────────────────────
create type if not exists attendance_status as enum ('present', 'absent', 'leave', 'holiday');

create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  date        date not null,
  status      attendance_status not null default 'absent',
  unique (student_id, date)
);

create index if not exists attendance_student_date on attendance(student_id, date);
create index if not exists attendance_date on attendance(date);

-- ── Payments ─────────────────────────────────────────────────────
create table if not exists payments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references students(id) on delete cascade,
  amount      numeric(10,2) not null check (amount > 0),
  paid_on     date not null default current_date,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists payments_student on payments(student_id);

-- ── Settings ─────────────────────────────────────────────────────
-- Single-row settings table; always insert one row after schema creation
create table if not exists settings (
  id           int primary key default 1 check (id = 1), -- enforces single row
  fee_per_day  numeric(10,2) not null default 150
);

insert into settings (id, fee_per_day) values (1, 150)
  on conflict (id) do nothing;

-- ── Row Level Security ────────────────────────────────────────────
-- Only authenticated users (Subin) can read/write all data.
-- Do NOT enable public sign-up in your Supabase project.

alter table batches    enable row level security;
alter table students   enable row level security;
alter table attendance enable row level security;
alter table payments   enable row level security;
alter table settings   enable row level security;

create policy "Authenticated full access" on batches    for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on students   for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on attendance for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on payments   for all using (auth.role() = 'authenticated');
create policy "Authenticated full access" on settings   for all using (auth.role() = 'authenticated');
