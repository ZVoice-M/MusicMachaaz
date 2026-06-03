import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, Banknote, CalendarDays, Gauge, Music2, Settings, Users } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/students", label: "Students", icon: Users },
  { href: "/batches", label: "Batches", icon: Music2 },
  { href: "/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/pending-dues", label: "Pending Dues", icon: Banknote },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/status", label: "Status", icon: Activity },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) redirect("/login");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-border bg-black/45 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-black">
            <Music2 size={22} />
          </div>
          <div>
            <p className="text-base font-bold">Music Machaanz</p>
            <p className="text-xs text-muted">Academy Admin</p>
          </div>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="w-max shrink-0 justify-start whitespace-nowrap lg:w-full">
                  <Icon size={16} /> {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-border pt-4">
          <LogoutButton />
        </div>
      </aside>
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Music Machaanz</p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
