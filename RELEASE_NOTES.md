# Release Notes — v1.0.0

## Summary of changes from pre-release review to production-ready

---

### 🔐 Security

| Change | Detail |
|---|---|
| **Replaced `xlsx` 0.18.5** | Removed the abandoned SheetJS Community package (multiple CVEs). Replaced with `exceljs@^4.4.0` — actively maintained, no known CVEs. |
| **Security response headers** | Added in `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a `Content-Security-Policy` that restricts connections to your Supabase project URL only. |
| **Auth middleware** | `src/middleware.ts` protects all dashboard routes — redirects unauthenticated visitors to `/login`. Also redirects logged-in users away from `/login`. |
| **No code-level sign-up** | Middleware + RLS enforces single-admin access. The settings page documents this clearly. |
| **`standalone` output** | `next.config.ts` sets `output: "standalone"` for leaner Vercel/Docker deploys with no extraneous files. |
| **`reactStrictMode: true`** | Catches double-render bugs before production. |

---

### 🐛 Bug Fixes

| Fix | Detail |
|---|---|
| **`jspdf` verified** | Confirmed `jspdf@4.2.1` resolves correctly from npm registry. `jspdf-autotable@5.0.8` declares peer dep `jspdf: ^2 \|\| ^3 \|\| ^4` — compatible. |
| **`lucide-react` v1 imports** | All icon imports use named exports compatible with v1 API. |
| **TypeScript strictness** | Added `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` to `tsconfig.json`. |
| **`typecheck` script** | Added `npm run typecheck` (`tsc --noEmit`) for CI pre-flight. |

---

### 📱 Mobile-First Overhaul

| Area | What changed |
|---|---|
| **Bottom tab navigation** | Mobile gets a fixed bottom bar with the 5 main sections. Tap targets are full-width flex columns. |
| **Drawer menu** | Full-screen slide-in drawer with backdrop for all nav items + logout on mobile. |
| **Top bar** | Replaces sidebar on mobile — shows branding + hamburger. |
| **Sidebar** | Hidden on mobile (`hidden md:flex`), full sidebar on ≥ md. |
| **DataTable** | Wrapped in `overflow-x-auto` — all tables scroll horizontally on narrow screens. Cells use `whitespace-nowrap`. |
| **Recharts** | All charts use `ResponsiveContainer width="100%"` — no fixed-width chart breakage on mobile. |
| **Viewport meta** | `layout.tsx` uses Next.js `viewport` export with `maximumScale: 1` to prevent iOS double-tap zoom in forms. |
| **PWA manifest** | `public/manifest.json` enables Add to Home Screen on Android/iOS. `display: standalone` hides browser chrome. |
| **Safe area insets** | Bottom nav uses `env(safe-area-inset-bottom)` via `.safe-area-inset-bottom` CSS class — works on iPhone with home indicator. |
| **`-webkit-tap-highlight-color: transparent`** | Global style removes grey flash on tap for all interactive elements. |
| **`inputMode`** | Phone/number inputs use `inputMode="numeric"` and `inputMode="email"` to trigger the right on-screen keyboard. |
| **Touch-friendly sizes** | All buttons minimum 44×44px effective tap area per Apple HIG. |

---

### 🏷️ Branding

| Change | Detail |
|---|---|
| **Renamed admin → Subin** | All references to a generic "admin" label replaced with "Subin" throughout the UI: sidebar, login page, settings profile card, page subtitles, and documentation. |
| **App name** | Sidebar, top bar, login page, and `manifest.json` all show "Music Machaanz Academy — Subin". |

---

### 🏗️ Architecture

| Addition | Detail |
|---|---|
| **`src/types/index.ts`** | Centralised domain types (`Student`, `Batch`, `AttendanceRecord`, `Payment`, `Settings`, `StudentDueSummary`). |
| **`src/lib/supabase.ts`** | Browser Supabase client with demo-mode detection. |
| **`src/lib/supabase-server.ts`** | Server Component Supabase client using `@supabase/ssr` cookie adapter. |
| **`src/lib/utils.ts`** | `cn()`, `formatCurrency()` (INR), `formatDate()`, date helpers. |
| **`src/lib/export-excel.ts`** | ExcelJS-based export with gold/black styling matching app theme. |
| **`src/lib/export-pdf.ts`** | jsPDF export with branded header and overdue row highlighting. |
| **`AppShell` component** | Single component handles sidebar (desktop) + top bar + bottom nav + drawer (mobile). |
| **`DataTable` component** | Generic typed table with mobile scroll wrapper. |
| **`Button`, `Input`, `StatCard`, `PageHeader`, `StatusBadge`, `DemoBanner`** | Consistent UI primitives used app-wide. |
| **`ErrorBoundary`** | React class component wraps all protected routes. Shows a user-friendly error screen. |
| **`not-found.tsx`** | Custom 404 page matching app theme. |
| **`global-error.tsx`** | Next.js global error boundary for unexpected runtime crashes. |
| **`(protected)` route group** | Students, batches, attendance, dues, settings share one `layout.tsx` (AppShell + ErrorBoundary). |
| **Supabase migration** | `supabase/migrations/0001_initial_schema.sql` — complete schema with RLS, indexes, single-row settings table, and `attendance_status` enum. |

---

### 📦 Dependency Changes

| Package | Before | After | Reason |
|---|---|---|---|
| `xlsx` | `^0.18.5` | ❌ removed | CVEs, abandoned |
| `exceljs` | — | `^4.4.0` | ✅ active, no CVEs |
| `file-saver` | — | bundled via exceljs | Blob download |

---

### 🚀 Deploy Checklist

- [ ] `npm install` (picks up `exceljs`, drops `xlsx`)
- [ ] `npm run typecheck` — should pass with 0 errors
- [ ] `npm run build` — should complete cleanly
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel environment variables
- [ ] Run `supabase/migrations/0001_initial_schema.sql` in Supabase SQL editor
- [ ] Create exactly one Supabase Auth user (Subin's account) — do **not** enable public sign-up
- [ ] Test on an actual mobile device (iOS Safari + Android Chrome)
- [ ] Test `/status` page to confirm Supabase connectivity
