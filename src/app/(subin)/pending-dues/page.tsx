import Link from "next/link";
import { PaymentDialog } from "@/components/forms/payment-dialog";
import { ReportsExporter } from "@/components/forms/reports-exporter";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Td, Th, Table } from "@/components/ui/table";
import { getSettings, getStudentLedger } from "@/lib/data";
import { currency, formatDate } from "@/lib/utils";

export const metadata = { title: "Pending Dues" };


export default async function PendingDuesPage() {
  const [ledger, settings] = await Promise.all([getStudentLedger(), getSettings()]);
  const rows = ledger.filter((row) => row.pending_amount > 0);
  const total = rows.reduce((sum, row) => sum + row.pending_amount, 0);
  const collected = ledger.reduce((sum, row) => sum + row.paid_amount, 0);
  const generated = ledger.reduce((sum, row) => sum + row.generated_fees, 0);

  return (
    <>
      <PageHeader
        title="Pending Dues"
        description="Dues, fee collection reporting, and export tools in one place."
        actions={<ReportsExporter rows={rows} currencyCode={settings.currency} title="Music Machaanz Pending Dues" fileName="music-machaanz-pending-dues" />}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Pending Dues" value={currency(total, settings.currency)} />
        <StatCard label="Fees Generated" value={currency(generated, settings.currency)} />
        <StatCard label="Fees Collected" value={currency(collected, settings.currency)} />
      </div>
      <div className="mb-4 grid gap-3 md:hidden">
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
        <Table className="hidden md:table">
          <thead><tr><Th>Student</Th><Th>Batch</Th><Th>Generated</Th><Th>Paid</Th><Th>Pending</Th><Th>Last Payment</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <Td>{row.student_name}</Td>
                <Td>{row.batches?.batch_name ?? "-"}</Td>
                <Td>{currency(row.generated_fees, settings.currency)}</Td>
                <Td>{currency(row.paid_amount, settings.currency)}</Td>
                <Td><Badge tone="yellow">{currency(row.pending_amount, settings.currency)}</Badge></Td>
                <Td>{formatDate(row.last_payment_date)}</Td>
                <Td><div className="flex gap-2"><PaymentDialog studentId={row.id} label="Pay" /><Link href={`/students/${row.id}`}><Button variant="secondary">View</Button></Link></div></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
