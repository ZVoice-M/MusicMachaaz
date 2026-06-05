import Link from "next/link";
import { PaymentDialog } from "@/components/forms/payment-dialog";
import { ReportsExporter } from "@/components/forms/reports-exporter";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Td, Th, Table } from "@/components/ui/table";
import { getSettings, getMonthlyLedger } from "@/lib/data";
import { currency, formatDate } from "@/lib/utils";

export const metadata = { title: "Pending Dues" };

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const YEARS = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

export default async function PendingDuesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getMonth() + 1);
  const year = Number(params.year ?? now.getFullYear());

  const [ledger, settings] = await Promise.all([
    getMonthlyLedger(month, year),
    getSettings(),
  ]);

  const rows = ledger.filter((row) => row.pending_amount > 0);
  const total = rows.reduce((sum, row) => sum + row.pending_amount, 0);
  const collected = ledger.reduce((sum, row) => sum + row.paid_amount, 0);
  const generated = ledger.reduce((sum, row) => sum + row.generated_fees, 0);

  return (
    <>
      <PageHeader
        title="Pending Dues"
        description="Month-wise fee collection, dues, and export."
        actions={
          <ReportsExporter
            rows={rows}
            currencyCode={settings.currency}
            title={`Music Machaanz Pending Dues — ${MONTHS[month - 1]} ${year}`}
            fileName={`dues-${year}-${String(month).padStart(2, "0")}`}
          />
        }
      />

      <form className="mb-5 flex flex-wrap gap-3 items-end">
        <div>
          <label className="mb-1.5 block text-xs text-muted uppercase tracking-wider">Month</label>
          <select name="month" defaultValue={month}
            className="h-10 rounded-md border border-border bg-[#101010] px-3 text-sm text-white outline-none focus:border-gold">
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted uppercase tracking-wider">Year</label>
          <select name="year" defaultValue={year}
            className="h-10 rounded-md border border-border bg-[#101010] px-3 text-sm text-white outline-none focus:border-gold">
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <Button type="submit">View</Button>
      </form>

      <div className="mb-4 rounded-lg border border-border bg-black/20 px-4 py-2.5 flex items-center justify-between">
        <p className="font-semibold text-white">{MONTHS[month - 1]} {year}</p>
        <p className="text-xs text-muted">{rows.length} students with dues</p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Pending" value={currency(total, settings.currency)} />
        <StatCard label="Fees Generated" value={currency(generated, settings.currency)} />
        <StatCard label="Fees Collected" value={currency(collected, settings.currency)} />
      </div>

      <div className="mb-4 grid gap-3 md:hidden">
        {rows.length === 0 && (
          <p className="text-center text-muted py-10">No pending dues for {MONTHS[month - 1]} {year}.</p>
        )}
        {rows.map((row) => (
          <Card key={row.id}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{row.student_name}</h2>
                <p className="text-xs text-muted">{row.batches?.batch_name ?? "-"} · Last paid {formatDate(row.last_payment_date)}</p>
              </div>
              <Badge tone="yellow">{currency(row.pending_amount, settings.currency)}</Badge>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
              <div><p className="text-muted">Generated</p><p className="font-semibold">{currency(row.generated_fees, settings.currency)}</p></div>
              <div><p className="text-muted">Paid</p><p className="font-semibold">{currency(row.paid_amount, settings.currency)}</p></div>
              <div><p className="text-muted">Present</p><p className="font-semibold">{row.present_days}</p></div>
            </div>
            <div className="flex gap-2">
              <PaymentDialog studentId={row.id} label="Pay" />
              <Link href={`/students/${row.id}`}><Button variant="secondary">View</Button></Link>
            </div>
          </Card>
        ))}
      </div>

      <Card className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Student</Th><Th>Batch</Th><Th>Present Days</Th>
              <Th>Generated</Th><Th>Paid</Th><Th>Pending</Th>
              <Th>Last Payment</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-10 px-4">No pending dues for {MONTHS[month - 1]} {year}.</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>{row.student_name}</Td>
                <Td>{row.batches?.batch_name ?? "-"}</Td>
                <Td>{row.present_days}</Td>
                <Td>{currency(row.generated_fees, settings.currency)}</Td>
                <Td>{currency(row.paid_amount, settings.currency)}</Td>
                <Td><Badge tone="yellow">{currency(row.pending_amount, settings.currency)}</Badge></Td>
                <Td>{formatDate(row.last_payment_date)}</Td>
                <Td>
                  <div className="flex gap-2">
                    <PaymentDialog studentId={row.id} label="Pay" />
                    <Link href={`/students/${row.id}`}><Button variant="secondary">View</Button></Link>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
