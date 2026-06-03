import Link from "next/link";
import { AttendanceTrend, FeeTrend } from "@/components/charts/trend-charts";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, StatCard } from "@/components/ui/card";
import { Td, Th, Table } from "@/components/ui/table";
import { currency, formatDate } from "@/lib/utils";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const totalGenerated = data.ledger.reduce((sum, row) => sum + row.generated_fees, 0);
  const totalPaid = data.ledger.reduce((sum, row) => sum + row.paid_amount, 0);
  const totalPending = data.ledger.reduce((sum, row) => sum + Math.max(row.pending_amount, 0), 0);
  const highest = [...data.ledger].sort((a, b) => b.present_days - a.present_days)[0];
  const lowest = [...data.ledger].sort((a, b) => a.present_days - b.present_days)[0];

  return (
    <>
      <PageHeader title="Dashboard" description="Today, this month, dues, trends, and recent academy activity." />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Present Today" value={data.today.Present} />
        <StatCard label="Absent Today" value={data.today.Absent} />
        <StatCard label="Leave Today" value={data.today.Leave} />
        <StatCard label="Holiday Today" value={data.today.Holiday} />
      </section>
      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Students" value={data.students.length} />
        <StatCard label="Present Days" value={data.ledger.reduce((sum, row) => sum + row.present_days, 0)} />
        <StatCard label="Fees Generated" value={currency(totalGenerated, data.settings.currency)} />
        <StatCard label="Fees Collected" value={currency(totalPaid, data.settings.currency)} />
        <StatCard label="Pending Fees" value={currency(totalPending, data.settings.currency)} />
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <AttendanceTrend data={data.attendanceTrend} />
        <FeeTrend data={data.feeTrend} />
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="mb-3 font-semibold">Quick Insights</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Active Batches" value={data.batches.length} />
            <StatCard label="Students With Dues" value={data.ledger.filter((row) => row.pending_amount > 0).length} />
            <StatCard label="Highest Attendance" value={highest?.student_name ?? "-"} detail={`${highest?.present_days ?? 0} present days`} />
            <StatCard label="Lowest Attendance" value={lowest?.student_name ?? "-"} detail={`${lowest?.present_days ?? 0} present days`} />
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Recent Payments</h2>
          <Table>
            <thead><tr><Th>Date</Th><Th>Student</Th><Th>Amount</Th></tr></thead>
            <tbody>
              {data.payments.slice(0, 5).map((payment) => {
                const student = data.students.find((item) => item.id === payment.student_id);
                return (
                  <tr key={payment.id}>
                    <Td>{formatDate(payment.payment_date)}</Td>
                    <Td>{student?.student_name ?? "-"}</Td>
                    <Td>{currency(payment.amount, data.settings.currency)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </section>
      <section className="mt-4">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Alerts</h2>
            <Link href="/pending-dues" className="text-sm text-gold">View dues</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.ledger.filter((row) => row.pending_amount > 0).slice(0, 8).map((row) => (
              <Badge key={row.id} tone="yellow">{row.student_name}: {currency(row.pending_amount, data.settings.currency)}</Badge>
            ))}
            {data.ledger.length === 0 ? <p className="text-sm text-muted">No alerts yet.</p> : null}
          </div>
        </Card>
      </section>
    </>
  );
}
