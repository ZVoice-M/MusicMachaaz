"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Banknote,
  CalendarDays,
  Gauge,
  Menu,
  Music2,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { LogoutButton } from "@/components/layout/logout-button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Students", icon: Users },
  { href: "/batches", label: "Batches", icon: Music2 },
  { href: "/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/pending-dues", label: "Pending Dues", icon: Banknote },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/status", label: "Status", icon: Activity },
];

// Bottom bar shows first 5 items only
const bottomNav = nav.slice(0, 5);

function NavLink({ href, label, icon: Icon, active, onClick }: {
  href: string; label: string; icon: typeof Gauge; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-gold/10 text-gold"
          : "text-muted hover:bg-panel-2 hover:text-white",
      )}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col border-r border-border bg-black/45 backdrop-blur lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-black shrink-0">
            <Music2 size={20} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Music Machaanz</p>
            <p className="text-xs text-muted leading-tight">Subin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {nav.map((item) => (
            <NavLink key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <LogoutButton />
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-black/80 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-black">
            <Music2 size={16} />
          </div>
          <div className="leading-none">
            <p className="text-xs font-bold">Music Machaanz</p>
            <p className="text-[10px] text-muted">Subin</p>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md text-muted hover:text-white hover:bg-panel-2 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-panel flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-black">
                  <Music2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold">Music Machaanz</p>
                  <p className="text-xs text-muted">Subin</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-md text-muted hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  active={pathname.startsWith(item.href)}
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-border pb-safe">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        {children}
      </main>

      {/* ── Mobile bottom tab bar ───────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex bg-black/90 backdrop-blur border-t border-border pb-safe">
        {bottomNav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors min-h-[52px]",
                active ? "text-gold" : "text-muted",
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="leading-none">{label === "Pending Dues" ? "Dues" : label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Music Machaanz · Subin</p>
        <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
