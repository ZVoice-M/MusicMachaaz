import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, DatabaseZap, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getSystemStatus } from "@/lib/status";

export const dynamic = "force-dynamic";

const statusTone = {
  operational: "green",
  degraded: "yellow",
  unavailable: "red",
  demo: "blue",
} as const;

const statusIcon = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  unavailable: DatabaseZap,
  demo: Clock3,
};

export default async function StatusPage() {
  const status = await getSystemStatus();
  const Icon = statusIcon[status.state];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Music Machaanz</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">System Status</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Live availability check for the academy management system and Supabase connection.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
            <Link href="/status">
              <Button>
                <RefreshCw size={16} /> Refresh
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold text-black">
                <Icon size={24} />
              </div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{status.label}</h2>
                  <Badge tone={statusTone[status.state]}>{status.state}</Badge>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted">{status.message}</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Supabase Connection" value={status.state === "operational" ? "Healthy" : "Check"} />
          <StatCard label="Last Checked" value={formatDate(status.checkedAt)} detail={new Date(status.checkedAt).toLocaleTimeString("en-IN")} />
          <StatCard label="Response Time" value={status.responseTimeMs ? `${status.responseTimeMs} ms` : "-"} />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 font-semibold">If The System Is Unavailable</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted">
              <li>Wait a few minutes and refresh this page. Supabase free projects can need time to resume after inactivity.</li>
              <li>If login fails but this page says operational, verify the admin email and password in Supabase Authentication.</li>
              <li>If the status stays unavailable, check Supabase project health, usage limits, and billing/quota notices.</li>
            </ul>
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold">What May Be Affected</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted">
              <li>Admin login and session refresh</li>
              <li>Student, batch, attendance, and payment saves</li>
              <li>Pending dues, dashboard metrics, and reports</li>
            </ul>
          </Card>
        </section>
      </div>
    </main>
  );
}
