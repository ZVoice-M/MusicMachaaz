import { notFound } from "next/navigation";
import { BatchDialog } from "@/components/forms/batch-dialog";
import { PageHeader } from "@/components/layout/app-shell";
import { Card, StatCard } from "@/components/ui/card";
import { Td, Th, Table } from "@/components/ui/table";
import { getBatches, getSettings, getStudentLedger } from "@/lib/data";
import { currency } from "@/lib/utils";

export default async function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [batches, ledger, settings] = await Promise.all([getBatches(), getStudentLedger(), getSettings()]);
  const batch = batches.find((item) => item.id === id);
  if (!batch) notFound();
  const students = ledger.filter((row) => row.batch_id === id);

  return (
    <>
      <PageHeader title={batch.batch_name} description="Students, fee summaries, and batch statistics." actions={<BatchDialog batch={batch} />} />
      <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={students.length} />
        <StatCard label="Attendance Days" value={students.reduce((sum, row) => sum + row.present_days, 0)} />
        <StatCard label="Total Revenue" value={currency(students.reduce((sum, row) => sum + row.generated_fees, 0), settings.currency)} />
        <StatCard label="Pending Revenue" value={currency(students.reduce((sum, row) => sum + Math.max(row.pending_amount, 0), 0), settings.currency)} />
      </section>
      <Card>
        <Table>
          <thead><tr><Th>Student</Th><Th>Present</Th><Th>Generated</Th><Th>Paid</Th><Th>Pending</Th></tr></thead>
          <tbody>
            {students.map((row) => <tr key={row.id}><Td>{row.student_name}</Td><Td>{row.present_days}</Td><Td>{currency(row.generated_fees, settings.currency)}</Td><Td>{currency(row.paid_amount, settings.currency)}</Td><Td>{currency(row.pending_amount, settings.currency)}</Td></tr>)}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
