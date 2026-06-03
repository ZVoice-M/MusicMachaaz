# Music Machaanz Academy Management System

Production-ready single-admin academy management app built with Next.js, TypeScript, Tailwind CSS, Supabase, React Hook Form-ready validation schemas, Zod, charts, PDF export, and Excel export.

## Features

- Single admin login with Supabase Auth
- Protected dashboard, students, batches, attendance, pending dues, and settings routes
- Student and batch CRUD
- Monthly attendance register with Present, Absent, Leave, and Holiday statuses
- Fee calculation from Present days only
- Payment collection from student details and pending dues
- Pending dues, recent activity, trends, and PDF/Excel exports from Pending Dues
- Public status page for Supabase availability and free-tier limitation messaging
- Dark black/gold/white responsive UI
- Demo-mode rendering before Supabase environment variables are connected

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Use `http://localhost:3000/status` when the app appears unavailable. The page checks Supabase reachability and explains common free-tier pause or quota scenarios.

If Supabase env vars are missing, the app renders demo data and lets you explore the UI. Writes are acknowledged but not persisted in demo mode.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor or with Supabase CLI.
3. Create one admin user in Supabase Authentication.
4. Copy the project URL and anon key into `.env.local`.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deployment To Vercel

1. Push the project to GitHub.
2. Import it in Vercel.
3. Add the two Supabase environment variables.
4. Deploy.

## Business Rules

- Present days generate fees.
- Absent, Leave, and Holiday do not generate fees.
- Generated fees = Present days multiplied by `settings.fee_per_day`.
- Pending amount = Generated fees minus total payments.
- Changing fee per day affects the financial view calculated from current attendance and payments.

## Notes

The RLS policies allow any authenticated Supabase user to administer data. For a strict single-admin installation, create exactly one Supabase Auth user and do not enable public sign-up.
