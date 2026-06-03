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

export const metadata = { title: "Students" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; batch?: string; active?: string }>;
}) {
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
      <PageHeader
        title="Students"
        description={`${filtered.length} of ${rows.length} students`}
        actions={<StudentDialog batches={batches} />}
      />
      {/* Search form — stacks vertically on mobile */}
      <form className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_12rem_auto]">
        <Input name="q" placeholder="Search name or mobile" defaultValue={params.q} />
        <Select name="batch" defaultValue={params.batch ?? ""}>
          <option value="">All batches</option>
          {batches.map((b) => <option key={b.id} value={b.id}>{b.batch_name}</option>)}
        </Select>
        <Select name="active" defaultValue={params.active ?? ""}>
          <option value="">Any status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <Button>Search</Button>
      </form>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((row) => (
          <div key={row.id} className="rounded-lg border border-border bg-panel p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Link href={`/students/${row.id}`} className="font-semibold text-gold">
                  {row.student_name}
                </Link>
                <p className="text-xs text-muted mt-0.5">{row.mobile}</p>
              </div>
              <Badge tone={row.active ? "green" : "default"}>{row.active ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div><p className="text-muted">Batch</p><p className="font-medium">{row.batches?.batch_name ?? "—"}</p></div>
              <div><p className="text-muted">Generated</p><p className="font-medium">{currency(row.generated_fees, settings.currency)}</p></div>
              <div><p className="text-muted">Pending</p>
                <Badge tone={row.pending_amount > 0 ? "yellow" : "green"}>
                  {currency(row.pending_amount, settings.currency)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/students/${row.id}`}><Button variant="secondary" className="text-xs px-3 py-1.5 min-h-0 h-8">View</Button></Link>
              <DeleteButton url={`/api/students/${row.id}`} label="Delete" />
              <StudentDialog batches={batches} student={row} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted py-10">No students found.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <thead>
            <tr>
              <Th>Student</Th><Th>Mobile</Th><Th>Batch</Th>
              <Th>Present</Th><Th>Generated</Th><Th>Paid</Th>
              <Th>Pending</Th><Th>Actions</Th>
            </tr>
          </thead>
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
                <Td>
                  <div className="flex gap-2">
                    <Link href={`/students/${row.id}`}><Button variant="secondary">View</Button></Link>
                    <DeleteButton url={`/api/students/${row.id}`} label="Delete" />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
