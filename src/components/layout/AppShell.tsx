"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  IndianRupee,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/batches", label: "Batches", icon: GraduationCap },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/dues", label: "Dues", icon: IndianRupee },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Bottom nav shows only the 5 most important items on mobile
const BOTTOM_NAV = NAV_ITEMS.slice(0, 5);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 bg-[#111] border-r border-[#1a1a1a] z-30">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#cc6600] flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-[#888] leading-none">Music Machaanz</p>
              <p className="text-sm font-semibold text-[#cc6600] leading-tight">Subin</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-[#cc6600]/15 text-[#cc6600] font-medium"
                    : "text-[#aaa] hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#1a1a1a]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[#aaa] hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-[#111] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#cc6600] flex items-center justify-center">
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="font-semibold text-[#cc6600] text-sm">Subin</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg text-[#aaa] hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative ml-auto w-72 max-w-full h-full bg-[#111] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
              <span className="font-semibold text-[#cc6600]">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#aaa] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-[#cc6600]/15 text-[#cc6600] font-medium"
                        : "text-[#aaa] hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-[#1a1a1a]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm text-[#aaa] hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main
        className={cn(
          "min-h-screen",
          "md:ml-60", // offset for sidebar on desktop
          "pt-14 md:pt-0", // offset for top bar on mobile
          "pb-20 md:pb-0" // offset for bottom nav on mobile
        )}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom navigation bar ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-[#111] border-t border-[#1a1a1a] safe-area-inset-bottom">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                active ? "text-[#cc6600]" : "text-[#666] hover:text-[#aaa]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
