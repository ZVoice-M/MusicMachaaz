import Link from "next/link";
import { BatchDialog } from "@/components/forms/batch-dialog";
import { DeleteButton } from "@/components/forms/delete-button";
import { PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, StatCard } from "@/components/ui/card";
import { getBatches, getSettings, getStudentLedger } from "@/lib/data";
import { currency } from "@/lib/utils";

export default async function BatchesPage() {
  const [batches, ledger, settings] = await Promise.all([getBatches(), getStudentLedger(), getSettings()]);

  return (
    <>
      <PageHeader title="Batches" description="Batch health, attendance, revenue, and pending revenue." actions={<BatchDialog />} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {batches.map((batch) => {
          const students = ledger.filter((row) => row.batch_id === batch.id);
          const generated = students.reduce((sum, row) => sum + row.generated_fees, 0);
          const pending = students.reduce((sum, row) => sum + Math.max(row.pending_amount, 0), 0);
          const present = students.reduce((sum, row) => sum + row.present_days, 0);
          const totalAttendance = students.reduce((sum, row) => sum + row.present_days + row.absent_days + row.leave_days + row.holiday_days, 0);
          return (
            <Card key={batch.id}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{batch.batch_name}</h2>
                  <p className="text-sm text-muted">{students.length} students</p>
                </div>
                <BatchDialog batch={batch} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Present Today" value={0} />
                <StatCard label="Attendance %" value={`${totalAttendance ? Math.round((present / totalAttendance) * 100) : 0}%`} />
                <StatCard label="Revenue" value={currency(generated, settings.currency)} />
                <StatCard label="Pending" value={currency(pending, settings.currency)} />
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/batches/${batch.id}`}><Button variant="secondary">View</Button></Link>
                <DeleteButton url={`/api/batches/${batch.id}`} />
              </div>
            </Card>
          );
        })}
      </section>
    </>
  );
}
