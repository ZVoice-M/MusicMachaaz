import { notFound } from "next/navigation";
import { PaymentDialog } from "@/components/forms/payment-dialog";
import { StudentDialog } from "@/components/forms/student-dialog";
import { PageHeader } from "@/components/layout/app-shell";
import { Card, StatCard } from "@/components/ui/card";
import { Td, Th, Table } from "@/components/ui/table";
import { getBatches, getPayments, getSettings, getStudentLedger } from "@/lib/data";
import { currency, formatDate } from "@/lib/utils";

export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ledger, batches, payments, settings] = await Promise.all([getStudentLedger(), getBatches(), getPayments(id), getSettings()]);
  const student = ledger.find((row) => row.id === id);
  if (!student) notFound();

  return (
    <>
      <PageHeader title={student.student_name} description={`${student.mobile} · ${student.batches?.batch_name ?? "No batch"}`} actions={<><PaymentDialog studentId={student.id} /><StudentDialog batches={batches} student={student} /></>} />
      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <h2 className="mb-3 font-semibold">Student Information</h2>
          <dl className="grid gap-3 text-sm">
            <div><dt className="text-muted">Joining Date</dt><dd>{formatDate(student.joining_date)}</dd></div>
            <div><dt className="text-muted">Notes</dt><dd>{student.notes ?? "-"}</dd></div>
          </dl>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard label="Present Days" value={student.present_days} />
          <StatCard label="Absent Days" value={student.absent_days} />
          <StatCard label="Leave Days" value={student.leave_days} />
          <StatCard label="Holiday Days" value={student.holiday_days} />
          <StatCard label="Generated Fees" value={currency(student.generated_fees, settings.currency)} />
          <StatCard label="Pending Amount" value={currency(student.pending_amount, settings.currency)} />
        </div>
      </section>
      <section className="mt-4">
        <Card>
          <h2 className="mb-3 font-semibold">Payment History</h2>
          <Table>
            <thead><tr><Th>Date</Th><Th>Amount</Th><Th>Remarks</Th></tr></thead>
            <tbody>
              {payments.map((payment) => <tr key={payment.id}><Td>{formatDate(payment.payment_date)}</Td><Td>{currency(payment.amount, settings.currency)}</Td><Td>{payment.remarks ?? "-"}</Td></tr>)}
            </tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
