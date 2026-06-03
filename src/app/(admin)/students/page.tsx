import Link from "next/link";
import { DeleteButton } from "@/components/forms/delete-button";
import { StudentDialog } from "@/components/forms/student-dialog";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Td, Th, Table } from "@/components/ui/table";
import { getBatches, getSettings, getStudentLedger } from "@/lib/data";
import { currency } from "@/lib/utils";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ q?: string; batch?: string; active?: string }> }) {
  const params = await searchParams;
  const [rows, batches, settings] = await Promise.all([getStudentLedger(), getBatches(), getSettings()]);
  const filtered = rows.filter((row) => {
    const q = params.q?.toLowerCase() ?? "";
    const matchesQuery = !q || row.student_name.toLowerCase().includes(q) || row.mobile.includes(q);
    const matchesBatch = !params.batch || row.batch_id === params.batch;
    const matchesActive = !params.active || String(row.active) === params.active;
    return matchesQuery && matchesBatch && matchesActive;
  });

  return (
    <>
      <PageHeader title="Students" description="Search, filter, add, edit, and monitor student dues." actions={<StudentDialog batches={batches} />} />
      <form className="mb-4 grid gap-3 sm:grid-cols-[1fr_14rem_12rem_auto]">
        <Input name="q" placeholder="Search student or mobile" defaultValue={params.q} />
        <Select name="batch" defaultValue={params.batch ?? ""}>
          <option value="">All batches</option>
          {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batch_name}</option>)}
        </Select>
        <Select name="active" defaultValue={params.active ?? ""}>
          <option value="">Any status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <Button>Search</Button>
      </form>
      <Table>
        <thead><tr><Th>Student</Th><Th>Mobile</Th><Th>Batch</Th><Th>Present</Th><Th>Generated</Th><Th>Paid</Th><Th>Pending</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id}>
              <Td><Link className="font-semibold text-gold" href={`/students/${row.id}`}>{row.student_name}</Link></Td>
              <Td>{row.mobile}</Td>
              <Td>{row.batches?.batch_name ?? "-"}</Td>
              <Td>{row.present_days}</Td>
              <Td>{currency(row.generated_fees, settings.currency)}</Td>
              <Td>{currency(row.paid_amount, settings.currency)}</Td>
              <Td><Badge tone={row.pending_amount > 0 ? "yellow" : "green"}>{currency(row.pending_amount, settings.currency)}</Badge></Td>
              <Td><div className="flex gap-2"><Link href={`/students/${row.id}`}><Button variant="secondary">View</Button></Link><DeleteButton url={`/api/students/${row.id}`} label="Delete" /></div></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
