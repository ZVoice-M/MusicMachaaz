# Music Machaanz Academy — Management System

Production-ready single-admin academy management app built with Next.js 15, TypeScript, Tailwind CSS v4, Supabase, React Hook Form + Zod, Recharts, jsPDF, and ExcelJS.

## Features

- Single-admin login via Supabase Auth (admin name: **Subin**)
- Protected dashboard, students, batches, attendance, pending dues, and settings routes
- Student and batch CRUD
- Monthly attendance register with Present, Absent, Leave, and Holiday statuses
- Fee calculation from Present days only
- Payment collection from student details and pending dues views
- Pending dues with recent activity, trends, and PDF/Excel exports
- Public `/status` page for Supabase availability and free-tier messaging
- Dark black/gold/white responsive UI — mobile-first
- Demo mode when Supabase env vars are absent

## Local Setup

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase URL and anon key in .env.local
npm run dev
```

Open `http://localhost:3000`.

Visit `http://localhost:3000/status` if the app appears unreachable — it checks Supabase connectivity and explains free-tier pause/quota scenarios.

If Supabase env vars are missing the app renders demo data. Writes are acknowledged but not persisted in demo mode.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor or via the Supabase CLI.
3. Create **one** admin user in Supabase Authentication (this is Subin's account).
4. Copy the project URL and anon key into `.env.local`.

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Security note:** Do not enable public sign-up in your Supabase project. Only the single admin account (Subin) should exist. RLS policies restrict all data access to authenticated users.

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add the two Supabase environment variables under Project Settings → Environment Variables.
4. Deploy.

## Business Rules

- Present days generate fees.
- Absent, Leave, and Holiday statuses do **not** generate fees.
- Generated fees = Present days × `settings.fee_per_day`.
- Pending amount = Generated fees − total payments collected.
- Changing `fee_per_day` recalculates the financial view from current attendance and payments.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase |
| Forms | React Hook Form 7 + Zod 4 |
| Charts | Recharts 3 |
| PDF export | jsPDF 4 + jspdf-autotable 5 |
| Excel export | ExcelJS 4 |
| Toasts | Sonner 2 |

## Mobile

The app is designed mobile-first. All tables include horizontal scroll wrappers, charts use `ResponsiveContainer`, and navigation collapses to a bottom tab bar on small screens.
