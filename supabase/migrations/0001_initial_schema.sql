create extension if not exists pgcrypto;

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  batch_name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  mobile text not null,
  batch_id uuid references public.batches(id) on delete set null,
  joining_date date,
  notes text,
  active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('Present', 'Absent', 'Leave', 'Holiday')),
  created_at timestamp with time zone default now(),
  unique (student_id, attendance_date)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  amount numeric not null check (amount > 0),
  payment_date date not null,
  remarks text,
  created_at timestamp with time zone default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  institute_name text default 'Music Machaanz',
  fee_per_day numeric default 100 check (fee_per_day >= 0),
  currency text default 'INR'
);

insert into public.settings (institute_name, fee_per_day, currency)
select 'Music Machaanz', 100, 'INR'
where not exists (select 1 from public.settings);

insert into public.batches (batch_name)
select name
from (values
  ('Guitar Batch A'),
  ('Guitar Batch B'),
  ('Keyboard Batch A'),
  ('Keyboard Batch B'),
  ('Vocal Batch A'),
  ('Drums Batch A')
) as seed(name)
where not exists (select 1 from public.batches where batch_name = seed.name);

create or replace view public.student_financials as
with fee_settings as (
  select coalesce((select fee_per_day from public.settings limit 1), 100) as fee_per_day
),
attendance_summary as (
  select
    student_id,
    count(*) filter (where status = 'Present')::int as present_days,
    count(*) filter (where status = 'Absent')::int as absent_days,
    count(*) filter (where status = 'Leave')::int as leave_days,
    count(*) filter (where status = 'Holiday')::int as holiday_days
  from public.attendance
  group by student_id
),
payment_summary as (
  select
    student_id,
    coalesce(sum(amount), 0) as paid_amount,
    max(payment_date) as last_payment_date
  from public.payments
  group by student_id
)
select
  s.id,
  s.student_name,
  s.mobile,
  s.batch_id,
  s.joining_date,
  s.notes,
  s.active,
  s.created_at,
  coalesce(a.present_days, 0) as present_days,
  coalesce(a.absent_days, 0) as absent_days,
  coalesce(a.leave_days, 0) as leave_days,
  coalesce(a.holiday_days, 0) as holiday_days,
  coalesce(a.present_days, 0) * fs.fee_per_day as generated_fees,
  coalesce(p.paid_amount, 0) as paid_amount,
  (coalesce(a.present_days, 0) * fs.fee_per_day) - coalesce(p.paid_amount, 0) as pending_amount,
  p.last_payment_date
from public.students s
cross join fee_settings fs
left join attendance_summary a on a.student_id = s.id
left join payment_summary p on p.student_id = s.id;

create index if not exists idx_students_batch on public.students(batch_id);
create index if not exists idx_students_search on public.students(student_name, mobile);
create index if not exists idx_attendance_student_date on public.attendance(student_id, attendance_date);
create index if not exists idx_payments_student_date on public.payments(student_id, payment_date);

alter table public.batches enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;
alter table public.payments enable row level security;
alter table public.settings enable row level security;

create policy "Authenticated admin can read batches" on public.batches for select to authenticated using (true);
create policy "Authenticated admin can write batches" on public.batches for all to authenticated using (true) with check (true);

create policy "Authenticated admin can read students" on public.students for select to authenticated using (true);
create policy "Authenticated admin can write students" on public.students for all to authenticated using (true) with check (true);

create policy "Authenticated admin can read attendance" on public.attendance for select to authenticated using (true);
create policy "Authenticated admin can write attendance" on public.attendance for all to authenticated using (true) with check (true);

create policy "Authenticated admin can read payments" on public.payments for select to authenticated using (true);
create policy "Authenticated admin can write payments" on public.payments for all to authenticated using (true) with check (true);

create policy "Authenticated admin can read settings" on public.settings for select to authenticated using (true);
create policy "Authenticated admin can write settings" on public.settings for all to authenticated using (true) with check (true);
